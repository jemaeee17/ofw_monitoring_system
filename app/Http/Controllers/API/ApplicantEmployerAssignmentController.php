<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ApplicantEmployerAssignment;
use App\Models\Employer;
use App\Models\Application;

class ApplicantEmployerAssignmentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'applicant_id' => 'required|exists:applications,id',
            'employer_id' => 'required|exists:employers,id',
            'job_title' => 'required|string|max:255',
            'salary' => 'nullable|numeric',
            'status' => 'nullable|string'
        ]);

        $agencyId = $request->user()->id;

        $employer = Employer::where('id', $validated['employer_id'])
            ->where('agency_id', $agencyId)
            ->firstOrFail();

        $assignment = ApplicantEmployerAssignment::create(array_merge($validated, [
            'agency_id' => $agencyId
        ]));

        return response()->json([
            'message' => 'Assignment created successfully',
            'assignment' => $assignment
        ], 201);
    }



    public function index(Request $request)
    {
        $agencyId = auth()->id();

        $applications = Application::with('assignment')
            ->where('agency_id', $agencyId)
            ->get();

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
                'hasAssignedEmployer' => $app->assignment ? true : false, // ✅ explicit
            ];
        });

        return response()->json($formatted);
    }
}
