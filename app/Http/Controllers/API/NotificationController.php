<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function getNotifications($user_id)
    {
        return Notification::where('user_id', $user_id)
            ->latest()
            ->get();
    }

    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->is_read = true;
        $notification->save();

        return response()->json(['success' => true]);
    }

    public function getActivities()
    {
        $activities = Notification::whereNull('user_id')
            ->where('type', 'admin')
            ->latest()
            ->take(10)
            ->get(['id', 'message', 'created_at']);

        return response()->json($activities);
    }

    public function agencyAppointmentMessages()
    {
        $messages = Notification::where('type', 'agency_appointment')
            ->latest()
            ->get()
            ->map(function ($msg) {
                return [
                    'id' => $msg->id,
                    'message' => $msg->message,
                    'created_at' => $msg->created_at,
                    'sender' => 'OFW',
                ];
            });

        return response()->json($messages);
    }

    public function agencyUrgentMessages()
    {
        $messages = Notification::where('type', 'urgent')
            ->latest()
            ->get();

        $messages->transform(function ($msg) {
            if ($msg->type === 'urgent') {
                $complaint = \App\Models\UrgentComplaint::where('ofw_name', str_replace('🚨 Urgent complaint submitted by ', '', $msg->message))->first();
                if ($complaint) {
                    $msg->ofw_name = $complaint->ofw_name;
                    $msg->city = $complaint->city;
                    $msg->address = $complaint->address;
                    $msg->latitude = $complaint->latitude;
                    $msg->longitude = $complaint->longitude;
                }
            }
            return $msg;
        });

        return response()->json($messages);
    }

    public function agencyNormalMessages()
    {
        $messages = Notification::where('type', 'complaint')
            ->latest()
            ->get();

        $messages->transform(function ($msg) {
            $complaint = null;
            if ($msg->related_id) {
                $complaint = \App\Models\Complaint::find($msg->related_id);
            }

            if (!$complaint) {
                $ofwName = str_replace('New complaint submitted by ', '', $msg->message);
                $complaint = \App\Models\Complaint::where('ofw_name', $ofwName)
                    ->latest()
                    ->first();
            }

            if ($complaint) {
                $msg->ofw_name = $complaint->ofw_name;
                $msg->gender = $complaint->gender;
                $msg->birthdate = $complaint->birthdate;
                $msg->occupation = $complaint->occupation;
                $msg->national_id = $complaint->national_id;
                $msg->passport_no = $complaint->passport_no;
                $msg->email = $complaint->email;
                $msg->contact_person = $complaint->contact_person;
                $msg->primary_contact = $complaint->primary_contact;
                $msg->secondary_contact = $complaint->secondary_contact;
                $msg->address_abroad = $complaint->address_abroad;
                $msg->complaint_text = $complaint->complaint;
                $msg->image1 = $complaint->image1;
                $msg->image2 = $complaint->image2;
                $msg->image3 = $complaint->image3;
                $msg->agency = $complaint->coHost->name ?? null;

                $msg->images = array_filter([
                    $complaint->image1,
                    $complaint->image2,
                    $complaint->image3
                ]);
            }

            return $msg;
        });

        return response()->json($messages);
    }
}
