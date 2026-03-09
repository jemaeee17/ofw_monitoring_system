import React, { useState, useEffect } from "react";
import axios from "axios";
import { MessageSquareWarning, AlertTriangle } from "lucide-react";
import { NormalComplaintModal } from "./NormalComplaintModal";
import { UrgentComplaintModal } from "./UrgentComplaintModal";

export default function ComplaintsMessages() {
    const [activeTab, setActiveTab] = useState("normal");
    const [normalComplaints, setNormalComplaints] = useState([]);
    const [urgentComplaints, setUrgentComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [archiveTab, setArchiveTab] = useState('normal');
    const [archivedNormal, setArchivedNormal] = useState([]);
    const [archivedUrgent, setArchivedUrgent] = useState([]);
    const [expandedDays, setExpandedDays] = useState({});

    const fetchArchivedComplaints = async () => {
        try {
            const normalRes = await axios.get("http://127.0.0.1:8000/api/complaints/archived");
            setArchivedNormal(normalRes.data.data);

            const urgentRes = await axios.get("http://127.0.0.1:8000/api/complaints/urgent/archived");
            setArchivedUrgent(urgentRes.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const openArchiveModal = () => {
        fetchArchivedComplaints();
        setShowArchiveModal(true);
    };

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                setLoading(true);

                // NORMAL COMPLAINTS
                const normalRes = await axios.get(
                    "http://127.0.0.1:8000/api/complaints"
                );

                const normalData = Array.isArray(normalRes.data.data)
                    ? normalRes.data.data
                    : [];

                setNormalComplaints(normalData);

                // URGENT COMPLAINTS
                const urgentRes = await axios.get(
                    "http://127.0.0.1:8000/api/complaints/urgent"
                );

                const urgentData = Array.isArray(urgentRes.data.data)
                    ? urgentRes.data.data
                    : [];

                setUrgentComplaints(urgentData);

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch complaints. Please try again.");
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    const data = activeTab === "normal" ? normalComplaints : urgentComplaints;

    const getInitials = (name) =>
        name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

    const handleViewDetails = async (complaint) => {
        try {

            let res;

            if (activeTab === "urgent") {
                res = await axios.get(`http://127.0.0.1:8000/api/complaints/urgent/${complaint.id}`);
            } else {
                res = complaint;
            }

            setSelectedComplaint(activeTab === "urgent" ? res.data : complaint);
            setShowDetailsModal(true);

        } catch (error) {
            console.error("Failed to fetch complaint details:", error);
        }
    };

    const markAsDone = async (complaint) => {
        try {
            const url = activeTab === "normal"
                ? `/api/complaints/${complaint.id}/done`
                : `/api/complaints/urgent/${complaint.id}/done`;

            await axios.patch(url);
            if (activeTab === "normal") {
                setNormalComplaints(prev => prev.filter(c => c.id !== complaint.id));
            } else {
                setUrgentComplaints(prev => prev.filter(c => c.id !== complaint.id));
            }

            await fetchArchivedComplaints();

        } catch (err) {
            console.error(err);
            alert("Failed to mark as done.");
        }
    };

    const groupComplaintsByDay = (complaints = []) => {
        return complaints.reduce((groups, complaint) => {
            const date = new Date(complaint.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
            });

            if (!groups[date]) groups[date] = [];
            groups[date].push(complaint);

            return groups;
        }, {});
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;

    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    return (
        <div className="messages-page">
            <div className="page-header">
                <h2>OFW Complaints</h2>
                <p>Monitor and respond to OFW complaints</p>
            </div>

            <div className="complaint-tabs-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>

                <div className="complaint-tabs" style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className={activeTab === "normal" ? "active" : ""}
                        onClick={() => setActiveTab("normal")}
                    >
                        <MessageSquareWarning size={18} />
                        Normal Complaints ({normalComplaints.length})
                    </button>

                    <button
                        className={activeTab === "urgent" ? "active urgent-tab" : "urgent-tab"}
                        onClick={() => setActiveTab("urgent")}
                    >
                        <AlertTriangle size={18} />
                        Urgent Complaints ({urgentComplaints.length})
                    </button>
                </div>

                <div className="archive-btn">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={openArchiveModal}
                    >
                        Archive
                    </button>
                </div>

            </div>

            {loading && <p className="mt-4">Loading complaints...</p>}

            {error && <p className="mt-4 text-danger">{error}</p>}


            {!loading && !error && data.length === 0 && (
                <p className="mt-4">No complaints found.</p>
            )}

            <div className="table-responsive mt-3">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: "60px" }}>#</th>
                            <th>OFW Name</th>
                            <th>Type</th>
                            <th>Date Submitted</th>
                            <th style={{ width: "200px" }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {currentRows.map((complaint, index) => {

                            const name =
                                complaint.ofw_name ||
                                complaint.name ||
                                "Unknown OFW";

                            return (
                                <tr key={complaint.id}>

                                    <td>{indexOfFirstRow + index + 1}</td>

                                    <td>
                                        <div className="d-flex align-items-center gap-2">

                                            <div
                                                style={{
                                                    width: "35px",
                                                    height: "35px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#6c757d",
                                                    color: "white",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {getInitials(name)}
                                            </div>

                                            <span>{name}</span>

                                        </div>
                                    </td>

                                    <td>
                                        {activeTab === "urgent" ? (
                                            <span className="badge bg-danger">
                                                Urgent
                                            </span>
                                        ) : (
                                            <span className="badge bg-warning text-dark">
                                                Normal
                                            </span>
                                        )}
                                    </td>

                                    <td>
                                        {new Date(
                                            complaint.created_at
                                        ).toLocaleDateString()}
                                    </td>

                                    <td>

                                        <div className="d-flex gap-2">

                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() =>
                                                    handleViewDetails(complaint)
                                                }
                                            >
                                                Details
                                            </button>

                                            <button className="btn btn-sm btn-success">
                                                Reply
                                            </button>

                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => markAsDone(complaint)}
                                            >
                                                Done
                                            </button>

                                        </div>

                                    </td>

                                </tr>
                            );
                        })}

                        {data.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">
                                    No complaints found.
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        ←
                    </button>

                    <span>
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        →
                    </button>
                </div>
            </div>

            {activeTab === "normal" && showDetailsModal && selectedComplaint && (
                <NormalComplaintModal complaint={selectedComplaint} onClose={() => setShowDetailsModal(false)} />
            )}

            {activeTab === "urgent" && showDetailsModal && selectedComplaint && (
                <UrgentComplaintModal complaint={selectedComplaint} onClose={() => setShowDetailsModal(false)} />
            )}

            {showArchiveModal && (
                <div className="modal-overlay">
                    <div className="archive-modal">
                        <button className="close-btn" onClick={() => setShowArchiveModal(false)}>✕</button>
                        <div className="modal-header">
                            <h3>Archived Complaints</h3>
                        </div>

                        {/* Tabs */}
                        <div className="archive-tabs">
                            <button
                                className={archiveTab === 'normal' ? 'active' : ''}
                                onClick={() => setArchiveTab('normal')}
                            >
                                Normal
                            </button>
                            <button
                                className={archiveTab === 'urgent' ? 'active' : ''}
                                onClick={() => setArchiveTab('urgent')}
                            >
                                Urgent
                            </button>
                        </div>

                        <div className="archive-table">
                            {Object.entries(
                                groupComplaintsByDay(archiveTab === 'normal' ? archivedNormal : archivedUrgent)
                            ).map(([date, complaints]) => (
                                <div key={date} className="archive-day">

                                    <div
                                        className="archive-day-header"
                                        onClick={() =>
                                            setExpandedDays(prev => ({ ...prev, [date]: !prev[date] }))
                                        }
                                    >
                                        <span>📁 Archived {date} ({complaints.length})</span>
                                        <span>{expandedDays[date] ? "▲" : "▼"}</span>
                                    </div>

                                    {expandedDays[date] && (
                                        <table className="table archive-table-content">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>OFW Name</th>
                                                    <th>Date Submitted</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {complaints.map((c, index) => (
                                                    <tr key={c.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{c.ofw_name || c.name}</td>
                                                        <td>{new Date(c.created_at).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}

                                </div>
                            ))}

                            {((archiveTab === "normal" ? archivedNormal : archivedUrgent)?.length || 0) === 0 && (
                                <p className="text-center text-muted mt-3">No archived complaints found.</p>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}