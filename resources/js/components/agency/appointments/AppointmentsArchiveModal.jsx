import React from "react";

export default function AppointmentsArchiveModal({ show, onClose, dates = [], onDateClick }) {
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
            <div className="bg-white shadow-lg p-4" style={{ borderRadius: "15px", width: "400px" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold m-0">Appointments Archive</h5>
                    <button className="btn btn-secondary btn-sm" onClick={onClose}>Close</button>
                </div>

                {(!dates || dates.length === 0) ? (
                    <p>No archived appointments.</p>
                ) : (
                    <ul className="list-group">
                        {dates.map((date) => (
                            <li
                                key={date}
                                className="list-group-item list-group-item-action"
                                style={{ cursor: "pointer" }}
                                onClick={() => onDateClick(date)}
                            >
                                Appointments on {new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}