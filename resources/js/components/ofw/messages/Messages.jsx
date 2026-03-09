import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Messages() {

    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");

    const [chatData, setChatData] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("ofw"));

        if (!user) return;

        axios.get(`/api/notifications/${user.id}`)
            .then(res => {
                setChatData([
                    {
                        id: 1,
                        name: "Appointment System",
                        messages: res.data.map(n => n.message)
                    }
                ]);
            })
            .catch(err => console.error(err));
    }, []);

    const sendMessage = () => {
        if (!newMessage || selectedChat === null) return;

        const updatedChats = [...chatData];
        updatedChats[selectedChat].messages.push(newMessage);

        setChatData(updatedChats);
        setNewMessage("");
    };

    return (
        <div className="container-fluid">
            <div className="row justify-content-center" style={{ height: "80vh" }}>
                <div className="col-6 d-flex flex-column align-items-center overflow-auto">
                    <h5 className="fw-bold mb-3 text-center">Messages</h5>

                    {chatData.length === 0 ? (
                        <p className="text-muted text-center">No messages yet</p>
                    ) : (
                        chatData[0].messages.map((msg, index) => (
                            <div
                                key={index}
                                className="p-3 mb-2 border rounded"
                                style={{
                                    width: "100%",
                                    maxWidth: "1500px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    fontSize: "14px",
                                    wordWrap: "break-word"
                                }}
                            >
                                {msg}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}