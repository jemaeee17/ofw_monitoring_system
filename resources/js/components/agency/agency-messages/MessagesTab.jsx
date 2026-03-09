import React, { useState, useEffect } from "react";
import axios from "axios";

const MessagesTab = () => {
    const [activeTab, setActiveTab] = useState("appointments");
    const [selectedChat, setSelectedChat] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [urgent, setUrgent] = useState([]);
    const [normal, setNormal] = useState([]);

    useEffect(() => {
        if (activeTab === "appointments") {
            axios.get("/api/messages/agency-appointments")
                .then(res => setAppointments(res.data))
                .catch(err => console.error(err));
        } else if (activeTab === "urgent") {
            axios.get("/api/messages/urgent")
                .then(res => setUrgent(res.data))
                .catch(err => console.error(err));
        } else if (activeTab === "normal") {
            axios.get("/api/messages/normal")
                .then(res => setNormal(res.data))
                .catch(err => console.error(err));
        }
    }, [activeTab]);

    const chats = activeTab === "appointments"
        ? appointments
        : activeTab === "urgent"
            ? urgent
            : normal;

    return (
        <div className="container-fluid">

            {/* TITLE */}
            <h4 className="fw-bold mb-3">Messages</h4>

            {/* TABS */}
            <div className="d-flex gap-2 border-bottom pb-2 mb-3">
                <button
                    className={`btn ${activeTab === "appointments" ? "btn-primary" : "btn-light"}`}
                    onClick={() => { setActiveTab("appointments"); setSelectedChat(null); }}
                >
                    📅 Appointments
                </button>

                <button
                    className={`btn ${activeTab === "urgent" ? "btn-danger" : "btn-light"}`}
                    onClick={() => { setActiveTab("urgent"); setSelectedChat(null); }}
                >
                    🚨 Urgent Complaints
                </button>

                <button
                    className={`btn ${activeTab === "normal" ? "btn-success" : "btn-light"}`}
                    onClick={() => { setActiveTab("normal"); setSelectedChat(null); }}
                >
                    💬 Normal Complaints
                </button>
            </div>

            {/* CHAT LAYOUT */}
            <div className="row">

                {/* LEFT SIDE - CONVERSATIONS */}
                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-header fw-semibold">Conversations</div>
                        <div className="list-group list-group-flush">
                            {chats.map(chat => (
                                <button
                                    key={chat.id}
                                    className={`list-group-item list-group-item-action ${selectedChat?.id === chat.id ? "active" : ""}`}
                                    onClick={() => setSelectedChat(chat)}
                                >
                                    <div className="d-flex justify-content-between">
                                        <strong>
                                            {activeTab === "appointments"
                                                ? "Appointment Booking"
                                                : activeTab === "urgent"
                                                    ? "Urgent Complaint"
                                                    : "Normal Complaint"}
                                        </strong>
                                        <small className="text-muted">{new Date(chat.created_at).toLocaleTimeString()}</small>
                                    </div>
                                    <div className="small text-muted">{chat.message}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - CHAT WINDOW */}
                <div className="col-md-8">
                    <div className="card shadow-sm">

                        {/* Card Header */}
                        <div className="card-header fw-semibold">
                            {selectedChat
                                ? activeTab === "appointments"
                                    ? selectedChat.name
                                    : activeTab === "urgent"
                                        ? selectedChat.ofw_name
                                        : selectedChat.details?.ofw_name || "Normal Complaint"
                                : "Select a conversation"}
                        </div>

                        {/* Card Body */}
                        <div className="card-body" style={{ height: "400px", overflowY: "auto" }}>
                            {selectedChat ? (
                                <div>

                                    {/* Appointments */}
                                    {activeTab === "appointments" && (
                                        <div className="mb-3">
                                            <div className="bg-light p-2 rounded d-inline-block">{selectedChat.message}</div>
                                            <div className="small text-muted mt-1">{new Date(selectedChat.created_at).toLocaleString()}</div>
                                        </div>
                                    )}

                                    {/* Urgent Complaints */}
                                    {activeTab === "urgent" && (
                                        <div className="mb-3">
                                            <div className="bg-light p-3 rounded">
                                                <p><strong>OFW Name:</strong> {selectedChat.ofw_name}</p>
                                                <p><strong>City:</strong> {selectedChat.city}</p>
                                                <p><strong>Address:</strong> {selectedChat.address}</p>
                                                <p><strong>Coordinates:</strong> {selectedChat.latitude}, {selectedChat.longitude}</p>
                                                <p><strong>Submitted At:</strong> {new Date(selectedChat.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "normal" && selectedChat && selectedChat && (
                                        <div className="mb-3">
                                            <div className="bg-light p-3 rounded">
                                                <h6 className="fw-bold">Complaint Details</h6>

                                                <p><strong>Agency:</strong> {selectedChat.agency}</p>
                                                <p><strong>OFW Name:</strong> {selectedChat.ofw_name}</p>
                                                <p><strong>Gender:</strong> {selectedChat.gender}</p>
                                                <p><strong>Birthdate:</strong> {selectedChat.birthdate}</p>
                                                <p><strong>Occupation:</strong> {selectedChat.occupation}</p>
                                                <p><strong>National ID:</strong> {selectedChat.national_id}</p>
                                                <p><strong>Passport No:</strong> {selectedChat.passport_no}</p>
                                                <p><strong>Email:</strong> {selectedChat.email}</p>
                                                <p><strong>Contact Person:</strong> {selectedChat.contact_person}</p>
                                                <p><strong>Primary Contact:</strong> {selectedChat.primary_contact}</p>
                                                <p><strong>Secondary Contact:</strong> {selectedChat.secondary_contact}</p>
                                                <p><strong>Address Abroad:</strong> {selectedChat.address_abroad}</p>
                                                <p><strong>Complaint:</strong> {selectedChat.complaint_text}</p>

                                                {selectedChat.images?.filter(Boolean).length > 0 && (
                                                    <div className="mt-2">
                                                        <strong>Images:</strong>
                                                        <div className="d-flex gap-2 mt-1 flex-wrap">
                                                            {selectedChat.images.filter(Boolean).map((img, idx) => (
                                                                <img
                                                                    key={idx}
                                                                    src={`http://127.0.0.1:8000/storage/${img}`}
                                                                    alt={`complaint-${idx}`}
                                                                    className="rounded"
                                                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <p className="mt-2">
                                                    <strong>Submitted At:</strong> {new Date(selectedChat.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            ) : (
                                <p className="text-muted">Choose a conversation to view messages.</p>
                            )}
                        </div>

                        {/* Card Footer - only for appointments */}
                        {selectedChat && activeTab === "appointments" && (
                            <div className="card-footer">
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Type a reply..." />
                                    <button className="btn btn-primary">Send</button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default MessagesTab;