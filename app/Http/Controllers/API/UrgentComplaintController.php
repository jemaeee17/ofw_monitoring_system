<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UrgentComplaint;
use Carbon\Carbon;
use App\Models\Notification;

class UrgentComplaintController extends Controller
{
    public function store(Request $request)
    {
        $urgentComplaint = UrgentComplaint::create([
            'co_host_id' => $request->co_host_id,
            'ofw_name' => $request->ofw_name,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'city' => $request->city,
            'address' => $request->address,
        ]);

        Notification::create([
            'user_id' => null,
            'type' => 'urgent',
            'message' => '🚨 Urgent complaint submitted by ' . $urgentComplaint->ofw_name,
            'is_read' => false
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