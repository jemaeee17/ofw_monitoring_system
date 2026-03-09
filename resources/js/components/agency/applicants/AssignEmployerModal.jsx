import React, { useState, useEffect } from "react";

const AssignEmployerModal = ({ show, onClose, selectedApplicant, employers, onAssign }) => {
    const [selectedEmployer, setSelectedEmployer] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState("");
    const [salary, setSalary] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const POSITIONS = [
        "Housekeeping",
        "Caregiver",
        "Nurse",
        "Domestic Helper",
        "Construction Worker",
        "Welder",
        "Driver",
        "Hotel Staff",
        "Factory Worker",
    ];

    useEffect(() => {
        if (show) {
            setSelectedEmployer("");
            setSelectedPosition("");
            setSalary("");
            setShowSuccess(false);
        }
    }, [show]);

    if (!show) return null;

    const handleAssignClick = async () => {
        if (!selectedEmployer || !selectedPosition) {
            alert("Please select an employer and position.");
            return;
        }

        try {
            await onAssign({
                applicantId: selectedApplicant.id,
                employerId: selectedEmployer.id,
                position: selectedPosition,
                salary: salary,
            });

            setShowSuccess(true);

        } catch (error) {
            alert("Assignment failed.");
        }
    };

    return (
        <>
            <div
                className="modal-overlay-ph"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 3000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    className="bg-white p-4 shadow-lg border-0 animate-fade-in"
                    style={{ borderRadius: "20px", width: "100%", maxWidth: "450px" }}
                >
                    {/* HEADER */}
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                            style={{
                                width: "60px",
                                height: "60px",
                                background: "linear-gradient(135deg, #0038a8 50%, #ce1126 50%)",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "24px",
                                    filter: "drop-shadow(0px 0px 2px rgba(255,255,255,0.8))",
                                }}
                            >
                                👥
                            </span>
                        </div>
                        <h4 className="m-0 fw-bold" style={{ fontSize: "1.4rem", color: "#0038a8" }}>
                            Assign an Employer for{" "}
                            <span style={{ color: "#ce1126" }}>{selectedApplicant?.name}</span>
                        </h4>
                    </div>

                    {/* EMPLOYER SELECT */}
                    <div className="mb-4">
                        <select
                            className="form-select custom-input-ph py-2 px-3 shadow-sm border-0"
                            style={{ backgroundColor: "#f8f9fa" }}
                            value={selectedEmployer?.id || ""}
                            onChange={(e) => {
                                const employer = employers.find(emp => emp.id === parseInt(e.target.value));
                                setSelectedEmployer(employer);
                            }}
                        >
                            <option value="">Not Assigned</option>
                            {employers.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.company_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* POSITION*/}
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-muted">
                            Select Position
                        </label>
                        <select
                            className="form-select custom-input-ph py-2 px-3 shadow-sm border-0"
                            style={{ backgroundColor: "#f8f9fa" }}
                            value={selectedPosition}
                            onChange={(e) => setSelectedPosition(e.target.value)}
                        >
                            <option value="">Select Position</option>
                            {POSITIONS.map((pos, index) => (
                                <option key={index} value={pos}>
                                    {pos}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* SALARY INPUT */}
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-muted">
                            Salary (SAR)
                        </label>
                        <div className="input-group shadow-sm">
                            <span className="input-group-text bg-light border-0">
                                SAR
                            </span>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                className="form-control border-0"
                                placeholder="Enter salary amount"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="d-flex gap-3 justify-content-center">
                        <button
                            className="btn btn-light border shadow-sm px-5 py-2 fw-bold"
                            style={{ borderRadius: "10px", color: "#6c757d" }}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn px-5 py-2 fw-bold shadow-sm text-white"
                            style={{
                                borderRadius: "10px",
                                backgroundColor: "#0038a8",
                                borderBottom: "4px solid #fcd116",
                            }}
                            onClick={handleAssignClick}
                        >
                            Assign
                        </button>
                    </div>
                </div>
            </div>

            {showSuccess && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 4000 }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg rounded-4">
                                <div className="modal-body text-center p-5">
                                    <div className="mb-3">
                                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "4rem" }}></i>
                                    </div>

                                    <h4 className="fw-bold text-success">
                                        Employer Assigned Successfully!
                                    </h4>

                                    <p className="text-muted mt-2">
                                        {selectedApplicant?.name} has been assigned to {selectedEmployer?.company_name}.
                                    </p>

                                    <div className="d-flex justify-content-center gap-3 mt-4">
                                        <button
                                            className="btn btn-outline-secondary px-4"
                                            onClick={() => setShowSuccess(false)}
                                        >
                                            Stay Here
                                        </button>

                                        <button
                                            className="btn btn-primary px-4"
                                            onClick={() => {
                                                setShowSuccess(false);
                                                onClose(); 
                                            }}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-backdrop fade show" style={{ zIndex: 3990 }}></div>
                </>
            )}
        </>
    );
};

export default AssignEmployerModal;