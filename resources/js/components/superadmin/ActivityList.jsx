import React from "react";

export default function ActivityList() {
    return (
        <div className="card activity-card">
            <h3>Recent Activity</h3>

            <ul className="activity-list">
                <li>
                    <span className="dot blue"></span>
                    <div>
                        <strong>Blocked Agency</strong> - Pacific Workforce Solutions
                        <p>By SuperAdmin Cruz • 2024-02-05 14:30:00</p>
                    </div>
                </li>

                <li>
                    <span className="dot blue"></span>
                    <div>
                        <strong>Suspended OFW</strong> - Pedro Garcia (OFW-2024-00004)
                        <p>By SuperAdmin Cruz • 2024-02-05 13:15:00</p>
                    </div>
                </li>

                <li>
                    <span className="dot blue"></span>
                    <div>
                        <strong>Approved Document</strong> - Maria Santos - Passport
                        <p>By SuperAdmin Lopez • 2024-02-05 11:45:00</p>
                    </div>
                </li>
            </ul>
        </div>
    );
}