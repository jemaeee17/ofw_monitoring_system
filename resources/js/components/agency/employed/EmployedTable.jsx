import React, { useState } from 'react';
import axios from 'axios';

const EmployedTable = ({ workers, onOpenWorker, setWorkers, setAllWorkers }) => {
    const [deployModal, setDeployModal] = useState({ show: false, worker: null });
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 2;

    const totalPages = Math.ceil(workers.length / rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const paginatedWorkers = workers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const getInitials = (name) => {
        if (!name || typeof name !== 'string') return '';
        return name
            .trim()
            .split(' ')
            .filter(n => n.length > 0)
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    const handleDeploy = async () => {
        const worker = deployModal.worker;
        if (!worker) return;

        try {
            await axios.post(`/api/applications/${worker.id}/set-deployed`);
            alert(`${worker.full_name} is now Deployed!`);
            setWorkers(prev => prev.filter(w => w.id !== worker.id));
            setAllWorkers(prev => prev.map(w =>
                w.id === worker.id ? { ...w, status: 'Deployed' } : w
            ));

            setDeployModal({ show: false, worker: null });
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to set deployed.');
        }
    };

    return (
        <>
            <div className="modern-card overflow-hidden shadow-sm border-0 bg-white" style={{ borderRadius: '15px' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle m-0">
                        <thead style={{ backgroundColor: '#0038a8', color: '#fff' }}>
                            <tr>
                                <th className="ps-4 py-3 small fw-bold text-uppercase">Full Name</th>
                                <th className="small fw-bold text-uppercase">Birthdate</th>
                                <th className="small fw-bold text-uppercase">Contact Number</th>
                                <th className="small fw-bold text-uppercase">Email</th>
                                <th className="small fw-bold text-uppercase">Status</th>
                                <th className="text-center small fw-bold text-uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedWorkers.map(worker => (
                                <tr key={worker.id} style={{ cursor: 'pointer' }}>
                                    <td className="ps-4">
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold me-3"
                                                style={{ width: '40px', height: '40px', fontSize: '14px' }}
                                            >
                                                {getInitials(worker.full_name)}
                                            </div>
                                            <span className="fw-bold text-dark">{worker.full_name ?? 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>{worker.birthdate}</td>
                                    <td>{worker.contact_number}</td>
                                    <td>{worker.email ?? 'N/A'}</td>
                                    <td>
                                        <span className={`badge ${worker.status === 'Deployed' ? 'bg-success' : 'bg-primary text-white'}`}>
                                            {worker.status ?? 'Employed'}
                                        </span>
                                    </td>
                                    <td className="text-center d-flex justify-content-center gap-2">
                                        <button
                                            className="btn btn-sm btn-outline-primary border-2 fw-bold"
                                            style={{ borderRadius: '8px' }}
                                            onClick={() => onOpenWorker(worker)}
                                        >
                                            Open File
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-success border-2 fw-bold"
                                            style={{ borderRadius: '8px' }}
                                            onClick={() => setDeployModal({ show: true, worker })}
                                            disabled={worker.status === 'Deployed'}
                                        >
                                            Deployed
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="d-flex justify-content-end align-items-center mt-2 pe-3">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={handlePrev} disabled={currentPage === 1}>
                            Prev
                        </button>
                        <span className="small text-muted">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button className="btn btn-sm btn-outline-primary ms-2" onClick={handleNext} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Deploy Modal */}
            {deployModal.show && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 3000
                    }}
                >
                    <div className="bg-white p-4 rounded shadow-lg" style={{ minWidth: '350px' }}>
                        <h5 className="fw-bold mb-3">Deploy Worker</h5>
                        <p>
                            Are you sure you want to set <strong>{deployModal.worker.full_name}</strong> status to Deployed?
                        </p>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setDeployModal({ show: false, worker: null })}
                            >
                                Cancel
                            </button>
                            <button className="btn btn-success" onClick={handleDeploy}>
                                Okay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EmployedTable;