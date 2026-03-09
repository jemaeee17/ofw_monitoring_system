import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activePage, setActivePage }) => {
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
        navigate("/");
    };

    const handleSettings = () => {
        navigate("/agency-settings");
        setShowLogoutModal(false);
    };

    return (
        <aside className="sidebar-ph shadow" style={{ position: "relative" }}>
            <div className="sidebar-brand-ph">
                <div className="flag-accent"></div>
                <h2 className="logo-text-ph">
                    KalingaGate <span className="ksa-tag">KSA</span>
                </h2>
            </div>
            <nav className="nav-list-ph">
                <small className="nav-section-label">MANAGEMENT</small>
                <button
                    onClick={() => setActivePage("Dashboard")}
                    className={`nav-item-ph ${activePage === "Dashboard" ? "active" : ""}`}
                >
                    <span>📊</span> Dashboard
                </button>
                <button
                    onClick={() => setActivePage("Applicants")}
                    className={`nav-item-ph ${activePage === "Applicants" ? "active" : ""}`}
                >
                    <span>📝</span> Applicants
                </button>
                <button
                    onClick={() => setActivePage("Employed")}
                    className={`nav-item-ph ${activePage === "Employed" ? "active" : ""}`}
                >
                    <span>💼</span> Employed
                </button>
                <button
                    onClick={() => setActivePage("Employers")}
                    className={`nav-item-ph ${activePage === "Employers" ? "active" : ""}`}
                >
                    <span>🏢</span> Employers
                </button>
                <button
                    onClick={() => setActivePage("Co-Host")}
                    className={`nav-item-ph ${activePage === "Co-Host" ? "active" : ""}`}
                >
                    <span>🤝</span> Co-Host
                </button>
                <button
                    onClick={() => setActivePage("Appointments")}
                    className={`nav-item-ph ${activePage === "Appointments" ? "active" : ""}`}
                >
                    <span>📅</span> Appointments
                </button>
                <button
                    onClick={() => setActivePage("Messages")}
                    className={`nav-item-ph ${activePage === "Messages" ? "active" : ""}`}
                >
                    <span>💬</span> Messages
                </button>

                {/* LOGOUT BUTTON */}
                <div className="mt-auto pb-3" style={{ position: "relative" }}>
                    <button
                        className="nav-item-ph logout-btn"
                        onClick={() => setShowLogoutModal(!showLogoutModal)}
                    >
                        <span>⬅️</span> Log Out
                    </button>

                    {/* LOGOUT / SETTINGS MODAL */}
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
                                className="w-100 btn btn-sm btn-light mb-2 text-start"
                                onClick={handleSettings}
                            >
                                ⚙️ Settings
                            </button>
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
};

export default Sidebar;