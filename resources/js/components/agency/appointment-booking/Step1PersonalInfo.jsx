import { useState, useEffect } from "react";
import axios from "axios";

const Step1PersonalInfo = ({ formData, setFormData, phBlue, phRed, phYellow }) => {
    const [agencies, setAgencies] = useState([]);

    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                const res = await axios.get("/api/public/agencies");
                setAgencies(res.data);
            } catch (err) {
                console.error("Failed to fetch agencies:", err);
            }
        };

        fetchAgencies();
    }, []);

    return (
        <div className="row g-3 animate-fade-in">
            <div className="col-12 mb-2">
                <h5 className="fw-bold" style={{ color: phBlue }}>Step 1: Personal & Agency Information</h5>
                <div style={{ height: '3px', width: '60px', backgroundColor: phRed }}></div>
            </div>

            <div className="col-md-6">
                <label className="form-label small fw-bold text-secondary">Select Agency</label>
                <select
                    className="form-select border-0 bg-light py-2"
                    value={formData.agency_id || ""}
                    onChange={(e) => setFormData({ ...formData, agency_id: e.target.value })}
                >
                    <option value="" disabled>
                        Select Agency
                    </option>
                    {agencies.map((agency) => (
                        <option key={agency.id} value={agency.id}>
                            {agency.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="col-md-6">
                <label className="form-label small fw-bold text-secondary">Full Name</label>
                <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-control border-0 bg-light py-2"
                    placeholder="Juan Dela Cruz"
                />
            </div>
            <div className="col-md-6">
                <label className="form-label small fw-bold text-secondary">Email Address</label>
                <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-control border-0 bg-light py-2"
                    placeholder="juan@example.com"
                />
            </div>

            <div className="col-md-6">
                <label className="form-label small fw-bold text-secondary">Address</label>
                <input
                    type="text"
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="form-control border-0 bg-light py-2"
                    placeholder="House/Bldg No, Street"
                />
            </div>

            <div className="col-md-4">
                <label className="form-label small fw-bold text-secondary">City</label>
                <input
                    type="text"
                    value={formData.city || ""}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="form-control border-0 bg-light py-2"
                    placeholder="City Name"
                />
            </div>

            <div className="col-md-4">
                <label className="form-label small fw-bold text-secondary">Contact Person</label>
                <input
                    type="text"
                    value={formData.contact_person || ""}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="form-control border-0 bg-light py-2"
                    placeholder="Emergency Contact"
                />
            </div>

            <div className="col-md-4">
                <label className="form-label small fw-bold text-secondary">Phone Number</label>
                <input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-control border-0 bg-light py-2"
                    placeholder="0917XXXXXXX"
                />
            </div>

            <div className="col-md-4">
                <label className="form-label small fw-bold text-secondary">Status</label>
                <select
                    className="form-select border-0 bg-light py-2"
                    value={formData.status || ""}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                    <option value="" disabled>Select Status</option>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Widowed</option>
                </select>
            </div>

            <div className="col-md-4">
                <label className="form-label small fw-bold text-secondary">Business Type</label>
                <select
                    className="form-select border-0 bg-light py-2"
                    value={formData.business_type || ""}
                    onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                >
                    <option value="" disabled>Select Type</option>
                    <option>Land-based</option>
                    <option>Sea-based</option>
                    <option>Direct Hire</option>
                </select>
            </div>
        </div>
    );
};

export default Step1PersonalInfo;