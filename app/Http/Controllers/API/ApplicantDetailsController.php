<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\ApplicantDocument;
use App\Models\ApplicantFlight;
use Illuminate\Support\Facades\Storage;

class ApplicantDetailsController extends Controller
{
    public function store(Request $request, $applicationId)
    {
        $application = Application::findOrFail($applicationId);

        if ($request->has('documents')) {
            foreach ($request->documents as $index => $doc) {
                $file = $request->file("documents.$index.file");

                if ($file) {
                    $filePath = $file->store('documents', 'public');
                    $originalName = $file->getClientOriginalName();

                    ApplicantDocument::updateOrCreate(
                        [
                            'application_id' => $application->id,
                            'type' => $doc['type'] ?? null, 
                        ],
                        [
                            'file_path' => $filePath,
                            'file_name' => $originalName
                        ]
                    );
                }
            }
        }

        if ($request->has('flights')) {
            foreach ($request->flights as $index => $flight) {
                $file = $request->file("flights.$index.file");
                $filePath = null;

                if ($file) {
                    $filePath = $file->store('flights', 'public');
                    $originalName = $file->getClientOriginalName();
                }

                ApplicantFlight::updateOrCreate(
                    [
                        'application_id' => $application->id,
                        'agency' => $flight['agency'] ?? null,
                    ],
                    [
                        'file_path' => $filePath,
                        'file_name' => $originalName ?? null,
                        'contact_name' => $flight['contactName'] ?? null,
                        'contact_number' => $flight['contactNumber'] ?? null,
                    ]
                );
            }
        }

        return response()->json([
            'message' => 'Details saved successfully.'
        ]);
    }

    public function show($applicationId)
    {
        $application = Application::with(['documents', 'flights'])->findOrFail($applicationId);
        return response()->json($application);
    }
}