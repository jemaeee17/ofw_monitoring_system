<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\ApplicantFlight;
use App\Models\ApplicantDocument;
use App\Models\Employer;
use App\Models\Appointment;

class ApplicationController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->all();

        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('applications', 'public');
            $data['photo'] = $photoPath;
        }

        Application::create($data);

        return response()->json([
            'message' => 'Application saved successfully'
        ], 201);
    }

    public function index(Request $request)
    {
        $query = Application::query();

        if ($request->status && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        $applications = $query->get();

        $formatted = $applications->map(function ($app) {
            return [
                'id' => $app->id,
                'full_name' => $app->full_name,
                'birthdate' => $app->birthdate,
                'created_at' => $app->created_at,
                'gender' => $app->gender,
                'contact_number' => $app->contact_number,
                'email' => $app->email ?? 'N/A',
                'status' => $app->status ?? 'Applicant',
            ];
        });

        return response()->json($formatted);
    }

    public function setEmployed($id)
    {
        $application = Application::findOrFail($id);

        $application->status = 'Employed';
        $application->save();

        return response()->json([
            'message' => 'Applicant marked as employed.'
        ]);
    }

    public function getEmployed()
    {
        $employed = Application::whereIn('status', ['Employed', 'Deployed'])
            ->get(['id', 'full_name', 'birthdate', 'contact_number', 'email', 'deployment_date', 'status']);

        return response()->json($employed);
    }

    public function setDeployed($id)
    {
        $application = Application::findOrFail($id);

        if ($application->status !== 'Employed') {
            return response()->json([
                'message' => 'Only employed applicants can be deployed.'
            ], 400);
        }

        $application->status = 'Deployed';
        $application->save();

        return response()->json([
            'message' => $application->full_name . ' status updated to Deployed.',
            'status' => $application->status
        ]);
    }

    public function deployed()
    {
        $deployed = Application::where('status', 'Deployed')->get([
            'id',
            'full_name',
            'contact_number',
            'email',
            'deployment_date',
            'status',
        ]);

        return response()->json($deployed);
    }

    public function updateRegistry(Request $request)
    {
        if ($request->documents) {
            foreach ($request->documents as $doc) {

                $document = ApplicantDocument::find($doc['id']);

                if ($document && isset($doc['file'])) {

                    $path = $doc['file']->store('documents', 'public');

                    $document->file_path = $path;
                    $document->file_name = $doc['file']->getClientOriginalName();
                    $document->save();
                }
            }
        }

        if ($request->flights) {
            foreach ($request->flights as $flight) {

                $flightRecord = ApplicantFlight::find($flight['id']);

                if ($flightRecord && isset($flight['file'])) {

                    $path = $flight['file']->store('flights', 'public');

                    $flightRecord->file_path = $path;
                    $flightRecord->save();
                }
            }
        }

        $documents = ApplicantDocument::where('application_id', $request->worker_id)->get();
        $flights = ApplicantFlight::where('application_id', $request->worker_id)->get();

        return response()->json([
            'message' => 'Updated successfully',
            'documents' => $documents,
            'flights' => $flights
        ]);
    }

    public function dashboardStats()
    {
        $totalApplicants = Application::count();

        $employed = Application::whereIn('status', ['Employed', 'Deployed'])->count();

        $deployed = Application::where('status', 'Deployed')->count();

        $activeEmployers = Employer::count();

        return response()->json([
            'totalApplicants' => $totalApplicants,
            'employed' => $employed,
            'deployed' => $deployed,
            'activeEmployers' => $activeEmployers
        ]);
    }

    public function dashboardActivities()
    {
        $activities = collect();

        $applicants = Application::latest()
            ->take(5)
            ->get()
            ->map(function ($app) {
                return [
                    'name' => $app->full_name,
                    'description' => 'New applicant registered',
                    'type' => 'applicant',
                    'time' => $app->created_at
                ];
            });

        $employed = Application::where('status', 'Employed')
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(function ($app) {
                return [
                    'name' => $app->full_name,
                    'description' => 'Marked as employed',
                    'type' => 'employed',
                    'time' => $app->updated_at
                ];
            });

        $deployed = Application::where('status', 'Deployed')
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(function ($app) {
                return [
                    'name' => $app->full_name,
                    'description' => 'Deployed to Saudi Arabia',
                    'type' => 'deployed',
                    'time' => $app->updated_at
                ];
            });

        $appointments = Appointment::latest()
            ->take(5)
            ->get()
            ->map(function ($appt) {
                return [
                    'name' => $appt->name,
                    'description' => 'Scheduled an appointment',
                    'type' => 'appointment',
                    'time' => $appt->created_at
                ];
            });

        $activities = $activities
            ->merge($applicants)
            ->merge($employed)
            ->merge($deployed)
            ->merge($appointments)
            ->sortByDesc('time')
            ->take(5)
            ->values();

        return response()->json($activities);
    }

    public function getProfile($id)
    {
        $app = Application::findOrFail($id);

        return response()->json([
            'id' => $app->id,
            'name' => $app->full_name,
            'email' => $app->email ?? '',
            'phone' => $app->contact_number ?? '',
            'title' => 'Overseas Filipino Worker',
            'birthdate' => $app->birthdate,
            'gender' => $app->gender,
            'photo' => $app->photo ?? null
        ]);
    }

    public function updateProfile(Request $request, $id)
    {
        $app = Application::findOrFail($id);

        $app->full_name = $request->name;
        $app->email = $request->email;
        $app->contact_number = $request->phone;

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('applications', 'public');
            $app->photo = $path;
        }

        $app->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $app
        ]);
    }
}
