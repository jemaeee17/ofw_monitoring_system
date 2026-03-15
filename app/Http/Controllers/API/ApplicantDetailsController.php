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
        $agencyId = $request->user()->id;

        $application = Application::where('id', $applicationId)
            ->where('agency_id', $agencyId)
            ->firstOrFail();

        if ($request->has('documents')) {
            foreach ($request->documents as $index => $doc) {
                $file = $request->file("documents.$index.file");

                if ($file) {
                    $filePath = $file->store('documents', 'public');
                    $originalName = $file->getClientOriginalName();

                    $document = ApplicantDocument::where([
                        'application_id' => $application->id,
                        'type' => $doc['type'] ?? null,
                    ])->first();

                    if ($document && $document->file_path) {
                        Storage::disk('public')->delete($document->file_path);
                    }

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
                $originalName = null;

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
                        'file_name' => $originalName,
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

    public function show(Request $request, $applicationId)
    {
        $agencyId = $request->user()->id;

        $application = Application::with(['documents', 'flights'])
            ->where('id', $applicationId)
            ->where('agency_id', $agencyId)
            ->firstOrFail();

        return response()->json($application);
    }
}