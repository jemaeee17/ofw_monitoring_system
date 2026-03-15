import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const MessagesTab = () => {
    const [activeTab, setActiveTab] = useState("appointments");
    const [selectedChat, setSelectedChat] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [urgent, setUrgent] = useState([]);
    const [normal, setNormal] = useState([]);

    const [replyText, setReplyText] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const bottomRef = useRef(null);

    const token = localStorage.getItem("agency_token");

    const sendReply = () => {
        if (!replyText.trim()) return;

        const token = localStorage.getItem("agency_token");

        axios
            .post("/api/messages/reply", {
                conversation_id: selectedChat.conversation_id || selectedChat.id,
                message: replyText
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            .then((res) => {
                setChatMessages((prev) => [...prev, res.data]);
                setReplyText("");
            })
            .catch((err) => console.error(err));
    };

    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
        setChatMessages([]);

        const conversationId = chat.conversation_id || chat.id;

        axios
            .get(`/api/messages/conversation/${conversationId}`)
            .then((res) => {
                setChatMessages(res.data);
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        const token = localStorage.getItem("agency_token");

        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const fetchAppointments = useCallback(() => {
        if (!token) return;

        axios
            .get("/api/messages/agency-appointments")
            .then((res) => {
                setAppointments(res.data);
                if (!selectedChat && res.data.length > 0) {
                    setSelectedChat(res.data[0]);
                }
            })
            .catch((err) => console.error(err));
    }, [selectedChat, token]);

    const fetchUrgent = useCallback(() => {
        if (!token) return;
        axios
            .get("/api/messages/urgent")
            .then((res) => setUrgent(res.data))
            .catch((err) => console.error(err));
    }, [token]);

    const fetchNormal = useCallback(() => {
        if (!token) return;
        axios
            .get("/api/messages/normal")
            .then((res) => setNormal(res.data))
            .catch((err) => console.error(err));
    }, [token]);

    useEffect(() => {
        if (!token) return;
        if (activeTab === "appointments") fetchAppointments();
        else if (activeTab === "urgent") fetchUrgent();
        else if (activeTab === "normal") fetchNormal();
    }, [activeTab, fetchAppointments, fetchUrgent, fetchNormal, token]);

    const addNewAppointment = (notification) => {
        setAppointments((prev) => [notification, ...prev]);
        setSelectedChat(notification);
    };

    const chats =
        activeTab === "appointments"
            ? appointments
            : activeTab === "urgent"
                ? urgent
                : normal;

    return (
        <div className="container-fluid">
            <h4 className="fw-bold mb-3">Messages</h4>

            <div className="d-flex gap-2 border-bottom pb-2 mb-3">
                <button
                    className={`btn ${activeTab === "appointments" ? "btn-primary" : "btn-light"}`}
                    onClick={() => {
                        setActiveTab("appointments");
                        setSelectedChat(null);
                    }}
                >
                    📅 Appointments
                </button>

                <button
                    className={`btn ${activeTab === "urgent" ? "btn-danger" : "btn-light"}`}
                    onClick={() => {
                        setActiveTab("urgent");
                        setSelectedChat(null);
                    }}
                >
                    🚨 Urgent Complaints
                </button>

                <button
                    className={`btn ${activeTab === "normal" ? "btn-success" : "btn-light"}`}
                    onClick={() => {
                        setActiveTab("normal");
                        setSelectedChat(null);
                    }}
                >
                    💬 Normal Complaints
                </button>
            </div>

            <div className="row">
                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-header fw-semibold">Conversations</div>
                        <div
                            className="list-group list-group-flush"
                            style={{
                                maxHeight: "500px",
                                overflowY: "auto"
                            }}
                        >
                            {chats.map((chat) => (
                                <button
                                    key={chat.id}
                                    className={`list-group-item list-group-item-action ${(selectedChat?.conversation_id || selectedChat?.id) === (chat.conversation_id || chat.id)
                                        ? "active"
                                        : ""
                                        }`}
                                    onClick={() => handleSelectChat(chat)}
                                >
                                    <div className="d-flex justify-content-between">
                                        <strong>
                                            {activeTab === "appointments"
                                                ? "Appointment Booking"
                                                : activeTab === "urgent"
                                                    ? "Urgent Complaint"
                                                    : "Normal Complaint"}
                                        </strong>
                                        <small className="text-muted">
                                            {new Date(chat.created_at).toLocaleTimeString()}
                                        </small>
                                    </div>
                                    <div className="small text-muted">{chat.message}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card shadow-sm">

                        <div className="card-header fw-semibold">
                            {selectedChat
                                ? activeTab === "appointments"
                                    ? selectedChat.name || "Appointment"
                                    : activeTab === "urgent"
                                        ? selectedChat.ofw_name
                                        : selectedChat.ofw_name || "Normal Complaint"
                                : "Select a conversation"}
                        </div>

                        <div className="card-body" style={{ height: "400px", overflowY: "auto" }}>
                            {chatMessages.length > 0 ? (
                                <>
                                    {chatMessages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`mb-2 d-flex ${msg.sender === "agency"
                                                ? "justify-content-end"
                                                : "justify-content-start"
                                                }`}
                                        >
                                            <div
                                                className={`p-2 rounded ${msg.sender === "agency"
                                                    ? "bg-primary text-white"
                                                    : "bg-light"
                                                    }`}
                                                style={{ maxWidth: "70%" }}
                                            >
                                                {msg.message.split("\n").map((line, i) => {
                                                    const isImage =
                                                        line.endsWith(".jpg") ||
                                                        line.endsWith(".jpeg") ||
                                                        line.endsWith(".png") ||
                                                        line.endsWith(".webp");

                                                    if (isImage) {
                                                        return (
                                                            <div key={i} style={{ marginTop: "5px" }}>
                                                                <img
                                                                    src={line}
                                                                    alt="Complaint evidence"
                                                                    style={{
                                                                        maxWidth: "200px",
                                                                        borderRadius: "8px",
                                                                        cursor: "pointer"
                                                                    }}
                                                                    onClick={() => window.open(line, "_blank")}
                                                                />
                                                            </div>
                                                        );
                                                    }

                                                    return <div key={i}>{line}</div>;
                                                })}
                                                <div className="small text-muted mt-1">
                                                    {new Date(msg.created_at).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div ref={bottomRef}></div>
                                </>
                            ) : (
                                <p className="text-muted">No messages yet.</p>
                            )}
                        </div>

                        {selectedChat && (
                            <div className="card-footer">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Type a reply..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") sendReply();
                                        }}
                                    />
                                    <button className="btn btn-primary" onClick={sendReply}>
                                        Send
                                    </button>
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