<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;
use App\Models\UrgentComplaint;
use App\Models\Complaint;

class NotificationController extends Controller
{
    public function getNotifications()
    {
        return Notification::where('user_id', auth()->id())
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
        $agencyId = auth()->id();

        $messages = Notification::where('type', 'agency_appointment')
            ->where('agency_id', $agencyId)
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
        $agencyId = auth()->id();

        $messages = Notification::where('type', 'urgent')
            ->where('agency_id', $agencyId)
            ->whereNull('user_id')
            ->latest()
            ->get();
        $messages->transform(function ($msg) {

            $ofwName = str_replace('🚨 Urgent complaint submitted by ', '', $msg->message);

            $complaint = UrgentComplaint::where('ofw_name', $ofwName)
                ->latest()
                ->first();

            if ($complaint) {
                $msg->ofw_name = $complaint->ofw_name;
                $msg->city = $complaint->city;
                $msg->address = $complaint->address;
                $msg->latitude = $complaint->latitude;
                $msg->longitude = $complaint->longitude;
            }

            return $msg;
        });

        return response()->json($messages);
    }

    public function agencyNormalMessages()
    {
        $agencyId = auth()->id();

        $messages = Notification::where('type', 'complaint')
            ->where('agency_id', $agencyId)
            ->whereNull('user_id')
            ->latest()
            ->get();

        $messages->transform(function ($msg) {
            $complaint = null;
            if ($msg->conversation_id) {
                $complaint = Complaint::where('ofw_name', 'LIKE', '%' . $msg->message . '%')
                    ->latest()
                    ->first();
            }

            if (!$complaint) {
                $ofwName = str_replace('New complaint submitted by ', '', $msg->message);
                $complaint = Complaint::where('ofw_name', $ofwName)
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

    public function createAgencyNotification($message, $type = 'agency_appointment', $agencyId = null)
    {
        return Notification::create([
            'type' => $type,
            'message' => $message,
            'is_read' => false,
            'agency_id' => $agencyId,
        ]);
    }
}
