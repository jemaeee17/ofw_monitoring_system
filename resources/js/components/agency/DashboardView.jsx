import React from "react";

const DashboardView = ({ pht, stats, activities, systemStatus }) => {

    return (
        <div className="animate-fade-in dashboard-viewport">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h1 className="h3 fw-bold m-0 text-dark">KSA Operations Overview</h1>
                    <p className="text-muted small m-0">Monitoring deployment and welfare for Saudi Arabia operations.</p>
                </div>
                <span className="badge-ph-blue">System Online</span>
            </div>

            <div className="stats-grid mb-4">
                {stats.map((stat, index) => (
                    <div key={index} className={`stat-box ${stat.borderClass}`}>
                        <div className="stat-info">
                            <small>{stat.label}</small>
                            <h2 className={stat.textClass || ""}>{stat.value}</h2>
                        </div>
                        <div className={`stat-icon ${stat.iconBg}`}>{stat.icon}</div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="modern-card h-100">
                        <div className="card-header-ph d-flex justify-content-between align-items-center">
                            <span>Recent Activities</span>
                        </div>
                        <div className="p-0">
                            {activities.map((activity, index) => (
                                <div key={index} className="activity-item-new border-bottom">
                                    <div className={`activity-icon ${activity.color}`}>{activity.icon}</div>
                                    <div className="activity-details">
                                        <p className="m-0 fw-bold small">{activity.name}</p>
                                        <small className="text-muted">{activity.description}</small>
                                    </div>
                                    <div className="activity-time text-end">
                                        <small>{activity.timeAgo}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="clock-card-ph h-100 d-flex flex-column justify-content-center text-center">
                        <small className="fw-bold opacity-75 mb-2">MANILA (PHT)</small>
                        <h1 className="display-5 fw-bold mb-1">{pht.time}</h1>
                        <p className="m-0 small opacity-75">{pht.date}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;