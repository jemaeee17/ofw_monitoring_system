import React from "react";
import { NavLink } from "react-router-dom";

export default function AttentionCard() {
    return (
        <div className="card attention-card">
            <h3>Agencies Requiring Attention</h3>

            <div className="attention-box">
                <div>
                    <strong>Excellence Overseas Employment</strong>
                    <p className="red-text">12 complaints • Active</p>
                </div>
                <NavLink
                    to="/superadmin/agencies/excellence"
                    className="view-link"
                >
                    View
                </NavLink>
            </div>

            <div className="attention-box">
                <div>
                    <strong>Pacific Workforce Solutions</strong>
                    <p className="red-text">28 complaints • Blocked</p>
                </div>
                <NavLink
                    to="/superadmin/agencies/pacific"
                    className="view-link"
                >
                    View
                </NavLink>
            </div>
        </div>
    );
}