<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Complaint;
use App\Models\CoHost;
use Carbon\Carbon;
use App\Models\Notification;

class ComplaintController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->all();

        if (isset($data['agency'])) {
            $data['co_host_id'] = $data['agency'];
        }

        foreach (['image1', 'image2', 'image3'] as $img) {
            if ($request->hasFile($img)) {
                $data[$img] = $request->file($img)->store('complaints', 'public');
            }
        }

        $complaint = Complaint::create($data);

        Notification::create([
            'user_id' => null,
            'type' => 'complaint',
            'related_id' => $complaint->id,
            'message' => 'New complaint submitted by ' . $complaint->ofw_name,
            'is_read' => false
        ]);

        return response()->json([
            'message' => 'Complaint submitted successfully',
            'data' => $complaint
        ]);
    }

    public function index()
    {
        $complaints = Complaint::where('status', '!=', 'done')
            ->with('coHost')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'message' => 'Active complaints fetched',
            'data' => $complaints
        ]);
    }

    public function agencies()
    {
        return CoHost::all();
    }

    public function markAsDone($id)
    {
        $complaint = Complaint::findOrFail($id);
        $complaint->status = 'done';
        $complaint->save();

        return response()->json([
            'message' => 'Complaint marked as done',
            'data' => $complaint
        ]);
    }

    public function archived()
    {
        $complaints = Complaint::where('status', 'done')->with('coHost')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'message' => 'Archived complaints fetched',
            'data' => $complaints
        ]);
    }

    public function getMonthlyNormalComplaints()
    {
        $count = Complaint::whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->count();

        return response()->json([
            'monthlyNormalComplaints' => $count
        ]);
    }

    public function getTodayNormalComplaints()
    {
        $count = Complaint::whereDate('created_at', Carbon::today())->count();

        return response()->json([
            'todayNormalComplaints' => $count
        ]);
    }
}
