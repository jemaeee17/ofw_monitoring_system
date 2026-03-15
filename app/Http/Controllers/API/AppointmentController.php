<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\Notification;
use App\Models\Message;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ofw_id' => 'required|integer',
            'agency_id' => 'required|integer',
            'name' => 'required|string',
            'email' => 'required|email',
            'address' => 'required|string',
            'city' => 'required|string',
            'contact_person' => 'required|string',
            'phone' => 'required|string',
            'status' => 'required|string',
            'business_type' => 'required|string',
            'schedule_date' => 'required|string',
            'schedule_time' => 'required|string',
        ]);

        $appointment = Appointment::create($validated);

        $agencyNotification = Notification::create([
            'user_id' => null,
            'agency_id' => $validated['agency_id'],
            'type' => 'agency_appointment',
            'message' => $validated['name']
                . " booked an appointment on "
                . $validated['schedule_date']
                . " at "
                . $validated['schedule_time'],
            'is_read' => false,
        ]);

        $conversationId = $agencyNotification->id;

        $ofwMessage = "Your appointment is scheduled on "
            . $validated['schedule_date']
            . " at "
            . $validated['schedule_time']
            . ". Please arrive 15 minutes early.";

        Notification::create([
            'user_id' => $validated['ofw_id'],
            'agency_id' => $validated['agency_id'],
            'type' => 'user_appointment',
            'message' => $ofwMessage,
            'conversation_id' => $conversationId,
            'is_read' => false,
        ]);

        $agencyNotification->conversation_id = $conversationId;
        $agencyNotification->save();

        Message::create([
            'conversation_id' => $conversationId,
            'agency_id' => $validated['agency_id'],
            'ofw_id' => $validated['ofw_id'],
            'sender' => 'agency',
            'message' => $ofwMessage,
        ]);

        return response()->json([
            'message' => 'Appointment booked successfully!',
            'appointment' => $appointment
        ]);
    }

    public function index()
    {
        $agencyId = auth()->id();
        $appointments = Appointment::where('agency_id', $agencyId)->get();

        return response()->json($appointments);
    }

    public function fullyBookedDates(Request $request)
    {
        $agencyId = $request->query('agency_id');

        if (!$agencyId) {
            return response()->json([], 400);
        }

        return Appointment::where('agency_id', $agencyId)
            ->select('schedule_date')
            ->groupBy('schedule_date')
            ->havingRaw('COUNT(schedule_time) >= 8')
            ->get();
    }

    public function bookedTimes(Request $request, $date)
    {

        $agencyId = $request->query('agency_id', auth()->id());

        $times = Appointment::where('agency_id', $agencyId)
            ->where('schedule_date', $date)
            ->pluck('schedule_time');

        return response()->json($times);
    }


    public function updateAppointmentStatus(Request $request, $id)
    {
        $agencyId = auth()->id();

        $appointment = Appointment::where('id', $id)
            ->where('agency_id', $agencyId)
            ->firstOrFail();

        $status = $request->input('status');

        if (!in_array($status, ['done', 'missed'])) {
            return response()->json(['message' => 'Invalid status'], 400);
        }

        $appointment->appointment_status = $status;
        $appointment->save();

        return response()->json($appointment);
    }

    public function monthlyAppointments()
    {
        $agencyId = auth()->id();

        $count = Appointment::where('agency_id', $agencyId)
            ->whereMonth('schedule_date', Carbon::now()->month)
            ->whereYear('schedule_date', Carbon::now()->year)
            ->count();

        return response()->json(['monthlyAppointments' => $count]);
    }
}
