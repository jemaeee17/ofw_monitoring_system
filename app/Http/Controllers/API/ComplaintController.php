<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Complaint;
use App\Models\CoHost;
use Carbon\Carbon;
use App\Models\Notification;
use App\Models\User;
use App\Models\Message;

class ComplaintController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'ofw_id' => 'required|integer|exists:users,id',
            'co_host_id' => 'required|integer|exists:co_hosts,id',
            'ofw_name' => 'nullable|string',
            'gender' => 'nullable|string',
            'birthdate' => 'nullable|date',
            'occupation' => 'nullable|string',
            'national_id' => 'nullable|string',
            'passport_no' => 'nullable|string',
            'email' => 'nullable|email',
            'contact_person' => 'nullable|string',
            'primary_contact' => 'nullable|string',
            'secondary_contact' => 'nullable|string',
            'address_abroad' => 'nullable|string',
            'image1' => 'nullable|image',
            'image2' => 'nullable|image',
            'image3' => 'nullable|image',
            'complaint' => 'required|string',
        ]);

        $ofw = User::find($request->ofw_id);

        if (!$ofw) {
            return response()->json([
                'message' => 'OFW not found'
            ], 404);
        }

        $agencyId = $ofw->agency_id;

        if (!$agencyId) {
            return response()->json([
                'message' => 'OFW is not assigned to an agency'
            ], 400);
        }

        $data = [
            'ofw_id' => $ofw->id,
            'ofw_name' => $ofw->name,
            'agency_id' => $agencyId,
            'co_host_id' => $request->co_host_id,
            'gender' => $request->gender,
            'birthdate' => $request->birthdate,
            'occupation' => $request->occupation,
            'national_id' => $request->national_id,
            'passport_no' => $request->passport_no,
            'email' => $request->email,
            'contact_person' => $request->contact_person,
            'primary_contact' => $request->primary_contact,
            'secondary_contact' => $request->secondary_contact,
            'address_abroad' => $request->address_abroad,
            'complaint' => $request->complaint
        ];

        foreach (['image1', 'image2', 'image3'] as $img) {
            if ($request->hasFile($img)) {
                $data[$img] = $request->file($img)->store('complaints', 'public');
            }
        }

        $complaint = Complaint::create($data);

        $notification = Notification::create([
            'agency_id' => $agencyId,
            'user_id' => null,
            'type' => 'complaint',
            'message' => 'New complaint submitted by ' . $complaint->ofw_name,
            'is_read' => false
        ]);

        $conversationId = $notification->id;

        $notification->conversation_id = $conversationId;
        $notification->save();

        $complaint->conversation_id = $conversationId;
        $complaint->save();

        Notification::create([
            'user_id' => $ofw->id,
            'agency_id' => $agencyId,
            'type' => 'complaint',
            'message' => 'Your complaint has been received. Our agency will review it shortly.',
            'conversation_id' => $conversationId,
            'is_read' => false
        ]);

        $complaintMessage =
            "📄 COMPLAINT REPORT\n\n" .
            "Name: {$complaint->ofw_name}\n" .
            "Gender: {$complaint->gender}\n" .
            "Birthdate: {$complaint->birthdate}\n" .
            "Occupation: {$complaint->occupation}\n\n" .
            "Passport No: {$complaint->passport_no}\n" .
            "National ID: {$complaint->national_id}\n\n" .
            "Address Abroad:\n{$complaint->address_abroad}\n\n" .
            "Complaint Details:\n{$complaint->complaint}\n\n";

        $baseUrl = url('/storage');

        if ($complaint->image1 || $complaint->image2 || $complaint->image3) {
            $complaintMessage .= "Evidence Images:\n\n";

            if ($complaint->image1) {
                $complaintMessage .= $baseUrl . "/" . $complaint->image1 . "\n";
            }

            if ($complaint->image2) {
                $complaintMessage .= $baseUrl . "/" . $complaint->image2 . "\n";
            }

            if ($complaint->image3) {
                $complaintMessage .= $baseUrl . "/" . $complaint->image3 . "\n";
            }
        }

        Message::create([
            'conversation_id' => $conversationId,
            'agency_id' => $agencyId,
            'ofw_id' => $ofw->id,
            'sender' => 'ofw',
            'message' => $complaintMessage,
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
