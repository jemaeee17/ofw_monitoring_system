import React, { useState } from "react";
import AppointmentsArchiveModal from "./AppointmentsArchiveModal";
import AppointmentsDailyModal from "./AppointmentsDailyModal";

export default function AppointmentsTable({ appointments, onStatusChange, onShowCalendar, onShowArchive }) {
    const today = new Date();
    const todaysAppointments = appointments.filter(
        (a) => new Date(a.schedule_date).toDateString() === today.toDateString()
    );
    const [showArchive, setShowArchive] = useState(false);
    const [archiveAppointments, setArchiveAppointments] = useState([]);
    const [selectedDateAppointments, setSelectedDateAppointments] = useState([]);
    const [showDailyModal, setShowDailyModal] = useState(false);

    const archivedDates = [
        ...new Set(
            appointments
                .filter(a => new Date(a.schedule_date) < today && (a.appointment_status === "done" || a.appointment_status === "missed"))
                .map(a => a.schedule_date)
        )
    ];

    const handleStatusUpdate = (id, status) => {
        if (onStatusChange) onStatusChange(id, status);
    };

    const groupedByDate = [...new Set(
        appointments.map(a => new Date(a.schedule_date).toDateString())
    )].sort((a, b) => new Date(a) - new Date(b));

    const openDailyModal = (date) => {
        const filtered = appointments.filter(a => isSameDay(a.schedule_date, date));
        setSelectedDateAppointments(filtered);
        setShowDailyModal(true);
    };

    const handleShowArchive = () => {
        const sorted = [...appointments].sort(
            (a, b) => new Date(a.schedule_date) - new Date(b.schedule_date)
        );
        setArchiveAppointments(sorted);
        setShowArchive(true);
    };

    const isSameDay = (d1, d2) => {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    return (
        <div className="card shadow-sm border-0 p-4 position-relative">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold m-0">Today's Appointments</h4>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={onShowCalendar}>
                        Upcoming Appointments
                    </button>
                    <button className="btn btn-secondary" onClick={handleShowArchive}>
                        Archive
                    </button>
                </div>
            </div>

            {todaysAppointments.length === 0 ? (
                <p>No appointments for today.</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>OFW Name</th>
                            <th>Email</th>
                            <th>Contact Number</th>
                            <th>Appointment Date</th>
                            <th>Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todaysAppointments.map((a) => (
                            <tr key={a.id}>
                                <td>{a.name}</td>
                                <td>{a.email}</td>
                                <td>{a.phone}</td>
                                <td>{new Date(a.schedule_date).toLocaleDateString()}</td>
                                <td>{a.schedule_time}</td>
                                <td>
                                    {a.appointment_status === "done" || a.appointment_status === "missed" ? (
                                        <span className={`badge ${a.appointment_status === "done" ? "bg-success" : "bg-danger"}`}>
                                            {a.appointment_status.toUpperCase()}
                                        </span>
                                    ) : (
                                        <div className="d-flex gap-2 justify-content-center">
                                            <button className="btn btn-sm btn-success" onClick={() => handleStatusUpdate(a.id, "done")}>
                                                Done
                                            </button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleStatusUpdate(a.id, "missed")}>
                                                Missed
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <AppointmentsArchiveModal
                show={showArchive}
                onClose={() => setShowArchive(false)}
                dates={archivedDates}
                onDateClick={openDailyModal}
            />

            <AppointmentsDailyModal
                show={showDailyModal}
                onClose={() => setShowDailyModal(false)}
                appointments={selectedDateAppointments}
            />
        </div>
    );
}