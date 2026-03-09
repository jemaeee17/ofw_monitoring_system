import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ComplaintForm({ onBack }) {
    const [coHosts, setCoHosts] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/co-hosts")
            .then(res => setCoHosts(res.data))
            .catch(err => console.error(err));
    }, []);

    const [form, setForm] = useState({
        agency: "",
        ofw_name: "",
        gender: "",
        birthdate: "",
        occupation: "",
        national_id: "",
        passport_no: "",
        email: "",
        contact_person: "",
        primary_contact: "",
        secondary_contact: "",
        address_abroad: "",
        complaint: "",
    });

    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const submitComplaint = async () => {

        const formData = new FormData();

        Object.keys(form).forEach(key => {
            formData.append(key, form[key]);
        });

        if (image1) formData.append("image1", image1);
        if (image2) formData.append("image2", image2);
        if (image3) formData.append("image3", image3);

        try {
            await axios.post("http://127.0.0.1:8000/api/complaints", formData);

            setShowSuccessModal(true);

            setForm({
                agency: "",
                ofw_name: "",
                gender: "",
                birthdate: "",
                occupation: "",
                national_id: "",
                passport_no: "",
                email: "",
                contact_person: "",
                primary_contact: "",
                secondary_contact: "",
                address_abroad: "",
                complaint: "",
            });
            setImage1(null);
            setImage2(null);
            setImage3(null);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-4">
            <h4 className="fw-bold mb-4">Complaint Form</h4>

            {/* General Info */}
            <div className="card p-4 mb-4 shadow-sm border-0">
                <h6 className="fw-bold mb-4">General Information</h6>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Foreign Recruitment Agency</label>
                        <select
                            className="form-select"
                            name="agency"
                            value={form.agency}
                            onChange={handleChange}
                        >
                            <option value="">Select Agency</option>
                            {coHosts.map(coHost => (
                                <option key={coHost.id} value={coHost.id}>
                                    {coHost.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">OFW's Full Name</label>
                        <input
                            type="text"
                            name="ofw_name"
                            value={form.ofw_name}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Gender</label>
                        <select
                            name="gender"
                            className="form-select"
                            value={form.gender}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Birthdate</label>
                        <input
                            type="date"
                            name="birthdate"
                            value={form.birthdate}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Occupation</label>
                        <input
                            type="text"
                            name="occupation"
                            value={form.occupation}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">National / IQAMA ID</label>
                        <input
                            type="text"
                            name="national_id"
                            value={form.national_id}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Passport No.</label>
                        <input
                            type="text"
                            name="passport_no"
                            value={form.passport_no}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="card p-4 mb-4 shadow-sm border-0">
                <h6 className="fw-bold mb-4">Contact Information</h6>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">E-mail</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Contact Person</label>
                        <input
                            type="text"
                            name="contact_person"
                            value={form.contact_person}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Primary Contact</label>
                        <input
                            type="text"
                            name="primary_contact"
                            value={form.primary_contact}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Secondary Contact</label>
                        <input
                            type="text"
                            name="secondary_contact"
                            value={form.secondary_contact}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-12">
                        <label className="form-label">Address Abroad</label>
                        <textarea
                            className="form-control"
                            name="address_abroad"
                            value={form.address_abroad}
                            onChange={handleChange}
                            rows="2"
                        />
                    </div>
                </div>
            </div>

            {/* Image Evidences */}
            <div className="card p-4 mb-4 shadow-sm border-0">
                <h6 className="fw-bold mb-4">Image Evidences</h6>
                <div className="row g-3">
                    {[1, 2, 3].map(i => (
                        <div className="col-md-4" key={i}>
                            <label className="form-label">Image {i}</label>
                            <input
                                name={`image${i}`}
                                onChange={e => {
                                    const file = e.target.files[0];
                                    if (i === 1) setImage1(file);
                                    else if (i === 2) setImage2(file);
                                    else if (i === 3) setImage3(file);
                                }}
                                type="file"
                                className="form-control"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Complaint Section */}
            <div className="card p-4 shadow-sm border-0">
                <h6 className="fw-bold mb-4">Complaint Section</h6>
                <label className="form-label">Complaint</label>
                <textarea
                    name="complaint"
                    value={form.complaint}
                    onChange={handleChange}
                    className="form-control mb-4"
                    rows="5"
                    placeholder="Describe your complaint in detail..."
                />
                <button
                    className="btn btn-primary btn-lg w-100" onClick={submitComplaint}>
                    Submit Complaint
                </button>

                <button className="btn btn-link w-100 mt-3" onClick={onBack}>
                    ← Back to Rescue Report
                </button>
            </div>

            {showSuccessModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">Success!</h5>
                                <button type="button" className="btn-close" onClick={() => setShowSuccessModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Your complaint has been submitted successfully.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success" onClick={() => setShowSuccessModal(false)}>OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}