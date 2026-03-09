import React from "react";

export default function EmergencyButton({ onClick }) {
    return (
        <button
            className="btn btn-danger btn-lg px-5 py-4 fw-bold"
            style={{ fontSize: "22px", borderRadius: "16px" }}
            onClick={onClick}
        >
            🚨 EMERGENCY
        </button>
    );
}