import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/superadmin/Sidebar";
import AgenciesTab from "../components/superadmin/AgenciesTab";
import DashboardHeader from "../components/superadmin/DashboardHeader";
import OfwTab from "../components/superadmin/OfwTab";
import StatCard from "../components/superadmin/StatCard";
import ComplaintsMessages from "../components/superadmin/ComplaintsMessages";
import {
    Building2,
    CheckCircle,
    XCircle,
    Users,
    AlertCircle,
    ClipboardList,
    TriangleAlert,
    Siren
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid } from 'recharts';
import "../../css/superadmin.css";

axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.withCredentials = true;

export default function SuperAdmin() {
    const [activePage, setActivePage] = useState("dashboard");
    const [totalAgencies, setTotalAgencies] = useState(0);
    const [activeAgencies, setActiveAgencies] = useState(0);
    const [blockedAgencies, setBlockedAgencies] = useState(0);
    const [monthlyComplaints, setMonthlyComplaints] = useState(0);
    const [monthlyUrgentComplaints, setMonthlyUrgentComplaints] = useState(0);
    const [todayNormalComplaints, setTodayNormalComplaints] = useState(0);
    const [todayUrgentComplaints, setTodayUrgentComplaints] = useState(0);
    const [totalOfws, setTotalOfws] = useState(0);
    const [loading, setLoading] = useState(true);

    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(true);

    const statsData = [
        { title: "Total Agencies", value: loading ? 0 : totalAgencies, icon: <Building2 />, color: "blue" },
        { title: "Active Agencies", value: loading ? 0 : activeAgencies, icon: <CheckCircle />, color: "green" },
        { title: "Blocked Agencies", value: loading ? 0 : blockedAgencies, icon: <XCircle />, color: "gray" },
        { title: "Total OFWs", value: loading ? 0 : totalOfws, icon: <Users />, color: "purple" },
        { title: "Monthly Complaints", value: loading ? 0 : monthlyComplaints, icon: <AlertCircle />, color: "orange" },
        { title: "Monthly Urgent Complaints", value: loading ? 0 : monthlyUrgentComplaints, icon: <Siren />, color: "red" },
        { title: "Today's Normal Complaints", value: todayNormalComplaints, icon: <ClipboardList />, color: "teal" },
        { title: "Today's Urgent Complaints", value: todayUrgentComplaints, icon: <TriangleAlert />, color: "pink" },
    ];

    const [activities, setActivities] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
    }, [token]);

    useEffect(() => {
        axios.get("/api/complaints/today-normal")
            .then(res => setTodayNormalComplaints(res.data.todayNormalComplaints))
            .catch(err => console.error(err));

        axios.get("/api/complaints/today-urgent")
            .then(res => setTodayUrgentComplaints(res.data.todayUrgentComplaints))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        axios.get("/api/complaints/monthly-normal")
            .then(res => setMonthlyComplaints(res.data.monthlyNormalComplaints))
            .catch(err => console.error(err));

        axios.get("/api/complaints/monthly-urgent")
            .then(res => setMonthlyUrgentComplaints(res.data.monthlyUrgentComplaints))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        axios.get("/api/total-agencies")
            .then(res => setTotalAgencies(res.data.totalAgencies))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        axios.get("/api/active-agencies")
            .then(res => setActiveAgencies(res.data.activeAgencies))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        axios.get("/api/total-ofws")
            .then(res => setTotalOfws(res.data.totalOfws))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        axios.get("/api/blocked-agencies")
            .then(res => setBlockedAgencies(res.data.blockedAgencies))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(fetchNotifications, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchActivities();
        const interval = setInterval(fetchActivities, 15000);
        return () => clearInterval(interval);
    }, []);

    const refreshAgencyStats = () => {
        axios.get("/api/total-agencies")
            .then(res => setTotalAgencies(res.data.totalAgencies));

        axios.get("/api/active-agencies")
            .then(res => setActiveAgencies(res.data.activeAgencies));

        axios.get("/api/blocked-agencies")
            .then(res => setBlockedAgencies(res.data.blockedAgencies));
    };

    const fetchNotifications = () => {
        Promise.all([
            axios.get("/api/complaints"),
            axios.get("/api/complaints/urgent")
        ])
            .then(([normal, urgent]) => {

                const combined = [
                    ...normal.data.data.map(c => ({
                        id: c.id,
                        message: `Normal complaint: ${c.ofw_name}`,
                        created_at: c.created_at
                    })),
                    ...urgent.data.data.map(u => ({
                        id: u.id,
                        message: `Urgent complaint: ${u.ofw_name}`,
                        created_at: u.created_at
                    }))
                ];

                const latestFour = combined
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 4);

                setNotifications(latestFour);
            })
            .catch(err => console.error(err))
            .finally(() => setLoadingNotifications(false));
    };

    const fetchActivities = () => {
        axios.get("/api/activities")
            .then(res => {
                const latestFour = res.data
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 4);

                setActivities(latestFour);
            })
            .catch(err => console.error("Error fetching activities:", err));
    };

    return (
        <div className="superadmin-layout d-flex">
            <Sidebar setActivePage={setActivePage} activePage={activePage} />

            <div className="main-area flex-grow-1 d-flex">

                <div className="content-area flex-grow-1 p-4">
                    <DashboardHeader
                        activePage={activePage}
                    />
                    {activePage === "dashboard" && (
                        <div className="dashboard-container">
                            <div className="stats-grid">
                                {statsData.map((stat, index) => (
                                    <StatCard
                                        key={index}
                                        title={stat.title}
                                        value={stat.value}
                                        icon={stat.icon}
                                        color={stat.color}
                                    />
                                ))}
                            </div>

                            <div className="lower-grid">
                                <div className="chart-container">
                                    <h4>Monthly Complaints (Normal vs Urgent)</h4>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <defs>
                                                <linearGradient id="normalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#fcd34d" />
                                                    <stop offset="100%" stopColor="#f97316" />
                                                </linearGradient>
                                                <linearGradient id="urgentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#f87171" />
                                                    <stop offset="100%" stopColor="#b91c1c" />
                                                </linearGradient>
                                            </defs>
                                            <Pie
                                                data={[
                                                    { name: 'Normal', value: monthlyComplaints },
                                                    { name: 'Urgent', value: monthlyUrgentComplaints }
                                                ]}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label={({ name, value }) => `${name}: ${value}`}
                                            >
                                                <Cell key="normal" fill="url(#normalGradient)" />
                                                <Cell key="urgent" fill="url(#urgentGradient)" />
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="chart-container">
                                    <h4>Monthly OFW and Agency Count</h4>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart
                                            data={[
                                                { name: 'OFWs', value: totalOfws },
                                                { name: 'Agencies', value: totalAgencies }
                                            ]}
                                        >
                                            <defs>
                                                <linearGradient id="ofwGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#a78bfa" />
                                                    <stop offset="100%" stopColor="#581c87" />
                                                </linearGradient>
                                                <linearGradient id="agencyGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#60a5fa" />
                                                    <stop offset="100%" stopColor="#1e3a8a" />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="value" fill="url(#ofwGradient)">
                                                <Cell key="ofw" fill="url(#ofwGradient)" />
                                                <Cell key="agency" fill="url(#agencyGradient)" />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {activePage === "agencies" && <AgenciesTab onStatsUpdate={refreshAgencyStats} />}
                    {activePage === "ofws" && <OfwTab />}
                    {activePage === "messages" && <ComplaintsMessages />}
                </div>

                <div className="notifications-panel">

                    <div className="notifications-section">
                        <h3>Notifications</h3>
                        {loadingNotifications ? (
                            <p>Loading...</p>
                        ) : notifications.length === 0 ? (
                            <p className="text-muted">No notifications.</p>
                        ) : (
                            notifications.map(note => (
                                <div
                                    key={note.id}
                                    className={`notification ${note.is_read ? "read" : "unread"}`}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setActivePage("messages")}
                                >
                                    <span className="notification-type">
                                        {note.is_read ? "Read" : "New"}
                                    </span>
                                    {note.message}
                                    <div className="time">{new Date(note.created_at).toLocaleTimeString()}</div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="notifications-section activities">
                        <h3>Activities</h3>
                        {loadingNotifications ? (
                            <p>Loading...</p>
                        ) : activities.length === 0 ? (
                            <p className="text-muted">No recent activities</p>
                        ) : (
                            activities.map(act => (
                                <div
                                    className="notification"
                                    key={act.id}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setActivePage("agencies")}
                                >
                                    {act.message}
                                    <div className="time">{new Date(act.created_at).toLocaleTimeString()}</div>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}