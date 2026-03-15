import React from "react";

const ApplicantsTable = ({
    applicantsData,
    searchTerm,
    setSearchTerm,
    setShowForm,
    handleDownloadClick,
    handleOpenAssign,
    handleOpenDetails
}) => {
    return (
        <>
            <div className="applicants-header-card mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h1 className="display-6 fw-bold m-0">Applicants</h1>
                </div>
            </div>

            <div className="modern-card p-4 mb-4">
                <div className="row g-3 align-items-center">
                    <div className="col-md-6 d-flex gap-2">
                        <button className="btn btn-ph-red" onClick={() => setShowForm(true)}>➕ New Applicant</button>
                        <button className="btn btn-ph-blue-outline" onClick={() => setShowForm(true)}>📋 Application Form</button>
                    </div>
                    <div className="col-md-6">
                        <div className="search-group-ph">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="modern-card overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover m-0 text-center">
                        <thead className="table-ph-blue">
                            <tr>
                                <th>Date Applied ▾</th>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Age</th>
                                <th>Primary Contact</th>
                                <th>Email</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicantsData
                                .filter((val) =>
                                    val.name.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((item, index) => (
                                    <tr key={index} className="align-middle">
                                        <td className="text-muted small">{item.date}</td>
                                        <td className="fw-bold">{item.name}</td>
                                        <td>{item.gender}</td>
                                        <td>{item.age}</td>
                                        <td>{item.contact}</td>
                                        <td className="text-primary small">{item.email}</td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-1">
                                                <button
                                                    className="btn action-btn-ph"
                                                    title={item.hasAssignedEmployer ? "Employer already assigned" : "Assign Employer"}
                                                    onClick={() => handleOpenAssign(item)}
                                                    disabled={item.hasAssignedEmployer}
                                                    style={{
                                                        opacity: item.hasAssignedEmployer ? 0.5 : 1,
                                                        cursor: item.hasAssignedEmployer ? "not-allowed" : "pointer"
                                                    }}
                                                >
                                                    🤝
                                                </button>
                                                <button
                                                    className="btn action-btn-ph"
                                                    title="Download PDF"
                                                    onClick={() => handleDownloadClick(item)}
                                                >
                                                    📥
                                                </button>
                                                <button
                                                    className="btn action-btn-ph"
                                                    title="Details"
                                                    onClick={() => handleOpenDetails(item)}
                                                >
                                                    ℹ️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ApplicantsTable;