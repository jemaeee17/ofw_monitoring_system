import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import AppointmentsHeaderCards from "./AppointmentsHeaderCards";
import AppointmentsTable from "./AppointmentsTable";
import AppointmentsCalendar from "./AppointmentsCalendar";

import api from '../../../services/api';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await axios.get("/api/appointments");
            setAppointments(res.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await axios.post(`/api/appointments/${id}/update-status`, { status });
            fetchAppointments(); 
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    if (loading) return <p>Loading appointments...</p>;

    return (
        <div>
            <AppointmentsHeaderCards appointments={appointments} />
            <AppointmentsTable
                appointments={appointments}
                onStatusChange={handleStatusChange}
                onShowCalendar={() => setShowCalendar(true)}
            />
            {showCalendar && (
                <AppointmentsCalendar
                    appointments={appointments}
                    onClose={() => setShowCalendar(false)}
                />
            )}
        </div>
    );
}