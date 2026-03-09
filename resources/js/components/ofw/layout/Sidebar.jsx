import React from "react";
import { Home, User, AlertTriangle, MessageSquare } from "lucide-react";

export default function Sidebar({ activePage, setActivePage }) {
    return (
        <div className="sidebar p-3">

            <h3 className="fw-bold text-primary">OFW Portal</h3>
            <p className="text-muted small">Overseas Filipino Workers</p>

            <ul className="nav flex-column mt-4">

                <li
                    className={`nav-item ${activePage === "dashboard" ? "active" : ""}`}
                    onClick={() => setActivePage("dashboard")}
                >
                    <Home className="me-2" /> Dashboard
                </li>

                <li
                    className={`nav-item ${activePage === "profile" ? "active" : ""}`}
                    onClick={() => setActivePage("profile")}
                >
                    <User className="me-2" /> Profile
                </li>

                <li
                    className={`nav-item ${activePage === "messages" ? "active" : ""}`}
                    onClick={() => setActivePage("messages")}
                >
                    <MessageSquare className="me-2" /> Messages
                </li>

                <li
                    className={`nav-item ${activePage === "rescue" ? "active" : ""}`}
                    onClick={() => setActivePage("rescue")}
                >
                    <AlertTriangle className="me-2 text-danger" /> Rescue-Report
                </li>

            </ul>

            <div className="footer small text-muted mt-auto">
                © 2026 OFW Portal
            </div>

        </div>
    );
}