import React, { useState } from 'react';

const EmployersTable = ({ employers, onSelectEmployer, phColors }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 3;

    const totalPages = Math.ceil(employers.length / rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const paginatedEmployers = employers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="modern-card bg-white shadow-sm overflow-hidden border-0" style={{ borderRadius: '15px' }}>
            <div className="table-responsive">
                <table className="table table-hover align-middle m-0">
                    <thead className="small fw-bold text-white text-center align-items-center" style={{ backgroundColor: phColors.blue }}>
                        <tr>
                            <th className="ps-4 py-3 align-middle">EMPLOYER ENTITY</th>
                            <th>SECTOR</th>
                            <th>HQ LOCATION</th>
                            <th>EMAIL</th>
                            <th>CONTACT</th>
                            <th>NO. OF EMPLOYEES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedEmployers.map(emp => (
                            <tr key={emp.id} className="employer-table-row">
                                <td className="ps-4 py-3">
                                    <div className="d-flex align-items-center text-center">
                                        <div>
                                            <div className="fw-bold text-dark text-center">{emp.company_name}</div>
                                            <small className="text-muted" style={{ fontSize: '10px' }}>KSA-ID: {emp.id}0029</small>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="badge bg-light text-primary border-0 px-3 py-2 rounded-pill small align-items-center">{emp.industry_sector}</span></td>
                                <td><i className="bi bi-geo-alt me-1 text-center"></i>{emp.regional_office_address}, KSA</td>
                                <td className="text-dark fw-bold text-center">{emp.email}</td>
                                <td className="text-dark fw-bold text-center">{emp.poc_contact_number}</td>
                                <td className="text-dark fw-bold text-center">{emp.assigned_applicants_count}</td>
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

export default EmployersTable;