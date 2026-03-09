import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus } from "lucide-react";

export default function AgenciesTab({ onStatsUpdate }) {
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [newAgencyName, setNewAgencyName] = useState("");
    const [newAgencyEmail, setNewAgencyEmail] = useState("");
    const [newAgencyPassword, setNewAgencyPassword] = useState("");
    const [newAgencyPasswordConfirm, setNewAgencyPasswordConfirm] = useState("");

    const statuses = ["All", "Active", "Blocked"];

    const fetchAgencies = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/agencies");
            setAgencies(res.data);
        } catch (error) {
            console.error("Error fetching agencies:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgencies();
    }, []);

    const filteredAgencies = agencies.filter((agency) => {
        const matchesSearch = agency.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "All" || agency.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getInitials = (name) =>
        name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();

    const handleCreateAgency = async () => {
        if (!newAgencyName || !newAgencyEmail || !newAgencyPassword || !newAgencyPasswordConfirm) {
            return alert("Please fill in all fields!");
        }

        if (newAgencyPassword !== newAgencyPasswordConfirm) {
            return alert("Passwords do not match!");
        }

        try {
            await axios.post("/api/agencies", {
                name: newAgencyName,
                email: newAgencyEmail,
                password: newAgencyPassword,
                password_confirmation: newAgencyPasswordConfirm,
            });

            setShowModal(false);
            setNewAgencyName("");
            setNewAgencyEmail("");
            setNewAgencyPassword("");
            setNewAgencyPasswordConfirm("");

            fetchAgencies();
            alert("Agency created successfully!");
        } catch (error) {
            console.error("Error creating agency:", error);

            if (error.response && error.response.status === 422) {
                const messages = Object.values(error.response.data.errors).flat();
                alert(messages.join("\n"));
            } else {
                alert("Failed to create agency.");
            }
        }
    };

    const handleBlockAgency = async (id) => {
        if (!window.confirm("Are you sure you want to block this agency?")) return;

        try {
            await axios.patch(`/api/agencies/${id}/block`);
            alert("Agency has been blocked!");
            
            fetchAgencies();
            if (onStatsUpdate) onStatsUpdate();
        } catch (error) {
            console.error(error);
            alert("Failed to block the agency.");
        }
    };

    const handleReactivateAgency = async (id) => {
        if (!window.confirm("Are you sure you want to reactivate this agency?")) return;

        try {
            await axios.patch(`/api/agencies/${id}/reactivate`);
            alert("Agency reactivated successfully!");
            fetchAgencies();
            if (onStatsUpdate) onStatsUpdate();
        } catch (error) {
            console.error("Error reactivating agency:", error);
            alert("Failed to reactivate agency.");
        }
    };

    if (loading) return <p>Loading agencies...</p>;

    return (
        <div className="container py-4">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Agency Management</h2>
                    <p className="text-muted">Manage and monitor recruitment agencies</p>
                </div>
                <button
                    className="btn btn-primary d-flex align-items-center gap-1"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={16} /> Register Agency
                </button>
            </div>

            {/* SEARCH BAR */}
            <div className="d-flex align-items-center mb-3 gap-2">
                <input
                    type="text"
                    placeholder="Search by agency name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-control"
                    style={{ maxWidth: "300px" }}
                />
            </div>

            {/* STATUS FILTER */}
            <div className="mb-3 d-flex gap-2">
                {statuses.map((status) => (
                    <button
                        key={status}
                        className={`btn btn-sm ${statusFilter === status ? "btn-primary" : "btn-outline-secondary"}`}
                        onClick={() => setStatusFilter(status)}
                    >
                        {status} ({status === "All" ? agencies.length : agencies.filter(a => a.status === status).length})
                    </button>
                ))}
            </div>

            {/* TABLE */}
            <div className="table-responsive">
                <table className="table table-hover table-striped align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Agency</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAgencies.map((agency) => (
                            <tr key={agency.id}>
                                <td className="d-flex align-items-center gap-2">
                                    <div
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            backgroundColor: "#6c757d",
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: "bold",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {getInitials(agency.name)}
                                    </div>
                                    <div>{agency.name}</div>
                                </td>
                                <td>
                                    <span className={`badge ${agency.status.toLowerCase()}`}>
                                        {agency.status}
                                    </span>
                                </td>
                                <td>
                                    {agency.status === "Active" ? (
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleBlockAgency(agency.id)}
                                        >
                                            Block
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => handleReactivateAgency(agency.id)}
                                        >
                                            Reactivate
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredAgencies.length === 0 && (
                            <tr>
                                <td colSpan={2} className="text-center text-muted">
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content p-3">
                            <div className="modal-header">
                                <h5 className="modal-title">Register New Agency</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body d-flex flex-column gap-2">
                                <input
                                    type="text"
                                    placeholder="Agency Legal Name"
                                    className="form-control"
                                    value={newAgencyName}
                                    onChange={(e) => setNewAgencyName(e.target.value)}
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="form-control"
                                    value={newAgencyEmail}
                                    onChange={(e) => setNewAgencyEmail(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="form-control"
                                    value={newAgencyPassword}
                                    onChange={(e) => setNewAgencyPassword(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="form-control"
                                    value={newAgencyPasswordConfirm}
                                    onChange={(e) => setNewAgencyPasswordConfirm(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleCreateAgency}>Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}