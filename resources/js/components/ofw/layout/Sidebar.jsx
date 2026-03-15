import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { Home, User, AlertTriangle, MessageSquare, Star } from "lucide-react";

export default function Sidebar({ activePage, setActivePage }) {
    const [deploymentStatus, setDeploymentStatus] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const PH_BLUE = "#0038A8";
    const PH_RED = "#CE1126";
    const PH_YELLOW = "#FCD116";

    const ofw = JSON.parse(localStorage.getItem("ofw"));

    useEffect(() => {
        if (!ofw) return;

        axios
            .get(`http://127.0.0.1:8000/api/ofw/deployment-status/${ofw.email}`)
            .then(res => {
                setDeploymentStatus(res.data.status);
            })
            .catch(err => console.error(err));
    }, []);

    const handleRescueClick = () => {

        if (deploymentStatus !== "Deployed" && deploymentStatus !== "Employed") {
            setShowModal(true);
            return;
        }

        setActivePage("rescue");
    };

    return (
        <div className="sidebar shadow">

            <div className="text-center mb-4">
                <div className="logo-circle">
                    <Star fill={PH_YELLOW} color={PH_YELLOW} size={28} />
                </div>
                <h3 className="fw-bold mb-0">OFW Portal</h3>
                <p>Overseas Filipino Workers</p>
            </div>

            <ul className="nav flex-column mt-3">
                <li
                    className={`nav-item ${activePage === "dashboard" ? "active" : ""}`}
                    onClick={() => setActivePage("dashboard")}
                >
                    <Home className="me-2" size={18} /> Dashboard
                </li>
                <li
                    className={`nav-item ${activePage === "profile" ? "active" : ""}`}
                    onClick={() => setActivePage("profile")}
                >
                    <User className="me-2" size={18} /> Profile
                </li>
                <li
                    className={`nav-item ${activePage === "messages" ? "active" : ""}`}
                    onClick={() => setActivePage("messages")}
                >
                    <MessageSquare className="me-2" size={18} /> Messages
                </li>
                <div className="px-4 mt-4 mb-2">
                    <small className="text-uppercase opacity-50 fw-bold" style={{ fontSize: '10px' }}>Emergency</small>
                </div>
                <li
                    className={`nav-item rescue-nav ${activePage === "rescue" ? "active" : ""}`}
                    onClick={handleRescueClick}
                >
                    <AlertTriangle className="me-2" size={18} /> Rescue-Report
                </li>
            </ul>

            <div className="footer mt-auto">
                © 2026 OFW Portal
            </div>

            {showModal &&
                ReactDOM.createPortal(
                    <>
                        <div className="modal fade show d-block" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content border-0 shadow-lg rounded-4">

                                    <div className="modal-body text-center p-5">

                                        <div className="mb-3">
                                            <i
                                                className="bi bi-exclamation-triangle-fill text-danger"
                                                style={{ fontSize: "4rem" }}
                                            ></i>
                                        </div>

                                        <h4 className="fw-bold text-danger">
                                            Rescue Report Unavailable
                                        </h4>

                                        <p className="text-muted mt-2">
                                            You are not deployed yet. Please finish your
                                            application to enable the Rescue Report feature.
                                        </p>

                                        <button
                                            className="btn btn-danger mt-3"
                                            onClick={() => setShowModal(false)}
                                        >
                                            OK
                                        </button>

                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="modal-backdrop fade show"></div>
                    </>,
                    document.body
                )}
        </div>
    );
}