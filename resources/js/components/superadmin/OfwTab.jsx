import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, MapPin, Building2, Eye } from "lucide-react";

export default function OfwTab() {
    const [ofwData, setOfwData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedOfw, setSelectedOfw] = useState(null);
    const [selectedOfwDetails, setSelectedOfwDetails] = useState(null);

    const statuses = ["All", "Applicant", "Employed", "Deployed"];

    useEffect(() => {
        const fetchOfws = async () => {
            try {
                const res = await axios.get("/api/applications");
                setOfwData(res.data);
            } catch (error) {
                console.error("Error fetching OFWs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOfws();
    }, []);

    const filteredOFWs = ofwData.filter((ofw) => {
        const name = ofw.full_name || "";
        const status = ofw.status || "Applicant";

        const matchesSearch =
            name.toLowerCase().includes(search.toLowerCase()) ||
            (ofw.id ? ofw.id.toString().includes(search.toLowerCase()) : false);

        const matchesStatus =
            statusFilter === "All" || status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) return <p>Loading OFWs...</p>;

    return (
        <div className="container py-4">
            <div className="mb-4">
                <h2 className="mb-1">OFW Management</h2>
                <p className="text-muted">Manage and monitor overseas Filipino workers</p>
            </div>

            {!selectedOfw ? (
                <>
                    <div className="d-flex align-items-center mb-3 gap-2">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="form-control"
                            style={{ maxWidth: "300px" }}
                        />
                    </div>
                    <div className="mb-3 d-flex gap-2">
                        {statuses.map((status) => (
                            <button
                                key={status}
                                className={`btn btn-sm ${statusFilter === status ? "btn-primary" : "btn-outline-secondary"}`}
                                onClick={() => setStatusFilter(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover table-striped align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>OFW</th>
                                    <th>Email</th>
                                    <th>Contact Number</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOFWs.map((ofw) => (
                                    <tr key={ofw.id}>
                                        <td className="d-flex align-items-center gap-2">
                                            <div className="initials-circle">
                                                {ofw.full_name
                                                    .split(" ")
                                                    .map(n => n[0])
                                                    .join("")
                                                    .toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="fw-bold">{ofw.full_name}</div>
                                                <div className="text-muted small">{ofw.birthdate}</div>
                                            </div>
                                        </td>
                                        <td>{ofw.email}</td>
                                        <td>{ofw.phone}</td>
                                        <td>
                                            <span className={`badge ${(ofw.status || "Applicant").toLowerCase()}`}>
                                                {ofw.status || "Applicant"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                                                onClick={() => {
                                                    setSelectedOfw(ofw);
                                                    setSelectedOfwDetails(ofw);
                                                }}
                                            >
                                                <Eye size={16} /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredOFWs.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center text-muted">
                                            No records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="card p-3 shadow-sm">
                    <button
                        className="btn btn-sm btn-outline-secondary mb-3"
                        onClick={() => {
                            setSelectedOfw(null);
                            setSelectedOfwDetails(null);
                        }}
                    >
                        ← Back to List
                    </button>

                    <div className="d-flex gap-3 align-items-center mb-3">
                        <div className="initials-circle" style={{ width: 80, height: 80, fontSize: 28 }}>
                            {(selectedOfwDetails.full_name || "")
                                .split(" ")
                                .map(n => n[0])
                                .join("")
                                .toUpperCase()}
                        </div>

                        <div>
                            <h4 className="mb-1">{selectedOfwDetails.full_name}</h4>
                            <p className="mb-1 text-muted">Birthdate: {selectedOfwDetails.birthdate}</p>
                            {selectedOfwDetails.gender && <p className="mb-1 text-muted">Gender: {selectedOfwDetails.gender}</p>}
                            <span className={`badge ${(selectedOfwDetails.status || "Applicant").toLowerCase()}`}>
                                {selectedOfwDetails.status || "Applicant"}
                            </span>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3"><strong>ID Number:</strong><p>{selectedOfwDetails.id}</p></div>
                        <div className="col-md-3"><strong>Email:</strong><p>{selectedOfwDetails.email || "N/A"}</p></div>
                        <div className="col-md-3"><strong>Contact Number:</strong><p>{selectedOfwDetails.contact_number}</p></div>
                        <div className="col-md-3"><strong>Status:</strong><p>{selectedOfwDetails.status}</p></div>
                        {selectedOfwDetails.deployment_date && (
                            <div className="col-md-3"><strong>Deployment Date:</strong><p>{selectedOfwDetails.deployment_date}</p></div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}