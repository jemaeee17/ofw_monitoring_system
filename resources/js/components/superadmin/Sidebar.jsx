import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Users, Building2, LayoutDashboard, MessageSquare } from "lucide-react";

export default function Sidebar({ setActivePage, activePage }) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const modalRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowLogoutModal(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        navigate("/superadmin-login");
    };

    const handleSettings = () => {
        navigate("/admin-settings");
        setShowLogoutModal(false);
    };

    return (
        <aside className="sidebar-ph shadow" style={{ position: "relative" }}>
            {/* Brand */}
            <div className="sidebar-brand-ph">
                <div className="flag-accent"></div>
                <h2 className="logo-text-ph">
                    OFW System <span className="ksa-tag">ADMIN</span>
                </h2>
            </div>

            {/* Navigation */}
            <nav className="nav-list-ph">
                <small className="nav-section-label">SUPER ADMIN</small>

                <button
                    onClick={() => setActivePage("dashboard")}
                    className={`nav-item-ph ${activePage === "dashboard" ? "active" : ""}`}
                >
                    <LayoutDashboard size={18} className="me-2" /> Dashboard
                </button>

                <button
                    onClick={() => setActivePage("agencies")}
                    className={`nav-item-ph ${activePage === "agencies" ? "active" : ""}`}
                >
                    <Building2 size={18} className="me-2" /> Agencies
                </button>

                <button
                    onClick={() => setActivePage("ofws")}
                    className={`nav-item-ph ${activePage === "ofws" ? "active" : ""}`}
                >
                    <Users size={18} className="me-2" /> OFWs
                </button>

                <button
                    onClick={() => setActivePage("messages")}
                    className={`nav-item-ph ${activePage === "messages" ? "active" : ""}`}
                >
                    <MessageSquare size={18} className="me-2" /> Messages
                </button>

                {/* Logout */}
                <div className="mt-auto pb-3" style={{ position: "relative" }}>
                    <button
                        className="nav-item-ph logout-btn"
                        onClick={() => setShowLogoutModal(!showLogoutModal)}
                    >
                        ⬅️ Log Out
                    </button>

                    {showLogoutModal && (
                        <div
                            ref={modalRef}
                            className="bg-white shadow-sm rounded-3 p-2"
                            style={{
                                position: "absolute",
                                bottom: "50px",
                                left: "10px",
                                width: "180px",
                                zIndex: 1000,
                                border: "1px solid #ddd",
                            }}
                        >
                            <button
                                className="w-100 btn btn-sm btn-danger text-start"
                                onClick={handleLogout}
                            >
                                ⏻ Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </aside>
    );
}