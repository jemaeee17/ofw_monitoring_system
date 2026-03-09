<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\Notification;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ofw_id' => 'required|integer',
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

        Notification::create([
            'user_id' => $validated['ofw_id'],
            'type' => 'user_appointment',
            'message' => "Your appointment is scheduled on "
                . $validated['schedule_date']
                . " at "
                . $validated['schedule_time']
                . ". Please arrive 15 minutes early.",
            'is_read' => false
        ]);

        Notification::create([
            'user_id' => null,
            'type' => 'agency_appointment',
            'message' => $validated['name']
                . " booked an appointment on "
                . $validated['schedule_date']
                . " at "
                . $validated['schedule_time'],
            'is_read' => false
        ]);

        return response()->json([
            'message' => 'Appointment booked successfully!',
            'appointment' => $appointment
        ]);
    }

    public function index()
    {
        return Appointment::all();
    }

    public function fullyBookedDates()
    {
        return Appointment::select('schedule_date')
            ->groupBy('schedule_date')
            ->havingRaw('COUNT(schedule_time) >= 8')
            ->get();
    }

    public function bookedTimes($date)
    {
        $times = Appointment::where('schedule_date', $date)
            ->pluck('schedule_time');

        return response()->json($times);
    }

    public function updateAppointmentStatus(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);
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
        $count = Appointment::whereMonth('schedule_date', Carbon::now()->month)
            ->whereYear('schedule_date', Carbon::now()->year)
            ->count();

        return response()->json([
            'monthlyAppointments' => $count
        ]);
    }
}
