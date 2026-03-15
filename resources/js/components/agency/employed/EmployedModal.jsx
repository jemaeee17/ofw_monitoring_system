import React, { useState, useRef } from 'react';
import axios from 'axios';

const EmployedModal = ({ selectedWorker, onClose, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('Documents');

    const [workerDocuments, setWorkerDocuments] = useState(selectedWorker.documents || []);
    const [workerFlights, setWorkerFlights] = useState(selectedWorker.flights || []);

    const [editingDocIndex, setEditingDocIndex] = useState(null);
    const [editingFlightIndex, setEditingFlightIndex] = useState(null);

    const fileInputRef = useRef(null);
    const flightFileInputRef = useRef(null);

    const handleDocumentChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (editingDocIndex !== null) {
            const updatedDocs = [...workerDocuments];
            updatedDocs[editingDocIndex] = {
                ...updatedDocs[editingDocIndex],
                file_path: file.name,
                newFile: file,
            };
            setWorkerDocuments(updatedDocs);
            setEditingDocIndex(null);
        }
    };

    const handleFlightChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (editingFlightIndex !== null) {
            const updatedFlights = [...workerFlights];
            updatedFlights[editingFlightIndex] = {
                ...updatedFlights[editingFlightIndex],
                file_path: file.name,
                newFile: file,
            };
            setWorkerFlights(updatedFlights);
            setEditingFlightIndex(null);
        }
    };

    const getInitials = (name) => {
        if (!name) return "";
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const handleUpdateRegistry = async () => {
        const formData = new FormData();

        formData.append("worker_id", selectedWorker.id);

        workerDocuments.forEach((doc, index) => {
            if (doc.newFile) {
                formData.append(`documents[${index}][id]`, doc.id);
                formData.append(`documents[${index}][file]`, doc.newFile);
            }
        });

        workerFlights.forEach((flight, index) => {
            if (flight.newFile) {
                formData.append(`flights[${index}][id]`, flight.id);
                formData.append(`flights[${index}][file]`, flight.newFile);
            }
        });

        try {
            const { data } = await axios.post(
                "/api/update-registry",
                formData,
                { withCredentials: true }
            );


            if (data.documents) setWorkerDocuments(data.documents);
            if (data.flights) setWorkerFlights(data.flights);

            alert("Registry updated successfully!");

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Update failed");
        }
    };

    return (
        <div
            className="modal-overlay-ph"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.6)',
                zIndex: 5000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(5px)'
            }}
        >
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleDocumentChange}
            />
            <input
                type="file"
                ref={flightFileInputRef}
                style={{ display: 'none' }}
                onChange={handleFlightChange}
            />

            <div
                className="bg-white rounded-4 shadow-lg p-0 overflow-hidden animate-slide-up"
                style={{ width: '90%', maxWidth: '900px', border: 'none' }}
            >
                {/* Modal Header */}
                <div
                    className="p-4 d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: '#0038a8', color: '#fff' }}
                >
                    <div className="d-flex align-items-center">
                        <div className="bg-white text-primary rounded p-2 me-3 fw-bold">
                            {getInitials(selectedWorker.name)}
                        </div>
                        <h4 className="fw-bold mb-0">{selectedWorker.name} - Registry Details</h4>
                    </div>
                    <button className="btn text-white fs-4 border-0" onClick={onClose}>
                        &times;
                    </button>
                </div>

                {/* Tabs */}
                <div className="d-flex bg-light border-bottom">
                    <button
                        className={`flex-grow-1 py-3 border-0 fw-bold ${activeTab === 'Documents'
                            ? 'bg-white text-primary border-bottom border-primary border-3'
                            : 'text-muted'
                            }`}
                        onClick={() => setActiveTab('Documents')}
                    >
                        📑 Documents
                    </button>
                    <button
                        className={`flex-grow-1 py-3 border-0 fw-bold ${activeTab === 'Flights'
                            ? 'bg-white text-primary border-bottom border-primary border-3'
                            : 'text-muted'
                            }`}
                        onClick={() => setActiveTab('Flights')}
                    >
                        ✈️ Flights & Passport
                    </button>
                </div>

                <div className="p-4">
                    {activeTab === 'Documents' ? (
                        <div className="row g-4">
                            <div className="col-12">
                                <h6 className="fw-bold text-dark mb-3 text-uppercase">Verified Document List</h6>

                                <table className="table table-sm table-bordered w-100">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Document Name</th>
                                            <th>Uploaded</th>
                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {workerDocuments.length > 0 ? (
                                            workerDocuments.map((doc, index) => (
                                                <tr key={doc.id}>
                                                    <td>{index + 1}</td>
                                                    <td className="text-primary fw-semibold">
                                                        {doc.newFile ? doc.newFile.name : doc.file_name || doc.file_path.split('/').pop()}
                                                        {doc.newFile && <span className="badge bg-warning ms-2">Pending</span>}
                                                    </td>
                                                    <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                                                    <td className="d-flex justify-content-center gap-1">
                                                        <a
                                                            href={`http://127.0.0.1:8000/storage/${doc.file_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-light"
                                                        >
                                                            👁️ View
                                                        </a>
                                                        <button
                                                            className="btn btn-sm btn-light"
                                                            onClick={() => {
                                                                setEditingDocIndex(index);
                                                                fileInputRef.current.click();
                                                            }}
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center text-muted">
                                                    No documents uploaded.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="row g-4">
                            <div className="col-12">
                                <h6 className="fw-bold text-primary text-uppercase small">Flights & Passport</h6>

                                <table className="table table-sm table-bordered w-100 mt-3">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Agency</th>
                                            <th>Uploaded</th>
                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {workerFlights.length > 0 ? (
                                            workerFlights.map((flight, index) => (
                                                <tr key={flight.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{flight.agency}</td>
                                                    <td>{new Date(flight.created_at).toLocaleDateString()}</td>
                                                    <td className="d-flex justify-content-center gap-1">
                                                        {flight.file_path ? (
                                                            <a
                                                                href={`http://127.0.0.1:8000/storage/${flight.file_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-sm btn-light"
                                                            >
                                                                👁️ View
                                                            </a>
                                                        ) : (
                                                            <span className="text-muted">No file</span>
                                                        )}
                                                        <button
                                                            className="btn btn-sm btn-light"
                                                            onClick={() => {
                                                                setEditingFlightIndex(index);
                                                                flightFileInputRef.current.click();
                                                            }}
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center text-muted">
                                                    No flights uploaded.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-light d-flex justify-content-end gap-2 border-top">
                    <button className="btn btn-white border px-4 fw-bold" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary px-4 fw-bold shadow"
                        onClick={handleUpdateRegistry}
                    >
                        Update Registry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployedModal;