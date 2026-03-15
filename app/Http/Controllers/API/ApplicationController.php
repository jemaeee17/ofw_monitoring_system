<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Application;
use App\Models\ApplicantFlight;
use App\Models\ApplicantDocument;
use App\Models\Employer;
use App\Models\Appointment;
use App\Models\UrgentComplaint;
use App\Models\Complaint;

class ApplicationController extends Controller
{
    public function store(Request $request)
    {
        \Log::info('Incoming application request:', $request->all());

        try {
            $agencyId = auth('sanctum')->id();
            if (!$agencyId) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $data = $request->validate([
                'ref_code' => 'nullable|string|max:50',
                'position' => 'nullable|string|max:255',
                'full_name' => 'required|string|max:255',
                'address' => 'nullable|string|max:500',
                'birthdate' => 'required|date',
                'place_of_birth' => 'nullable|string|max:255',
                'contact_number' => 'required|string|max:20',
                'email' => 'nullable|email|max:255',
                'gender' => 'required|string|max:20',
                'religion' => 'nullable|string|max:50',
                'passport_number' => 'nullable|string|max:50',
                'passport_issue_place' => 'nullable|string|max:255',
                'passport_expiry' => 'nullable|date',
                'college' => 'nullable|string|max:255',
                'highschool' => 'nullable|string|max:255',
                'vocational' => 'nullable|string|max:255',
                'civil_status' => 'nullable|string|max:20',
                'height' => 'nullable|numeric',
                'weight' => 'nullable|numeric',
                'deployment_date' => 'nullable|date',
                'application_date' => 'nullable|date',
                'notes' => 'nullable|string|max:1000',
                'languages' => 'nullable|string|max:500',
                'work_history' => 'nullable|string|max:2000',
                'skills' => 'nullable|string|max:500',
                'objective' => 'nullable|string|max:1000',
                'photo' => 'nullable|image|max:2048',
            ]);

            $data['agency_id'] = $agencyId;

            if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
                $photoPath = $request->file('photo')->store('applications', 'public');
                $data['photo'] = $photoPath;
            }

            $application = Application::create($data);

            \Log::info('Application saved successfully:', ['id' => $application->id]);

            return response()->json([
                'message' => 'Application saved successfully',
                'applicantId' => $application->id
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $ve) {
            \Log::error('Validation failed:', $ve->errors());
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $ve->errors()
            ], 422);

        } catch (\Exception $e) {
            \Log::error('Application save failed: ' . $e->getMessage(), $request->all());
            return response()->json([
                'message' => 'Application save failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index(Request $request)
    {
        $agencyId = auth()->id();

        $query = Application::with('assignment')->where('agency_id', $agencyId);

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
                'assignedEmployer' => $app->assignment ? [
                    'employer_id' => $app->assignment->employer_id,
                    'position' => $app->assignment->job_title,
                    'salary' => $app->assignment->salary,
                ] : null,
            ];
        });

        return response()->json($formatted);
    }

    public function setEmployed($id)
    {
        $application = Application::where('id', $id)
            ->where('agency_id', auth()->id())
            ->firstOrFail();

        $application->status = 'Employed';
        $application->save();

        return response()->json([
            'message' => 'Applicant marked as employed.'
        ]);
    }

    public function getEmployed()
    {
        $agencyId = auth()->id();

        $employed = Application::where('agency_id', $agencyId)
            ->whereIn('status', ['Employed', 'Deployed'])
            ->get(['id', 'full_name', 'birthdate', 'contact_number', 'email', 'deployment_date', 'status']);

        return response()->json($employed);
    }

    public function setDeployed($id)
    {
        $application = Application::where('id', $id)
            ->where('agency_id', auth()->id())
            ->firstOrFail();

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
        $agencyId = auth()->id();

        $deployed = Application::where('agency_id', $agencyId)
            ->where('status', 'Deployed')
            ->get(['id', 'full_name', 'contact_number', 'email', 'deployment_date', 'status']);

        return response()->json($deployed);
    }

    public function updateRegistry(Request $request)
    {
        try {
            $agencyId = auth()->id();

            $application = Application::where('id', $request->worker_id)
                ->where('agency_id', $agencyId)
                ->firstOrFail();

            if (is_array($request->documents) && count($request->documents) > 0) {
                foreach ($request->documents as $doc) {
                    $document = ApplicantDocument::where('id', $doc['id'] ?? 0)
                        ->where('application_id', $application->id)
                        ->first();

                    if ($document && isset($doc['file']) && $doc['file']->isValid()) {
                        $path = $doc['file']->store('documents', 'public');
                        $document->file_path = $path;
                        $document->file_name = $doc['file']->getClientOriginalName();
                        $document->save();
                    }
                }
            }

            if (is_array($request->flights) && count($request->flights) > 0) {
                foreach ($request->flights as $flight) {
                    $flightRecord = ApplicantFlight::find($flight['id'] ?? 0);

                    if ($flightRecord && isset($flight['file']) && $flight['file']->isValid()) {
                        $path = $flight['file']->store('flights', 'public');
                        $flightRecord->file_path = $path;
                        $flightRecord->save();
                    }
                }
            }

            $documents = ApplicantDocument::where('application_id', $application->id)->get();
            $flights = ApplicantFlight::where('application_id', $application->id)->get();

            return response()->json([
                'message' => 'Updated successfully',
                'documents' => $documents,
                'flights' => $flights
            ]);

        } catch (\Exception $e) {
            \Log::error('Update registry failed: ' . $e->getMessage(), $request->all());

            return response()->json([
                'message' => 'Update registry failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function dashboardStats(Request $request)
    {
        try {

            if (!auth()->check()) {
                return response()->json([
                    'message' => 'User not authenticated'
                ], 401);
            }

            $agencyId = auth()->id();

            $totalApplicants = Application::where('agency_id', $agencyId)
                ->where('status', 'Applicant')
                ->count();

            $employed = Application::where('agency_id', $agencyId)
                ->where('status', 'Employed')
                ->count();

            $deployed = Application::where('agency_id', $agencyId)
                ->where('status', 'Deployed')
                ->count();

            $activeEmployers = Employer::where('agency_id', $agencyId)->count();

            return response()->json([
                'totalApplicants' => $totalApplicants,
                'employed' => $employed,
                'deployed' => $deployed,
                'activeEmployers' => $activeEmployers
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Dashboard stats error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function dashboardActivities(Request $request)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $agencyId = auth()->id();

        try {
            $activities = collect();

            $applicants = Application::where('agency_id', $agencyId)
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($app) => [
                    'name' => $app->full_name,
                    'description' => 'New applicant registered',
                    'type' => 'applicant',
                    'time' => $app->created_at
                ]);

            $employed = Application::where('agency_id', $agencyId)
                ->where('status', 'Employed')
                ->latest('updated_at')
                ->take(5)
                ->get()
                ->map(fn($app) => [
                    'name' => $app->full_name,
                    'description' => 'Marked as employed',
                    'type' => 'employed',
                    'time' => $app->updated_at
                ]);

            $deployed = Application::where('agency_id', $agencyId)
                ->where('status', 'Deployed')
                ->latest('updated_at')
                ->take(5)
                ->get()
                ->map(fn($app) => [
                    'name' => $app->full_name,
                    'description' => 'Deployed to ' . ($app->country ?? 'destination'),
                    'type' => 'deployed',
                    'time' => $app->updated_at
                ]);

            $appointments = Appointment::where('agency_id', $agencyId)->latest()
                ->take(5)
                ->get()
                ->map(fn($appt) => [
                    'name' => $appt->name,
                    'description' => 'Scheduled an appointment',
                    'type' => 'appointment',
                    'time' => $appt->created_at
                ]);

            $urgent = UrgentComplaint::where('agency_id', $agencyId)
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($complaint) => [
                    'name' => $complaint->ofw_name,
                    'description' => '🚨 Urgent complaint reported',
                    'type' => 'urgent',
                    'time' => $complaint->created_at
                ]);

            $normalComplaints = Complaint::where('agency_id', $agencyId)
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($complaint) => [
                    'name' => $complaint->ofw_name,
                    'description' => '📩 New complaint submitted',
                    'type' => 'complaint',
                    'time' => $complaint->created_at
                ]);

            $activities = $activities->merge($urgent)
                ->merge($normalComplaints)
                ->merge($applicants)
                ->merge($employed)
                ->merge($deployed)
                ->merge($appointments)
                ->sortByDesc('time')
                ->take(5)
                ->values();

            return response()->json($activities);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch activities',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getProfileForOfw()
    {
        $ofw = auth()->user();
        $app = Application::where('user_id', $ofw->id)->first();

        if (!$app) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

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

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $application = Application::where('user_id', $user->id)->first();

        if (!$application) {
            return response()->json([
                'message' => 'You must be an applicant first to edit your profile.'
            ], 403);
        }

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255|unique:applications,email,' . $application->id,
            'phone' => 'sometimes|nullable|string|max:20',
            'birthdate' => 'sometimes|date',
            'gender' => 'sometimes|string|max:20',
            'photo' => 'sometimes|nullable|image|max:2048'
        ]);

        if (isset($data['name'])) {
            $application->full_name = $data['name'];
        }

        if (isset($data['email'])) {
            $application->email = $data['email'];
        }

        if (isset($data['phone'])) {
            $application->contact_number = $data['phone'];
        }

        if (isset($data['birthdate'])) {
            $application->birthdate = $data['birthdate'];
        }

        if (isset($data['gender'])) {
            $application->gender = $data['gender'];
        }

        if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
            $path = $request->file('photo')->store('applications', 'public');
            $application->photo = $path;
        }

        try {
            $application->save();

            return response()->json([
                'message' => 'Profile updated successfully',
                'profile' => $application
            ]);
        } catch (\Exception $e) {
            \Log::error('Profile update failed: ' . $e->getMessage(), $request->all());

            return response()->json([
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deploymentStatus($email)
    {
        $application = Application::where('email', $email)
            ->latest()
            ->first();

        if (!$application) {
            return response()->json([
                'status' => 'none'
            ]);
        }

        return response()->json([
            'status' => $application->status
        ]);
    }
}
