import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

axios.defaults.withCredentials = true;

export default function Topbar() {
    const navigate = useNavigate();
    const [openPanel, setOpenPanel] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("ofw"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            const token = localStorage.getItem("ofw_token");

            if (!token) return;

            try {
                const res = await axios.get("/api/notifications", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const sortedNotifications = res.data.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );

                setNotifications(sortedNotifications);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    console.warn("Unauthorized: token may be invalid or expired");
                    localStorage.removeItem("ofw");
                    localStorage.removeItem("ofw_token");
                    navigate("/ofw-login");
                } else {
                    console.error("Failed to fetch notifications:", err);
                }
            }
        };

        fetchNotifications();
    }, [user, navigate]);

    const notifRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setOpenPanel(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const markAsRead = async (id) => {
        const token = localStorage.getItem("ofw_token");
        try {

            await axios.post(`/api/notifications/read/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setNotifications(prev =>
                prev.map(n =>
                    n.id === id ? { ...n, is_read: true } : n
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    const getInitials = (name) => {
        if (!name) return "";
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    const togglePanel = (panel) => {
        setOpenPanel(openPanel === panel ? null : panel);
    };

    const handleLogout = () => {
        localStorage.removeItem("ofw");
        localStorage.removeItem("ofw_token");
        localStorage.removeItem("ofw_active_page");
        navigate("/ofw-login");
    };

    if (!user) return null;
    return (
        <div
            className="topbar d-flex justify-content-between align-items-center p-3 position-relative"
            style={{ backgroundColor: "#0d3b66" }}
        >

            <div>
                <h4 className="fw-bold mb-0 text-white">Welcome!</h4>
                <small className="text-white-50">Manage your OFW journey</small>
            </div>

            <div className="d-flex align-items-center gap-3 text-white position-relative">

                <div className="position-relative">
                    <Bell size={20} style={{ cursor: "pointer" }} onClick={() => togglePanel("notif")} />

                    {notifications.filter(n => !n.is_read).length > 0 && (
                        <span
                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                            style={{ fontSize: "10px" }}
                        >
                            {notifications.filter(n => !n.is_read).length}
                        </span>
                    )}

                    {openPanel === "notif" && (
                        <div
                            ref={notifRef}
                            className="dropdown-panel p-2 shadow-sm bg-white position-absolute"
                            style={{
                                width: "300px",
                                maxHeight: "250px",
                                overflowY: "auto",
                                top: "30px",
                                right: "0",
                                borderRadius: "6px",
                                zIndex: 1000
                            }}>
                            <strong>Notifications</strong>

                            {notifications.length === 0 ? (
                                <p className="text-muted small mt-2">No notifications</p>
                            ) : (
                                notifications.map(notif => (
                                    <div
                                        key={notif.id}
                                        className={`p-2 mb-1 border-bottom text-truncate ${!notif.is_read ? "fw-bold" : "fw-normal"}`}
                                        style={{
                                            cursor: "pointer",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            fontSize: "12px"
                                        }}
                                        onClick={() => {
                                            markAsRead(notif.id);

                                            setOpenPanel(null);
                                            navigate("/ofw", { state: { activePage: "messages" } });
                                        }}
                                    >
                                        {notif.message}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <div className="position-relative d-flex align-items-center gap-2">
                    <span className="fw-semibold text-white">
                        {user?.name}
                    </span>
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#f4a261",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                        onClick={() => togglePanel("profile")}
                    >
                        {getInitials(user?.name)}
                    </div>

                    {openPanel === "profile" && (
                        <div className="dropdown-panel">
                            <strong>{user?.name}</strong>
                            <p className="mb-1">{user?.role}</p>

                            <button
                                className="btn btn-sm btn-outline-danger w-100 mt-2"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}