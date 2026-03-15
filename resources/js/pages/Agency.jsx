import React, { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "../components/agency/Sidebar.jsx";
import Header from "../components/agency/Header.jsx";
import DashboardView from "../components/agency/DashboardView.jsx";
import ApplicantsView from "../components/agency/applicants/ApplicantsView.jsx";
import EmployedView from "../components/agency/employed/EmployedView.jsx";
import EmployersView from "../components/agency/employers/EmployersView.jsx";
import CoHostView from "../components/agency/cohost/CoHostView.jsx";
import MessagesTab from "../components/agency/agency-messages/MessagesTab.jsx";
import Appointments from "../components/agency/appointments/Appointments.jsx";

import '../../css/agency.css';

axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.withCredentials = true;

export default function Agency() {
    const token = localStorage.getItem("agency_token");

    const [activePage, setActivePage] = useState("Dashboard");
    const [statsData, setStatsData] = useState([]);
    const [activitiesData, setActivitiesData] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!token) return;

        const fetchDashboardData = async () => {
            try {
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                const [statsRes, monthlyRes, activitiesRes] = await Promise.all([
                    axios.get("/api/agency/dashboard-stats"),
                    axios.get("/api/agency/monthly-appointments"),
                    axios.get("/api/agency/dashboard-activities")
                ]);

                setStatsData([
                    {
                        label: "TOTAL APPLICANTS",
                        value: statsRes.data.totalApplicants || 0,
                        borderClass: "blue-border",
                        icon: "📝",
                        iconBg: "bg-light-blue"
                    },
                    {
                        label: "CURRENTLY EMPLOYED",
                        value: statsRes.data.employed || 0,
                        borderClass: "yellow-border",
                        icon: "💼",
                        iconBg: "bg-light-yellow"
                    },
                    {
                        label: "MONTHLY APPOINTMENTS",
                        value: monthlyRes.data.monthlyAppointments || 0,
                        borderClass: "red-border",
                        textClass: "text-danger",
                        icon: "📅",
                        iconBg: "bg-light-red"
                    },
                    {
                        label: "ACTIVE EMPLOYERS",
                        value: statsRes.data.activeEmployers || 0,
                        borderClass: "green-border",
                        icon: "💼",
                        iconBg: "bg-light-green"
                    }
                ]);

                setActivitiesData(
                    (activitiesRes.data || []).map(item => ({
                        name: item.name,
                        description: item.description,
                        icon:
                            item.type === "deployed"
                                ? "✈️"
                                : item.type === "employed"
                                    ? "💼"
                                    : item.type === "appointment"
                                        ? "📅"
                                        : "📝",
                        color:
                            item.type === "deployed"
                                ? "blue"
                                : item.type === "employed"
                                    ? "green"
                                    : item.type === "appointment"
                                        ? "yellow"
                                        : "gray",
                        timeAgo: item.time ? new Date(item.time).toLocaleString() : 'N/A'
                    }))
                );

            } catch (error) {
                console.error("Dashboard fetch error:", error.response?.data || error.message);
            }
        };

        fetchDashboardData();
    }, [token]);

    const pht = {
        time: currentTime.toLocaleTimeString("en-US", { hour12: true, timeZone: "Asia/Manila" }),
        date: currentTime.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "Asia/Manila" }),
    };
    const renderContent = () => {
        switch (activePage) {
            case "Dashboard":
                return <DashboardView stats={statsData} activities={activitiesData} pht={pht} systemStatus="System Online" />;
            case "Applicants":
                return <ApplicantsView />;
            case "Employed":
                return <EmployedView />;
            case "Employers":
                return <EmployersView />;
            case "Co-Host":
                return <CoHostView />;
            case "Appointments":
                return <Appointments />;
            case "Messages":
                return <MessagesTab />;
            default:
                return <div className="p-5 text-center"><h2>{activePage} Module</h2></div>;
        }
    };

    return (
        <div className="admin-wrapper d-flex vw-100 vh-100 bg-light">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <div className="main-content-ph flex-grow-1 d-flex flex-column overflow-hidden">
                <Header activePage={activePage} />
                <div className="scroll-area-ph p-4">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}