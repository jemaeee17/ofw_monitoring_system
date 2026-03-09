import React, { useState } from 'react';

const CoHostTable = ({ agencies, onAction }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 3;

    const totalPages = Math.ceil(agencies.length / rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const paginatedAgencies = agencies.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    return (
        <div className="modern-card overflow-hidden shadow-sm border-0 bg-white" style={{ borderRadius: '20px' }}>
            <div className="table-responsive">
                <table className="table table-hover align-middle m-0">
                    <thead className="bg-light text-secondary">
                        <tr style={{ borderBottom: '2px solid #00d2ff' }}>
                            <th className="ps-4 py-3 small fw-bold text-uppercase">Partner Agency</th>
                            <th className="small fw-bold text-uppercase">HQ Location</th>
                            <th className="small fw-bold text-uppercase">Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedAgencies.map((agency) => (
                            <tr key={agency.id} className="cohost-table-row">
                                <td className="ps-4 py-3">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-primary text-white p-2 rounded-3 me-3 d-flex align-items-center justify-content-center fw-bold" style={{ width: '38px', height: '38px', fontSize: '14px' }}>
                                            {agency.name.charAt(0)}
                                        </div>
                                        <div>
                                            <span className="fw-bold text-dark d-block">{agency.name}</span>
                                            <small className="text-muted">UID: {agency.id}00-KSA</small>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="badge bg-light text-muted border px-3 py-2 rounded-pill" style={{ fontWeight: '500' }}>📍 {agency.location}</span></td>
                                <td className="fw-bold text-secondary">{agency.contact}</td>
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
    );
};

export default CoHostTable; 