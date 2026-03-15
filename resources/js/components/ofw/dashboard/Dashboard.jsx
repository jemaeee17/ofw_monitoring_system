import React, { useState } from "react";
import { ShieldCheck, CreditCard, Calendar, Star, Phone, Mail } from "lucide-react";

export default function Dashboard() {
    const PH_BLUE = "#0038A8";
    const PH_RED = "#CE1126";
    const PH_YELLOW = "#FCD116";

    // Dummy profile data
    const [profile] = useState({
        name: "Maria Santos",
        title: "Registered Nurse",
        email: "maria.santos@email.com",
        passport: "P1234567B",
        employer: "Dubai Healthcare Center",
        salary: "AED 8,500",
        departure: "Jan 12, 2024",
        agencyName: "Alpha Global Recruitment Inc.",
        agencyPhone: "+63 2 8123 4567",
        agencyEmail: "support@alphaglobal.ph",
    });

    return (
        <div className="dashboard-wrapper">
            <style>{`
        .card { border-radius: 15px; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .btn-ph-blue { background-color: ${PH_BLUE}; color: white; border: none; transition: 0.3s; }
        .btn-ph-blue:hover { background-color: #002a7a; color: white; }
        .text-ph-blue { color: ${PH_BLUE}; }
      `}</style>

            {/* DASHBOARD CARDS */}
            <div className="row g-3 mb-4">
                {[
                    { t: "OEC Status", v: "Verified", c: PH_BLUE, icon: <ShieldCheck size={16} /> },
                    { t: "SSS Premium", v: "Active", c: PH_BLUE, icon: <CreditCard size={16} /> },
                    { t: "OWWA Validity", v: "24 Months", c: PH_RED, icon: <Calendar size={16} /> },
                    { t: "Pag-IBIG", v: "Updated", c: PH_RED, icon: <Star size={16} /> }
                ].map((s, i) => (
                    <div className="col-md-3 col-6" key={i}>
                        <div className="card p-3 h-100" style={{ borderLeft: `4px solid ${s.c}` }}>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <span style={{ color: s.c }}>{s.icon}</span>
                                <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>{s.t}</small>
                            </div>
                            <h5 className="fw-bold mb-0" style={{ color: s.c, fontSize: '1.1rem' }}>{s.v}</h5>
                        </div>
                    </div>
                ))}
            </div>

            {/* AGENCY CONTACT CENTER */}
            <div className="card border-0 shadow-sm overflow-hidden">
                <div className="row g-0">
                    <div className="col-lg-7 p-4 bg-white">
                        <div className="d-flex align-items-start gap-3 mb-4">
                            <div className="p-3 rounded-4 bg-light text-ph-blue shadow-sm">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <div className="badge bg-success bg-opacity-10 text-success mb-1 px-2 border border-success border-opacity-25">
                                    DMW Verified
                                </div>
                                <h4 className="fw-bold mb-0 text-dark">{profile.agencyName}</h4>
                                <p className="text-muted small mb-0">Official POEA License: 123-RE-2024-00-PR</p>
                            </div>
                        </div>
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <button className="btn btn-ph-blue w-100 fw-bold py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm">
                                    <Phone size={18} /> Contact Welfare Officer
                                </button>
                            </div>
                            <div className="col-sm-6">
                                <button className="btn btn-outline-dark w-100 fw-bold py-2 shadow-sm">
                                    View Contract Details
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5 p-4" style={{ backgroundColor: "#f8f9fa", borderLeft: "1px solid #eee" }}>
                        <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: '11px', color: PH_BLUE, letterSpacing: '1px' }}>Agency Contact Center</h6>
                        <div className="d-flex flex-column gap-2">
                            <div className="bg-white p-3 rounded-3 shadow-sm border border-light d-flex align-items-center gap-3">
                                <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary"><Phone size={18} /></div>
                                <div>
                                    <small className="text-muted d-block" style={{ fontSize: '10px' }}>HOTLINE</small>
                                    <span className="fw-bold text-dark">{profile.agencyPhone}</span>
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded-3 shadow-sm border border-light d-flex align-items-center gap-3">
                                <div className="p-2 rounded-circle bg-danger bg-opacity-10 text-danger"><Mail size={18} /></div>
                                <div>
                                    <small className="text-muted d-block" style={{ fontSize: '10px' }}>EMAIL SUPPORT</small>
                                    <span className="fw-bold text-dark">{profile.agencyEmail}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 d-flex align-items-center gap-2">
                            <span className="position-relative d-inline-flex">
                                <span className="position-absolute translate-middle p-1 bg-success border border-light rounded-circle animate-pulse" style={{ left: '10px', top: '10px' }}></span>
                                <span className="p-1 bg-success bg-opacity-20 rounded-circle" style={{ width: '20px', height: '20px' }}></span>
                            </span>
                            <small className="fw-bold text-success">Welfare Officer is Online</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}