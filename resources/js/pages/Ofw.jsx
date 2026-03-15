import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/ofw/layout/Sidebar.jsx";
import Topbar from "../components/ofw/layout/Topbar.jsx";

import Dashboard from "../components/ofw/dashboard/Dashboard.jsx";
import Profile from "../components/ofw/profile/Profile.jsx";
import RescuePage from "../components/ofw/rescue/RescuePage.jsx";
import Messages from "../components/ofw/messages/Messages.jsx";

import '../../css/ofw.css';

export default function Ofw() {
    const location = useLocation();
    const [activePage, setActivePage] = useState(() => {
        return localStorage.getItem("ofw_active_page") || "dashboard";
    });
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("ofw_token");

        if (!token) {
            window.location.href = "/ofw-login";
        }
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("ofw");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        localStorage.setItem("ofw_active_page", activePage);
    }, [activePage]);

    const renderPage = () => {
        switch (activePage) {
            case "dashboard":
                return <Dashboard />;
            case "profile":
                return <Profile />;
            case "messages":
                return <Messages />;
            case "rescue":
                return <RescuePage />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="d-flex">

            <Sidebar activePage={activePage} setActivePage={setActivePage} />

            <div className="flex-grow-1">

                <Topbar />

                <div className="container-fluid p-4">
                    {renderPage()}
                </div>

            </div>
        </div>
    );
}
