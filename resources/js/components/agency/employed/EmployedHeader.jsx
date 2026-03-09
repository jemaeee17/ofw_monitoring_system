import React from 'react';

const EmployedHeader = ({ total, newDeployments, searchTerm, setSearchTerm }) => {
    return (
        <>
            {/* HEADER SECTION */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white shadow-sm" style={{ borderRadius: '15px', borderLeft: '6px solid #0038a8' }}>
                <div>
                    <h2 className="fw-bold mb-0" style={{ color: '#0038a8' }}>Deployed Worker Registry</h2>
                    <p className="text-muted mb-0 small">Monitoring Kingdom of Saudi Arabia (KSA) Deployments</p>
                </div>
                <div className="d-flex gap-2">
                    <div className="text-end me-3">
                        <div className="small text-muted">Last Sync</div>
                        <div className="fw-bold text-dark">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <div className="modern-card p-3 shadow-sm bg-white border-0 h-100" style={{ borderRadius: '15px', borderTop: '4px solid #0038a8' }}>
                        <span className="text-muted small fw-bold text-uppercase">Total On-Site</span>
                        <h2 className="display-6 fw-bold mt-2" style={{ color: '#0038a8' }}>{total}</h2>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="modern-card p-3 shadow-sm bg-white border-0 h-100" style={{ borderRadius: '15px', borderTop: '4px solid #0dcaf0' }}>
                        <span className="text-muted small fw-bold text-uppercase">New Monthly Deployments</span>
                        <h2 className="display-6 fw-bold mt-2" style={{ color: '#0dcaf0' }}>{newDeployments}</h2>
                    </div>
                </div>
            </div>

            {/* SEARCH BAR */}
            <div className="modern-card p-3 mb-4 bg-white shadow-sm border-0 d-flex justify-content-between align-items-center" style={{ borderRadius: '15px' }}>
                <div className="search-group-ph border-0 bg-light px-3 py-2 rounded-pill d-flex align-items-center w-50">
                    <span className="me-2 text-muted">🔍</span>
                    <input
                        type="text"
                        className="form-control border-0 bg-transparent shadow-none"
                        placeholder="Search Worker Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="btn btn-warning fw-bold px-4 shadow-sm" style={{ borderRadius: '10px', color: '#000' }}>
                    📥 Export Deployment Report
                </button>
            </div>
        </>
    );
};

export default EmployedHeader;