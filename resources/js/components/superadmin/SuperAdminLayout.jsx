import React from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import AgenciesTab from "./AgenciesTab";
import OfwTab from "./OfwTab";
import ComplaintsMessages from "./ComplaintsMessages";
import "../../../css/superadmin.css";

export default function SuperAdminLayout() {
    const [activePage, setActivePage] = useState("dashboard");

    const renderPage = () => {
        switch (activePage) {
            case "agencies":
                return <AgenciesTab />;
            case "ofws":
                return <OfwTab />;
            case "messages":
                return <ComplaintsMessages />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="superadmin-layout d-flex">
            {/* Sidebar */}
            <Sidebar setActivePage={setActivePage} activePage={activePage} />

            {/* Right main area */}
            <div className="main-area flex-grow-1">

                {/* Page content with padding */}
                <div className="content-area p-4">
                    {renderPage()}
                </div>
            </div>
        </div>
    );
}