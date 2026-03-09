<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employer;


class EmployerController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'business_type' => 'nullable|string',
            'industry_sector' => 'nullable|string',
            'position' => 'nullable|string',
            'cr_number' => 'nullable|string',
            'email' => 'nullable|email',
            'website' => 'nullable|string',
            'regional_office_address' => 'nullable|string',
            'poc_name' => 'nullable|string',
            'poc_contact_number' => 'nullable|string',
        ]);

        $employer = Employer::create($validated);

        return response()->json([
            'message' => 'Employer saved successfully',
            'employer' => $employer
        ], 201);
    }

    public function index()
    {
        $employers = Employer::withCount('assignedApplicants')->latest()->get();

        return response()->json($employers);
    }
}
