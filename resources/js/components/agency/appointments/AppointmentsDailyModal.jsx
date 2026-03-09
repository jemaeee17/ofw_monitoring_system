import React from "react";

export default function AppointmentsDailyModal({ show, onClose, appointments }) {
    if (!show) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 5000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                className="bg-white shadow-lg p-4"
                style={{
                    borderRadius: "15px",
                    width: "90%",
                    maxWidth: "900px",
                    maxHeight: "80%",
                    overflowY: "auto",
                }}
            >
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold m-0">Appointments on {appointments[0] ? new Date(appointments[0].schedule_date).toLocaleDateString() : ""}</h5>
                    <button className="btn btn-secondary btn-sm" onClick={onClose}>Close</button>
                </div>

                {appointments.length === 0 ? (
                    <p>No appointments on this day.</p>
                ) : (
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>OFW Name</th>
                                <th>Email</th>
                                <th>Contact Number</th>
                                <th>Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((a) => (
                                <tr key={a.id}>
                                    <td>{a.name}</td>
                                    <td>{a.email}</td>
                                    <td>{a.phone}</td>
                                    <td>{a.schedule_time}</td>
                                    <td>
                                        {a.appointment_status ? (
                                            <span className={`badge ${a.appointment_status === "done" ? "bg-success" : "bg-danger"}`}>
                                                {a.appointment_status.toUpperCase()}
                                            </span>
                                        ) : (
                                            <span className="badge bg-secondary">Pending</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}