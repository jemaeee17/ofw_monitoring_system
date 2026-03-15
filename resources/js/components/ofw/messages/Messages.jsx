import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem("ofw_token");
                if (!token) return setLoading(false);

                const res = await axios.get("http://127.0.0.1:8000/api/notifications", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setConversations(res.data);
            } catch (err) {
                console.error("Failed to fetch messages:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    const loadConversation = async (conv) => {
        setSelectedConversation(conv);

        try {
            const token = localStorage.getItem("ofw_token");

            const res = await axios.get(
                `http://127.0.0.1:8000/api/ofw/messages/conversation/${conv.conversation_id || conv.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const sendMessage = async () => {
        if (!text.trim()) return;

        try {
            const token = localStorage.getItem("ofw_token");

            const conversationId =
                selectedConversation.conversation_id || selectedConversation.id;

            const res = await axios.post(
                "http://127.0.0.1:8000/api/messages/reply",
                {
                    conversation_id: conversationId,
                    message: text,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMessages((prev) => [...prev, res.data]);
            setText("");
        } catch (err) {
            console.error(err);
        }
    };

    if (loading)
        return <p className="text-center mt-5">Loading messages...</p>;
    if (!conversations.length)
        return <p className="text-center mt-5">No messages found.</p>;

    return (
        <div
            className="d-flex messages-wrapper"
            style={{
                height: "80vh",
                maxWidth: "1000px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "8px",
                overflow: "hidden",
                background: "#f8f9fa",
            }}
        >
            <div
                className="conversations-list"
                style={{
                    width: "300px",
                    borderRight: "1px solid #dee2e6",
                    background: "#fff",
                    overflowY: "auto",
                }}
            >
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => loadConversation(conv)}
                        style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #dee2e6",
                            cursor: "pointer",
                            background:
                                selectedConversation?.id === conv.id ? "#e9f5ff" : "white",
                        }}
                    >
                        <strong>{conv.sender || "OFW"}</strong>
                        <p className="mb-0 text-truncate" style={{ maxWidth: "220px" }}>
                            {conv.message || conv.complaint_text}
                        </p>
                        <small className="text-muted">
                            {new Date(conv.created_at).toLocaleString()}
                        </small>
                    </div>
                ))}
            </div>
            <div
                className="chat-window flex-grow-1 d-flex flex-column"
                style={{
                    background: "#f1f3f6",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {selectedConversation ? (
                    <>
                        {/* Chat header */}
                        <div style={{ padding: "12px", borderBottom: "1px solid #dee2e6", background: "#fff" }}>
                            <strong>{selectedConversation.sender || "Agency"}</strong>
                        </div>

                        {/* Chat messages */}
                        <div style={{ padding: "16px", flexGrow: 1, overflowY: "auto" }}>
                            {Array.isArray(messages) && messages.length > 0 ? (
                                <>
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            style={{
                                                display: "flex",
                                                justifyContent: msg.sender === "ofw" ? "flex-end" : "flex-start",
                                                marginBottom: "10px"
                                            }}
                                        >
                                            <div
                                                style={{
                                                    padding: "8px 12px",
                                                    borderRadius: "12px",
                                                    maxWidth: "70%",
                                                    background: msg.sender === "ofw" ? "#0d6efd" : "#e9ecef",
                                                    color: msg.sender === "ofw" ? "#fff" : "#000",
                                                }}
                                            >
                                                <div style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "4px", opacity: 0.8 }}>
                                                    {msg.sender.toUpperCase()}
                                                </div>
                                                
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
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={bottomRef}></div>
                                </>
                            ) : (
                                <p className="text-muted">No messages yet.</p>
                            )}
                        </div>

                        {/* Message input */}
                        <div
                            style={{
                                padding: "10px",
                                borderTop: "1px solid #dee2e6",
                                display: "flex",
                                gap: "10px",
                                background: "#fff",
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") sendMessage();
                                }}
                                style={{
                                    flexGrow: 1,
                                    padding: "8px 12px",
                                    borderRadius: "20px",
                                    border: "1px solid #ced4da",
                                    outline: "none",
                                }}
                            />

                            <button
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "20px",
                                    border: "none",
                                    background: "#0d6efd",
                                    color: "#fff",
                                }}
                                onClick={sendMessage}
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div
                        style={{
                            flexGrow: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#6c757d",
                        }}
                    >
                        Select a conversation
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;