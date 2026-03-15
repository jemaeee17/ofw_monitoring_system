import React, { useState, useEffect } from "react";
import ofwApi from "../../../services/ofwApi";

export default function ComplaintForm({ onBack }) {
    const [coHosts, setCoHosts] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        ofwApi.get("public/co-hosts")
            .then(res => {
                setCoHosts(res.data);
            })
            .catch(err => console.error(err));
    }, []);

    const ofw = JSON.parse(localStorage.getItem("ofw"));

    const [form, setForm] = useState({
        co_host_id: "",
        ofw_name: ofw?.name || "",
        gender: ofw?.gender || "",
        birthdate: ofw?.birthdate || "",
        occupation: ofw?.occupation || "",
        national_id: ofw?.national_id || "",
        passport_no: ofw?.passport_no || "",
        email: ofw?.email || "",
        contact_person: "",
        primary_contact: ofw?.contact || "",
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

        const ofw = JSON.parse(localStorage.getItem("ofw"));

        formData.append("ofw_id", ofw.id);
        formData.append("co_host_id", form.co_host_id);

        formData.append("ofw_name", form.ofw_name);
        formData.append("gender", form.gender);
        formData.append("birthdate", form.birthdate);
        formData.append("occupation", form.occupation);
        formData.append("national_id", form.national_id);
        formData.append("passport_no", form.passport_no);
        formData.append("email", form.email);
        formData.append("contact_person", form.contact_person);
        formData.append("primary_contact", form.primary_contact);
        formData.append("secondary_contact", form.secondary_contact);
        formData.append("address_abroad", form.address_abroad);
        formData.append("complaint", form.complaint);

        if (image1) formData.append("image1", image1);
        if (image2) formData.append("image2", image2);
        if (image3) formData.append("image3", image3);

        try {

            await ofwApi.post("complaints", formData);

            setForm({
                co_host_id: "",
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

            setShowSuccessModal(true);

        } catch (error) {
            console.error("Complaint error:", error.response?.data);
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
                            name="co_host_id"
                            value={form.co_host_id}
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
                <>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg rounded-4">

                                <div className="modal-body text-center p-5">

                                    <div className="mb-3">
                                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "4rem" }}></i>
                                    </div>

                                    <h4 className="fw-bold text-success">
                                        Complaint Submitted!
                                    </h4>

                                    <p className="text-muted mt-2">
                                        Your complaint has been successfully submitted. Our agency will review it shortly.
                                    </p>

                                    <div className="d-flex justify-content-center gap-3 mt-4">
                                        <button
                                            className="btn btn-success px-4"
                                            onClick={() => {
                                                setShowSuccessModal(false);
                                            }}
                                        >
                                            OK
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
}