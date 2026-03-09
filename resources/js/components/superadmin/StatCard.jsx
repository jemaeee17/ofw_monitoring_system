import React from "react";

export default function StatCard({ title, value, icon, color }) {
    return (
        <div className={`stat-card ${color}`}>
            <div className="stat-info">
                <span className="stat-title">{title}</span>
                <span className="stat-value">{value}</span>
            </div>

            <div className="stat-icon">
                {icon}
            </div>
        </div>
    );
}