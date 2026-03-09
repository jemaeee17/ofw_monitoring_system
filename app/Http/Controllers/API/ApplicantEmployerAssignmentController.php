<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ApplicantEmployerAssignment;

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

        $assignment = ApplicantEmployerAssignment::create($validated);

        return response()->json([
            'message' => 'Assignment created successfully',
            'assignment' => $assignment
        ], 201);
    }

    public function index()
    {
        return ApplicantEmployerAssignment::with(['applicant', 'employer'])->latest()->get();
    }
}
