import React, { useState } from 'react';

const ApplicationFormModal = ({ showForm, closeAndReset, onApplicationSaved }) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formStep, setFormStep] = useState(1);

    const initialFormData = {
        ref_code: 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        position: '',
        full_name: '',
        address: '',
        birthdate: '',
        place_of_birth: '',
        contact_number: '',
        email: '',
        gender: '',
        religion: '',
        passport_number: '',
        passport_issue_place: '',
        passport_expiry: '',
        college: '',
        highschool: '',
        vocational: '',
        civil_status: '',
        height: '',
        weight: '',
        deployment_date: '',
        application_date: new Date().toISOString().split('T')[0],
        notes: '',
        languages: '',
        work_history: '',
        skills: '',
        objective: '',
        photo: null
    }

    const [formData, setFormData] = useState(initialFormData);

    const generateNewCode = () => {
        const newCode = 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        setFormData(prev => ({ ...prev, ref_code: newCode }));
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            setFormData({
                ...formData,
                [name]: files[0]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                submitData.append(key, value);
            }
        });

        const token = localStorage.getItem("token");

        try {
            const response = await fetch('http://127.0.0.1:8000/api/applications', {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: submitData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Submission failed');
            }

            await response.json();

            if (onApplicationSaved) {
                onApplicationSaved();
            }

            setShowSuccessModal(true);

            setFormData({
                ...initialFormData,
                ref_code: 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            });
            setFormStep(1);

        } catch (error) {
            console.error(error);
            setErrorMessage('Failed to save application. Please try again.');
        }
    };

    if (!showForm) return null;

    return (
        <div className="modal-overlay-ph">
            <div className="application-modal animate-slide-up">
                {/* --- HEADER --- */}
                <div className="modal-header-container d-flex justify-content-between align-items-center p-3 border-bottom bg-white sticky-top rounded-top">
                    <div className="d-flex align-items-center gap-3">
                        <div
                            className="ph-logo-circle bg-dark text-white d-flex align-items-center justify-content-center"
                            style={{ width: '45px', height: '45px', borderRadius: '12px' }}
                        >
                            <span style={{ fontSize: '24px' }}>🦅</span>
                        </div>
                        <div>
                            <h5 className="m-0 fw-bold text-dark letter-spacing-1">
                                KALINGAGATE <span className="text-primary">KSA</span>
                            </h5>
                            <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '10px' }}>
                                Overseas Recruitment Portal
                            </small>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-secondary px-3" onClick={() => window.print()}>
                            Print Form
                        </button>
                        <button className="btn btn-sm btn-light border fw-bold px-3" onClick={closeAndReset}>
                            ✕ Close
                        </button>
                    </div>
                </div>

                {/* --- FORM HEADER --- */}
                <div className="px-4 py-3 bg-light border-bottom">
                    <h2 className="fw-bold text-dark mb-1">Application Form</h2>
                    <p className="text-muted small m-0">
                        Complete the profile below to proceed with the recruitment process. (Step {formStep} of 2)
                    </p>
                </div>

                <div className="modal-body-ph p-4 scroll-form">
                    <form onSubmit={handleSubmit} className="row g-0 application-container-box shadow-sm border rounded bg-white">
                        <div className="col-12">
                            <div className="form-section-header-red py-2 px-4 text-white fw-bold">
                                <span className="me-2">📋</span> {formStep === 1 ? 'ACCOUNT INFORMATION' : 'SKILLS & EXPERIENCE'}
                            </div>
                        </div>

                        <div className="p-4 row g-3">
                            {formStep === 1 ? (
                                <>
                                    {/* LEFT COLUMN */}
                                    <div className="col-md-4 border-end pe-4">
                                        <label className="form-label-ph">Position Selected</label>
                                        <select
                                            className="form-select-ph w-100 mb-3"
                                            name="position"
                                            value={formData.position}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled>Choose position...</option>
                                            <option>General Labor</option>
                                            <option>Skilled Technician</option>
                                            <option>Domestic Worker</option>
                                            <option>Healthcare Staff</option>
                                        </select>

                                        <div className="d-flex align-items-end gap-2 mb-3">
                                            <div className="flex-grow-1">
                                                <label className="form-label-ph">System Reference Code</label>
                                                <input
                                                    type="text"
                                                    name="ref_code"
                                                    className="form-control-ph bg-light fw-bold text-primary"
                                                    value={formData.ref_code}
                                                    readOnly
                                                />
                                            </div>
                                            <button type="button" className="btn btn-gold-ph btn-sm px-3 py-2" onClick={generateNewCode}>Generate</button>
                                        </div>

                                        <label className="form-label-ph">Full Name</label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            className="form-control-ph mb-3"
                                            placeholder="First Middle Last"
                                        />

                                        <label className="form-label-ph">Permanent Address</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="form-control-ph mb-3"
                                            rows="2"
                                            placeholder="Street, City, Province, Zip"
                                        ></textarea>

                                        <label className="form-label-ph">Date of Birth</label>
                                        <input
                                            type="date"
                                            name="birthdate"
                                            value={formData.birthdate}
                                            onChange={handleChange}
                                            className="form-control-ph mb-3"
                                        />

                                        <label className="form-label-ph">Place of Birth</label>
                                        <input
                                            type="text"
                                            name="place_of_birth"
                                            value={formData.place_of_birth}
                                            onChange={handleChange}
                                            className="form-control-ph mb-3"
                                            placeholder="City or Province"
                                        />

                                        <label className="form-label-ph">Contact Number</label>
                                        <input
                                            type="tel"
                                            name="contact_number"
                                            value={formData.contact_number}
                                            onChange={handleChange}
                                            className="form-control-ph mb-3"
                                            placeholder="09XX XXX XXXX"
                                        />

                                        <label className="form-label-ph">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="form-control-ph mb-3"
                                            placeholder="example@email.com"
                                        />

                                        <div className="row g-2">
                                            <div className="col-6">
                                                <label className="form-label-ph">Gender</label>
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                    className="form-select-ph w-100"
                                                >
                                                    <option value="" disabled>Select Gender</option>
                                                    <option>Male</option>
                                                    <option>Female</option>
                                                </select>
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label-ph">Religion</label>
                                                <select
                                                    name="religion"
                                                    value={formData.religion}
                                                    onChange={handleChange}
                                                    className="form-select-ph w-100"
                                                >
                                                    <option value="" disabled>Select Religion</option>
                                                    <option>Catholic</option>
                                                    <option>Islam</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* MIDDLE COLUMN */}
                                    <div className="col-md-4 border-end px-4">
                                        <label className="form-label-ph">Passport Number</label>
                                        <input
                                            type="text"
                                            name="passport_number"
                                            value={formData.passport_number}
                                            onChange={handleChange}
                                            className="form-control-ph mb-3"
                                            placeholder="P0000000A"
                                        />

                                        <label className="form-label-ph">Place of Issue</label>
                                        <input
                                            type="text"
                                            name="passport_issue_place"
                                            value={formData.passport_issue_place}
                                            onChange={handleChange}
                                            className="form-control-ph mb-3"
                                            placeholder="DFA Office Location"
                                        />

                                        <label className="form-label-ph">Date of Expiry</label>
                                        <input
                                            type="date"
                                            name="passport_expiry"
                                            value={formData.passport_expiry}
                                            onChange={handleChange}
                                            className="form-control-ph mb-3"
                                        />

                                        <label className="form-label-ph">College / University</label>
                                        <input
                                            type="text"
                                            name="college"
                                            value={formData.college}
                                            onChange={handleChange}
                                            className="form-control-ph mb-3"
                                            placeholder="Name of Institution"
                                        />

                                        <label className="form-label-ph">High School</label>
                                        <input
                                            type="text"
                                            name="highschool"
                                            value={formData.highschool}
                                            onChange={handleChange}
                                            className="form-control-ph mb-3"
                                            placeholder="Name of Institution"
                                        />

                                        <label className="form-label-ph">Vocational / TESDA</label>
                                        <input
                                            type="text"
                                            name="vocational"
                                            value={formData.vocational}
                                            onChange={handleChange}
                                            className="form-control-ph mb-3"
                                            placeholder="Course Title"
                                        />

                                        <div className="mb-3">
                                            <label className="form-label-ph">Civil Status</label>
                                            <select
                                                name="civil_status"
                                                value={formData.civil_status}
                                                onChange={handleChange}
                                                className="form-select-ph w-100"
                                            >
                                                <option value="" disabled>Select Civil Status</option>
                                                <option>Single</option>
                                                <option>Married</option>
                                                <option>Widowed</option>
                                                <option>Separated</option>
                                            </select>
                                        </div>

                                        <div className="row g-2">
                                            <div className="col-6">
                                                <label className="form-label-ph">Height (cm)</label>
                                                <input
                                                    type="number"
                                                    name="height"
                                                    value={formData.height}
                                                    onChange={handleChange}
                                                    className="form-control-ph"
                                                    placeholder="170"
                                                />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label-ph">Weight (kg)</label>
                                                <input
                                                    type="number"
                                                    name="weight"
                                                    value={formData.weight}
                                                    onChange={handleChange}
                                                    className="form-control-ph"
                                                    placeholder="65"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT COLUMN */}
                                    <div className="col-md-4 ps-4 d-flex flex-column">
                                        <label className="form-label-ph">Expected Deployment Date</label>
                                        <input
                                            type="date"
                                            name="deployment_date"
                                            value={formData.deployment_date}
                                            onChange={handleChange}
                                            className="form-control-ph mb-3"
                                        />

                                        <label className="form-label-ph">Application Date</label>
                                        <input
                                            type="date"
                                            name="application_date"
                                            value={formData.application_date}
                                            onChange={handleChange}
                                            className="form-control-ph mb-3"
                                        />

                                        <label className="form-label-ph">Initial Career Notes</label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            className="form-control-ph w-100 mb-4 flex-grow-1"
                                            placeholder="General observations..."
                                            style={{ resize: 'none', minHeight: '200px' }}
                                        ></textarea>

                                        <div className="mt-auto d-flex justify-content-end gap-2 pb-2 pt-3 border-top">
                                            <button type="button" className="btn btn-outline-secondary px-4 py-2" onClick={closeAndReset}>Cancel</button>
                                            <button type="button" className="btn btn-primary px-5 py-2 fw-bold shadow-sm" onClick={() => setFormStep(2)}>
                                                NEXT STEP →
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (

                                <>
                                    {/* PAGE 2 */}
                                    <div className="col-md-4 border-end pe-4">
                                        <label className="form-label-ph">Applicant Face Photo</label>
                                        <div className="photo-upload-placeholder border rounded p-4 text-center bg-light mb-3">
                                            <div style={{ fontSize: '40px' }}>📸</div>
                                            <input
                                                type="file"
                                                name="photo"
                                                onChange={handleChange}
                                                className="form-control form-control-sm mt-2"
                                            />
                                            <small className="text-muted d-block mt-1">Upload JPG or PNG (Max 2MB)</small>
                                        </div>
                                        <label className="form-label-ph">Languages Spoken</label>
                                        <textarea
                                            name="languages"
                                            value={formData.languages}
                                            onChange={handleChange}
                                            className="form-control-ph mb-3"
                                            rows="3"
                                            placeholder="e.g. English, Arabic, Tagalog"
                                        ></textarea>
                                    </div>

                                    <div className="col-md-4 border-end px-4">
                                        <label className="form-label-ph">Detailed Work History</label>
                                        <textarea
                                            name="work_history"
                                            value={formData.work_history}
                                            onChange={handleChange}
                                            className="form-control-ph mb-3"
                                            rows="10" placeholder="Year | Company | Position | Country"
                                        ></textarea>
                                        <label className="form-label-ph">Specialized Skills</label>
                                        <input
                                            type="text"
                                            name="skills"
                                            value={formData.skills}
                                            onChange={handleChange}
                                            className="form-control-ph"
                                            placeholder="Driving, Cooking, Medical, etc."
                                        />
                                    </div>

                                    <div className="col-md-4 ps-4 d-flex flex-column">
                                        <label className="form-label-ph">Formal Objective</label>
                                        <textarea
                                            name="objective"
                                            value={formData.objective}
                                            onChange={handleChange}
                                            className="form-control-ph w-100 mb-4 flex-grow-1"
                                            placeholder="Describe the applicant's professional goals..."
                                            style={{ resize: 'none', minHeight: '200px' }}
                                        ></textarea>

                                        <div className="mt-auto d-flex justify-content-end gap-2 pb-2 pt-3 border-top">
                                            <button type="button" className="btn btn-outline-secondary px-4 py-2" onClick={() => setFormStep(1)}>Back</button>
                                            <button type="submit" className="btn btn-success px-5 py-2 fw-bold text-white shadow-sm border-0">
                                                SAVE APPLICATION
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div >

            {showSuccessModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1060 }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg rounded-4">
                                <div className="modal-body text-center p-5">

                                    <div
                                        className="mx-auto mb-4 d-flex align-items-center justify-content-center bg-success text-white"
                                        style={{
                                            width: '70px',
                                            height: '70px',
                                            borderRadius: '50%',
                                            fontSize: '32px'
                                        }}
                                    >
                                        ✓
                                    </div>

                                    <h4 className="fw-bold text-success mb-2">
                                        Application Submitted!
                                    </h4>

                                    <p className="text-muted mb-4">
                                        Your application has been saved successfully.
                                        Our recruitment team will review your profile shortly.
                                    </p>

                                    <div className="alert alert-light border fw-bold text-primary mb-4">
                                        Reference Code: {formData.ref_code}
                                    </div>

                                    <div className="d-flex justify-content-center gap-3">
                                        <button
                                            className="btn btn-outline-secondary px-4"
                                            onClick={() => setShowSuccessModal(false)}
                                        >
                                            Close
                                        </button>

                                        <button
                                            className="btn btn-primary px-4 fw-bold"
                                            onClick={() => {
                                                setShowSuccessModal(false);
                                                closeAndReset();
                                            }}
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
                </>
            )}
        </div >
    );
};

export default ApplicationFormModal;