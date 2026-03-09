import React from "react";

export default function DashboardHeader() {

    const user = { name: "Super Admin" };
    const initials = user.name
        .split(" ")
        .map(n => n[0])
        .join("");


    return (
        <div className="dashboard-header d-flex justify-content-between align-items-center">
            <div>
                <h2>Dashboard Overview</h2>
                <p>Monitor and manage recruitment agencies and OFWs</p>
            </div>

            <div className="header-right d-flex align-items-center gap-3 position-relative">

                <span className="user-name">{user.name}</span>
                <div className="user-avatar">{initials}</div>
            </div>
        </div>
    );
}