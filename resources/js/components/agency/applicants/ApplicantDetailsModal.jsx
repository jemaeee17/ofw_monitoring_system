import React, { useState, useEffect } from "react";
import axios from "axios";

const ApplicantDetailsModal = ({ show, onClose, selectedApplicant, onSave }) => {
    const [activeTab, setActiveTab] = useState("Documents");
    const [currentDoc, setCurrentDoc] = useState({ type: "", file: null });
    const [documents, setDocuments] = useState([]);
    const [coHosts, setCoHosts] = useState([]);
    const [showDeployConfirm, setShowDeployConfirm] = useState(false);
    const [flights, setFlights] = useState([
        { agency: "", file: null, contactName: "", contactNumber: "" }
    ]);

    useEffect(() => {
        if (show && selectedApplicant.documents) {
            const docs = selectedApplicant.documents.map(doc => ({
                id: doc.id,
                type: doc.type,
                file: null,
                isNew: false
            }));
            setDocuments(docs);
        }
    }, [show, selectedApplicant]);

    useEffect(() => {
        if (show) {
            fetch("/api/co-hosts")
                .then(res => res.json())
                .then(data => setCoHosts(data))
                .catch(err => console.error("Failed to fetch co-hosts:", err));
        }
    }, [show]);

    if (!show) return null;

    const requiredDocs = [
        "Passport",
        "Medical Clearance",
        "NBI Clearance",
        "Contract",
        "Visa"
    ];

    const allDocsUploaded = requiredDocs.every(req =>
        documents.some(doc => doc.type === req)
    );

    const flightComplete =
        flights.length > 0 &&
        flights[0].agency &&
        flights[0].contactName &&
        flights[0].contactNumber &&
        flights[0].file;

    const deploymentComplete = allDocsUploaded && flightComplete;

    const handleCurrentChange = (field, value) => {
        setCurrentDoc(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFlightChange = (index, field, value) => {
        setFlights(prev =>
            prev.map((flight, i) =>
                i === index ? { ...flight, [field]: value } : flight
            )
        );
    };

    const addCurrentToChecklist = () => {
        if (!currentDoc.type || !currentDoc.file) {
            alert("Please select document type and upload a file first.");
            return;
        }

        setDocuments(prev => [
            ...prev,
            { ...currentDoc, isNew: true }
        ]);


        setCurrentDoc({ type: "", file: null });
    };

    const removeItem = (index) => {
        setDocuments(prev => prev.filter((_, i) => i !== index));
    };

    const saveChanges = async () => {
        try {
            const formData = new FormData();

            documents.forEach((doc, index) => {
                if (doc.isNew && doc.file) {  
                    formData.append(`documents[${index}][type]`, doc.type);
                    formData.append(`documents[${index}][file]`, doc.file);
                }
            });

            flights.forEach((flight, index) => {
                if (flight.file) { 
                    formData.append(`flights[${index}][agency]`, flight.agency);
                    formData.append(`flights[${index}][contactName]`, flight.contactName);
                    formData.append(`flights[${index}][contactNumber]`, flight.contactNumber);
                    formData.append(`flights[${index}][file]`, flight.file);
                }
            });

            await fetch(`/api/applications/${selectedApplicant.id}/details`, {
                method: "POST",
                body: formData
            });

            if (deploymentComplete) {
                setShowDeployConfirm(true);
            } else {
                alert("Details saved!");
                onClose();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const setEmployedStatus = async () => {
        try {

            await fetch(`/api/applications/${selectedApplicant.id}/set-employed`, {
                method: "POST"
            });

            alert("Applicant is now employed.");

            if (onSave) {
                onSave(selectedApplicant.id);
            }

            setShowDeployConfirm(false);
            onClose();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
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
                className="bg-white shadow-lg border-0"
                style={{
                    borderRadius: "25px",
                    width: "95%",
                    maxWidth: "850px",
                    overflow: "hidden"
                }}
            >
                <div className="p-4 d-flex align-items-center gap-3">
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                        style={{
                            width: "50px",
                            height: "50px",
                            border: "3px solid #0038a8",
                            color: "#6c757d"
                        }}
                    >
                        <span className="fw-bold" style={{ fontSize: "20px" }}>i</span>
                    </div>
                    <h4 className="m-0 fw-bold text-secondary">
                        Other Details - {selectedApplicant?.name}
                    </h4>
                </div>

                <div className="px-4 d-flex gap-2">
                    {["Documents", "Flights"].map(tab => (
                        <button
                            key={tab}
                            className="btn px-5 py-2 fw-bold border-0"
                            style={{
                                backgroundColor: activeTab === tab ? "#0038a8" : "#f8f9fa",
                                color: activeTab === tab ? "white" : "#6c757d",
                                borderBottom: activeTab === tab ? "4px solid #fcd116" : "none",
                                borderRadius: "15px 15px 0 0",
                            }}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div
                    className="m-3 p-4 bg-light shadow-inner"
                    style={{
                        borderRadius: "20px",
                        border: "1px solid #dee2e6"
                    }}
                >
                    <div className="row g-4">
                        <div className="col-md-7">

                            {activeTab === "Documents" && (
                                <>
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="form-label small fw-bold text-muted">
                                                Document Type
                                            </label>
                                            <select
                                                className="form-select border-0 shadow-sm py-2"
                                                value={currentDoc.type}
                                                onChange={(e) =>
                                                    handleCurrentChange("type", e.target.value)
                                                }
                                            >
                                                <option value="">Select Document Type</option>
                                                <option value="Medical Clearance">Medical Clearance</option>
                                                <option value="NBI Clearance">NBI Clearance</option>
                                                <option value="Passport">Passport</option>
                                                <option value="Contract">Contract</option>
                                                <option value="Visa">Visa</option>
                                            </select>
                                        </div>

                                        <div className="col-6">
                                            <label className="form-label small fw-bold text-muted">
                                                File
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control border-0 shadow-sm py-2"
                                                onChange={(e) =>
                                                    handleCurrentChange("file", e.target.files[0])
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="text-end">
                                        <button
                                            className="btn btn-dark"
                                            onClick={addCurrentToChecklist}
                                        >
                                            + Add Another File
                                        </button>
                                    </div>
                                </>
                            )}

                            {activeTab === "Flights" &&
                                flights.map((flight, index) => (
                                    <div className="row g-3 mb-3" key={index}>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold text-muted">
                                                Abroad Agency (Co-Host)
                                            </label>
                                            <select
                                                className="form-select border-0 shadow-sm py-2"
                                                value={flight.agency}
                                                onChange={(e) => {
                                                    const selected = coHosts.find(c => c.id == e.target.value);

                                                    handleFlightChange(index, "agency", selected?.name || "");
                                                    handleFlightChange(index, "contactName", selected?.contact || "");
                                                }}
                                            >
                                                <option value="">Select Co-Host Agency</option>
                                                {coHosts.map(co => (
                                                    <option key={co.id} value={co.id}>
                                                        {co.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-6">
                                            <label className="form-label small fw-bold text-muted">
                                                File
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control border-0 shadow-sm py-2"
                                                onChange={(e) =>
                                                    handleFlightChange(index, "file", e.target.files[0])
                                                }
                                            />
                                        </div>

                                        <div className="col-6">
                                            <label className="form-label small fw-bold text-muted">
                                                Contact Person
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control border-0 shadow-sm py-2"
                                                value={flight.contactName}
                                                onChange={(e) =>
                                                    handleFlightChange(index, "contactName", e.target.value)
                                                }
                                            />
                                        </div>

                                        <div className="col-6">
                                            <label className="form-label small fw-bold text-muted">
                                                Contact Number
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control border-0 shadow-sm py-2"
                                                value={flight.contactNumber}
                                                onChange={(e) =>
                                                    handleFlightChange(index, "contactNumber", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div className="col-md-5">
                            <div
                                className="bg-white p-4 h-100 shadow-sm"
                                style={{
                                    borderRadius: "20px",
                                    border: "1px solid #dee2e6"
                                }}
                            >
                                <h6 className="fw-bold mb-3">Checklist</h6>

                                {documents.length === 0 && (
                                    <div className="text-muted small">
                                        No files uploaded yet.
                                    </div>
                                )}

                                {documents.map((doc, index) => (
                                    <div
                                        key={index}
                                        className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded shadow-sm"
                                        style={{ fontSize: "0.85rem" }}
                                    >
                                        <div>
                                            {doc.type} •{" "}
                                            <span className="text-success">
                                                {doc.file?.name}
                                            </span>
                                        </div>

                                        <div
                                            style={{
                                                cursor: "pointer",
                                                color: "red",
                                                fontWeight: "bold"
                                            }}
                                            onClick={() => removeItem(index)}
                                        >
                                            ✕
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 d-flex justify-content-end gap-3">
                    <button
                        className="btn btn-white shadow-sm px-5 py-2 fw-bold text-secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn px-5 py-2 fw-bold shadow-sm text-white"
                        style={{
                            backgroundColor: "#28a745",
                            borderRadius: "10px"
                        }}
                        onClick={saveChanges}
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            {showDeployConfirm && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 4000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <div className="bg-white p-4 shadow-lg" style={{
                        borderRadius: "15px",
                        width: "400px",
                        textAlign: "center"
                    }}>
                        <h5 className="fw-bold mb-3">Deployment Complete</h5>

                        <p>
                            All documents have been uploaded.
                            <br />
                            Please set <strong>{selectedApplicant?.name}</strong> as
                            <strong> Employed</strong>.
                        </p>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowDeployConfirm(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="btn btn-success"
                                onClick={setEmployedStatus}
                            >
                                Set as Employed
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicantDetailsModal;