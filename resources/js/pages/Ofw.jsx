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
    const [activePage, setActivePage] = useState("dashboard");

    useEffect(() => {
        if (location.state?.activePage) {
            setActivePage(location.state.activePage);
        }
    }, [location.state]);

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