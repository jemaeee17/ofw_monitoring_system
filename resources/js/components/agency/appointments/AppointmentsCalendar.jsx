import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export default function AppointmentsCalendar({ appointments, onClose }) {
    const [selectedDate, setSelectedDate] = useState(null);

    const bookedDates = appointments.map(a => new Date(a.schedule_date).toDateString());

    const tileClassName = ({ date, view }) => {
        if (view === 'month' && bookedDates.includes(date.toDateString())) {
            return "bg-success text-white rounded";
        }
    };

    const dailyAppointments = appointments.filter(
        a => selectedDate && new Date(a.schedule_date).toDateString() === selectedDate.toDateString()
    );

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center" style={{ zIndex: 3000 }}>
            <div className="bg-white p-4 rounded shadow-lg" style={{ width: "90%", maxWidth: "600px" }}>
                <h5>Upcoming Appointments Calendar</h5>
                <Calendar
                    onClickDay={(date) => setSelectedDate(date)}
                    tileClassName={tileClassName}
                />
                {dailyAppointments.length > 0 && (
                    <div className="mt-3">
                        <h6>Appointments on {selectedDate.toLocaleDateString()}</h6>
                        <ul>
                            {dailyAppointments.map(a => (
                                <li key={a.id}>
                                    {a.name} - {a.schedule_time}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <button className="btn btn-secondary mt-3" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}