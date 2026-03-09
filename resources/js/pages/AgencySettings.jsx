import React from "react";

const AgencySettings = () => {
    return (
        <div style={{ padding: "20px" }}>
            <h2>Agency Settings</h2>
            <p>Here you can update your password, email, and other agency details.</p>

            <div style={{ maxWidth: "400px", marginTop: "20px" }}>
                <label className="form-label fw-bold">New Password</label>
                <input type="password" className="form-control mb-3" placeholder="Enter new password" />

                <label className="form-label fw-bold">Confirm Password</label>
                <input type="password" className="form-control mb-3" placeholder="Confirm new password" />

                <button className="btn btn-primary mt-2">Update Password</button>
            </div>
        </div>
    );
};

export default AgencySettings;