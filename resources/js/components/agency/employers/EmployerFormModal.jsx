import React from 'react';

const EmployerFormModal = ({ show, onClose, phColors, onEmployerCreated }) => {
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);

    const [employerData, setEmployerData] = React.useState({
        company_name: '',
        business_type: '',
        industry_sector: '',
        position: '',
        cr_number: '',
        email: '',
        website: '',
        regional_office_address: '',
        poc_name: '',
        poc_contact_number: '',
    });

    const handleInputChange = (field, value) => {
        setEmployerData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ...employerData
            };

            const response = await fetch('http://127.0.0.1:8000/api/employers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            onEmployerCreated(data.employer);
            if (!response.ok) throw new Error(data.message || 'Submission failed');

            setShowSuccessModal(true);

            setEmployerData({
                company_name: '',
                business_type: '',
                industry_sector: '',
                cr_number: '',
                email: '',
                website: '',
                regional_office_address: '',
                poc_name: '',
                poc_contact_number: '',
            });
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    if (!show) return null;

    return (
        <div className="modal-overlay d-flex align-items-center justify-content-center" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 3000, padding: '20px' }}>
            <div className="modern-card bg-white shadow-lg p-0 border-0 overflow-hidden animate-slide-up d-flex flex-column" style={{ width: '850px', maxHeight: '90vh', borderRadius: '20px' }}>
                {/* HEADER */}
                <div className="p-4 d-flex justify-content-between text-white flex-shrink-0" style={{ backgroundColor: phColors.blue }}>
                    <div className="d-flex align-items-center gap-2">
                        <span className="fs-4">🏢</span>
                        <h4 className="m-0 fw-bold">New Employer Registration</h4>
                    </div>
                    <button className="btn text-white p-0 fs-4" onClick={onClose}>&times;</button>
                </div>

                {/* FORM BODY */}
                <div className="p-4 overflow-auto" style={{ backgroundColor: '#f8fbff', flexGrow: 1 }}>
                    <form className="row g-3 bg-white p-4 rounded-4 shadow-sm border">
                        <div className="col-md-6">
                            <label className="small fw-bold text-muted mb-1">Employer/Company Legal Name</label>
                            <input
                                type="text"
                                name="company_name"
                                value={employerData.company_name}
                                onChange={(e) => handleInputChange('company_name', e.target.value)}
                                className="form-control rounded-3 border-light bg-light py-2"
                                placeholder="e.g. Saudi Aramco"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="small fw-bold text-muted mb-1">Business Type</label>
                            <select
                                name="business_type"
                                value={employerData.business_type}
                                onChange={(e) => handleInputChange('business_type', e.target.value)}
                                className="form-select rounded-3 border-light bg-light py-2"
                            >
                                <option value="" disabled>Choose Business Type</option>
                                <option>Private Corporation</option>
                                <option>Government / Semi-Gov</option>
                                <option>Foreign Principal</option>
                                <option>Recruitment Agency Partner</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="small fw-bold text-muted mb-1">Industry Sector</label>
                            <select
                                name="industry_sector"
                                value={employerData.industry_sector}
                                onChange={(e) => handleInputChange('industry_sector', e.target.value)}
                                className="form-select rounded-3 border-light bg-light py-2"
                            >
                                <option value="" disabled>Select Industry Sector</option>
                                <option>Healthcare</option>
                                <option>Construction & Engineering</option>
                                <option>Oil & Gas</option>
                                <option>Hospitality</option>
                                <option>IT & Digital Services</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="small fw-bold text-muted mb-1">Position Offered</label>
                            <select
                                name="position"
                                value={employerData.position}
                                onChange={(e) => handleInputChange('position', e.target.value)}
                                className="form-select rounded-3 border-light bg-light py-2"
                            >
                                <option value="" disabled>Select Position</option>
                                <option>Housekeeping</option>
                                <option>Caregiver</option>
                                <option>Nurse</option>
                                <option>Domestic Helper</option>
                                <option>Construction Worker</option>
                                <option>Welder</option>
                                <option>Driver</option>
                                <option>Hotel Staff</option>
                                <option>Factory Worker</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="small fw-bold text-muted mb-1">CR Number / National ID</label>
                            <input
                                name="cr_number"
                                value={employerData.cr_number}
                                onChange={(e) => handleInputChange('cr_number', e.target.value)}
                                type="text"
                                className="form-control rounded-3 border-light bg-light py-2"
                                placeholder="CR-1010XXXXXX"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="small fw-bold text-muted mb-1">Primary Contact Email</label>
                            <input
                                name="email"
                                value={employerData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                type="email"
                                className="form-control rounded-3 border-light bg-light py-2"
                                placeholder="hr@company.sa"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="small fw-bold text-muted mb-1">Website / LinkedIn Profile</label>
                            <input
                                name="website"
                                value={employerData.website}
                                onChange={(e) => handleInputChange('website', e.target.value)}
                                type="text"
                                className="form-control rounded-3 border-light bg-light py-2"
                                placeholder="https://www.linkedin.com/company/..."
                            />
                        </div>

                        <div className="col-12">
                            <label className="small fw-bold text-muted mb-1">Regional Office Address</label>
                            <textarea
                                name="regional_office_address"
                                value={employerData.regional_office_address}
                                onChange={(e) => handleInputChange('regional_office_address', e.target.value)}
                                className="form-control rounded-3 border-light bg-light"
                                rows="3"
                                placeholder="Building, Street, City, KSA"
                            ></textarea>
                        </div>

                        <div className="col-md-6">
                            <label className="small fw-bold text-muted mb-1">Point of Contact Person</label>
                            <input
                                name="poc_name"
                                value={employerData.poc_name}
                                onChange={(e) => handleInputChange('poc_name', e.target.value)}
                                type="text"
                                className="form-control rounded-3 border-light bg-light py-2"
                                placeholder="Full Name"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="small fw-bold text-muted mb-1">POC Contact Number</label>
                            <input
                                name="poc_contact_number"
                                value={employerData.poc_contact_number}
                                onChange={(e) => handleInputChange('poc_contact_number', e.target.value)}
                                type="text"
                                className="form-control rounded-3 border-light bg-light py-2"
                                placeholder="+966..." />
                        </div>
                    </form>

                    <div className="mt-3 p-3 rounded-3 d-flex align-items-center gap-3" style={{ backgroundColor: '#fff9db', borderLeft: `5px solid ${phColors.gold}` }}>
                        <span className="fs-5">⚠️</span>
                        <div>
                            <small className="fw-bold text-dark d-block">DMW Protocol Alert:</small>
                            <small className="text-muted">Documentary verification of Commercial Registration (CR) is required prior to job order validation.</small>
                        </div>
                    </div>

                </div>

                {/* FOOTER */}
                <div className="p-4 bg-white border-top d-flex justify-content-between align-items-center px-4 flex-shrink-0">
                    <div></div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-link text-muted fw-bold text-decoration-none" onClick={onClose}>Cancel</button>
                        <button
                            className="btn text-white fw-bold px-5 rounded-pill shadow-sm"
                            style={{ backgroundColor: phColors.success }}
                            onClick={handleSubmit}
                        >
                            Submit Registration
                        </button>
                    </div>
                </div>
            </div>

            {showSuccessModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg rounded-4">

                                <div className="modal-body text-center p-5">

                                    <div className="mb-3">
                                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "4rem" }}></i>
                                    </div>

                                    <h4 className="fw-bold text-success">
                                        Employer Registered Successfully!
                                    </h4>

                                    <p className="text-muted mt-2">
                                        The employer profile and job positions have been saved successfully.
                                        You may now manage or assign applicants.
                                    </p>

                                    <div className="d-flex justify-content-center gap-3 mt-4">
                                        <button
                                            className="btn btn-outline-secondary px-4"
                                            onClick={() => setShowSuccessModal(false)}
                                        >
                                            Stay Here
                                        </button>

                                        <button
                                            className="btn btn-primary px-4"
                                            onClick={() => {
                                                setShowSuccessModal(false);
                                                onClose();
                                            }}
                                        >
                                            Close Registration
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    );
};

export default EmployerFormModal;