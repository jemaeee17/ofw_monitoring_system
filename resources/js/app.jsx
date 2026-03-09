import React from 'react'
import ReactDOM from 'react-dom/client'

import '../css/app.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Agency from './pages/Agency';
import AgencySettings from './pages/AgencySettings'
import AppointmentBooking from './components/agency/appointment-booking/AppointmentBooking';
import Register from './pages/Register';
import Ofw from './pages/Ofw';
import OfwLogin from './pages/OfwLogin';
import SuperAdmin from './pages/SuperAdmin';
import SuperAdminLogin from './pages/SuperAdminLogin';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/appointment" element={<AppointmentBooking />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/agency-settings" element={<AgencySettings />} />
                <Route path="/agency/*" element={<Agency />} />
                <Route path="/ofw" element={<Ofw />} />
                <Route path="/ofw-login" element={<OfwLogin />} />
                <Route path="/superadmin" element={<SuperAdmin />} />
                <Route path="/superadmin-login" element={<SuperAdminLogin />} />
            </Routes>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)