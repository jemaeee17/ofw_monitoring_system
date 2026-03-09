import React from "react";

export default function AppointmentsHeaderCards({ appointments }) {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const todaysAppointments = appointments.filter(
        (a) => new Date(a.schedule_date).toDateString() === today.toDateString()
    ).length;

    const monthlyAppointments = appointments.filter(
        (a) => {
            const d = new Date(a.schedule_date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        }
    ).length;

    const doneAppointmentsMonthly = appointments.filter(
        (a) => a.appointment_status === "done" && new Date(a.schedule_date).getMonth() === currentMonth
    ).length;

    const missedAppointmentsMonthly = appointments.filter(
        (a) => a.appointment_status === "missed" && new Date(a.schedule_date).getMonth() === currentMonth
    ).length;

    const fullyBookedDates = [...new Set(
        appointments
            .filter(a => a.appointment_status !== "missed")
            .map(a => new Date(a.schedule_date).toDateString())
    )].length;

    return (
        <div className="d-flex gap-3 mb-4">
            <div className="card p-3 flex-fill bg-primary text-white">
                <h6>Today's Appointments</h6>
                <h4>{todaysAppointments}</h4>
            </div>
            <div className="card p-3 flex-fill bg-success text-white">
                <h6>Monthly Appointments</h6>
                <h4>{monthlyAppointments}</h4>
            </div>
            <div className="card p-3 flex-fill bg-warning text-dark">
                <h6>Fully Booked Dates</h6>
                <h4>{fullyBookedDates}</h4>
            </div>
            <div className="card p-3 flex-fill bg-danger text-white">
                <h6>Missed Appointments (Monthly)</h6>
                <h4>{missedAppointmentsMonthly}</h4>
            </div>
            <div className="card p-3 flex-fill bg-info text-white">
                <h6>Done Appointments (Monthly)</h6>
                <h4>{doneAppointmentsMonthly}</h4>
            </div>
        </div>
    );
}