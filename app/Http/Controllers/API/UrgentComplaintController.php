<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UrgentComplaint;
use Carbon\Carbon;
use App\Models\Notification;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Message;

class UrgentComplaintController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            'ofw_id' => 'required|integer',
            'latitude' => 'required',
            'longitude' => 'required',
            'city' => 'nullable|string',
            'address' => 'nullable|string'
        ]);

        $ofw = User::find($request->ofw_id);

        if (!$ofw) {
            return response()->json([
                'message' => 'OFW not found.'
            ], 404);
        }

        $agencyId = $ofw->agency_id;

        if (!$agencyId) {
            return response()->json([
                'message' => 'OFW is not assigned to an agency.'
            ], 400);
        }

        $urgentComplaint = UrgentComplaint::create([
            'ofw_id' => $ofw->id,
            'ofw_name' => $request->ofw_name,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'city' => $request->city,
            'address' => $request->address,
            'agency_id' => $agencyId,
            'status' => 'pending'
        ]);

        $agencyNotification = Notification::create([
            'user_id' => null,
            'agency_id' => $agencyId,
            'type' => 'urgent',
            'message' => '🚨 Urgent complaint submitted by ' . $urgentComplaint->ofw_name,
            'is_read' => false
        ]);

        $conversationId = $agencyNotification->id;

        $agencyNotification->conversation_id = $conversationId;
        $agencyNotification->save();

        $urgentComplaint->conversation_id = $conversationId;
        $urgentComplaint->save();

        Notification::create([
            'user_id' => $ofw->id,
            'agency_id' => $agencyId,
            'type' => 'urgent',
            'message' => 'Your urgent complaint has been received. Our agency will respond shortly.',
            'conversation_id' => $conversationId,
            'is_read' => false
        ]);

        $rescueMessage =
            "🚨 URGENT HELP REQUEST\n\n" .
            "Name: {$urgentComplaint->ofw_name}\n" .
            "City: {$urgentComplaint->city}\n" .
            "Address: {$urgentComplaint->address}\n\n" .
            "Latitude: {$urgentComplaint->latitude}\n" .
            "Longitude: {$urgentComplaint->longitude}\n\n" .
            "Google Maps:\n" .
            "https://maps.google.com/?q={$urgentComplaint->latitude},{$urgentComplaint->longitude}";

        Message::create([
            'conversation_id' => $conversationId,
            'agency_id' => $agencyId,
            'ofw_id' => $ofw->id,
            'sender' => 'ofw',
            'message' => $rescueMessage,
        ]);

        return response()->json([
            'message' => 'Urgent complaint submitted successfully',
            'data' => $urgentComplaint
        ]);
    }

    public function index()
    {
        $urgentComplaints = UrgentComplaint::where('status', '!=', 'done')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'message' => 'Active urgent complaints fetched',
            'data' => $urgentComplaints
        ]);
    }

    public function show($id)
    {
        $complaint = UrgentComplaint::findOrFail($id);

        return response()->json($complaint);
    }

    public function markAsDone($id)
    {
        $complaint = UrgentComplaint::findOrFail($id);
        $complaint->status = 'done';
        $complaint->save();

        return response()->json([
            'message' => 'Urgent complaint marked as done',
            'data' => $complaint
        ]);
    }

    public function archived()
    {
        $complaints = UrgentComplaint::where('status', 'done')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'message' => 'Archived urgent complaints fetched',
            'data' => $complaints
        ]);
    }

    public function getMonthlyUrgentComplaints()
    {
        $count = UrgentComplaint::whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->count();

        return response()->json([
            'monthlyUrgentComplaints' => $count
        ]);
    }

    public function getTodayUrgentComplaints()
    {
        $count = UrgentComplaint::whereDate('created_at', Carbon::today())->count();

        return response()->json([
            'todayUrgentComplaints' => $count
        ]);
    }
}