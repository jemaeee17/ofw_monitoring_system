import React, { useState, useEffect } from "react";
import { Star, MapPin, Edit3, Save } from "lucide-react";
import axios from "axios";

import ofwApi from "../../../services/ofwApi";

const PH_YELLOW = "#FCD116";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("ofw");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        birthdate: "",
        gender: "",
        address: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await ofwApi.get("ofw/profile");

                const data = response.data;

                setProfile(data);

                setForm({
                    name: data.name ?? "",
                    email: data.email ?? "",
                    phone: data.phone ?? "",
                    birthdate: data.birthdate ?? "",
                    gender: data.gender ?? "",
                    address: data.address ?? ""
                });

            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setProfile({});
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEditClick = () => setEditing(true);
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async () => {
        try {

            const response = await ofwApi.put("ofw/profile", form);

            setProfile(response.data.profile);
            setForm(response.data.profile);

            setEditing(false);

            alert("Profile updated successfully!");

        } catch (err) {
            console.error("Failed to save profile:", err);
            alert("Failed to update profile.");
        }
    };

    if (loading) return <div>Loading Profile...</div>;
    if (!profile) return <div>Profile not found.</div>;

    return (
        <div className="animate__animated animate__fadeIn">
            <div className="card p-0 overflow-hidden shadow-sm profile-card">
                <div className="profile-banner"></div>
                <div className="px-4 pb-4">
                    {/* Name & Address */}
                    <div className="d-flex align-items-center justify-content-between mt-3">
                        <div className="d-flex flex-column">
                            <div className="d-flex align-items-center mb-1">
                                <h4 className="fw-bold me-2 mb-0">
                                    {editing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name ?? ""}
                                            onChange={handleChange}
                                            className="form-control form-control-sm"
                                        />
                                    ) : (
                                        profile.name
                                    )}
                                </h4>
                                <Star size={16} fill={PH_YELLOW} color={PH_YELLOW} />
                            </div>

                            {editing ? (
                                <input
                                    type="text"
                                    name="address"
                                    value={form.address ?? ""}
                                    onChange={handleChange}
                                    className="form-control form-control-sm"
                                    placeholder="Enter your address"
                                />
                            ) : (
                                <p className="text-muted mb-0">
                                    <MapPin size={14} className="me-1" />
                                    {profile.address || "Address not provided"}
                                </p>
                            )}
                        </div>

                        {editing ? (
                            <button className="btn btn-success btn-sm btn-pill" onClick={handleSave}>
                                <Save size={16} className="me-1" />
                                Save
                            </button>
                        ) : (
                            <button className="btn btn-outline-primary btn-sm btn-pill" onClick={handleEditClick}>
                                <Edit3 size={16} className="me-1" />
                                Update Info
                            </button>
                        )}
                    </div>

                    <hr className="my-4 opacity-10" />

                    {/* Other Details */}
                    <div className="row g-4 mt-2">
                        {[
                            { label: "Email", name: "email", color: "text-dark" },
                            { label: "Phone", name: "phone", color: "text-success" },
                            { label: "Birthdate", name: "birthdate", color: "text-dark" },
                            { label: "Gender", name: "gender", color: "text-dark" },
                        ].map((item, idx) => (
                            <div className="col-md-3" key={idx}>
                                <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: "10px" }}>
                                    {item.label}
                                </small>
                                {editing ? (
                                    <input
                                        type="text"
                                        name={item.name}
                                        value={form[item.name] ?? ""}
                                        onChange={handleChange}
                                        className="form-control form-control-sm"
                                    />
                                ) : (
                                    <span className={`fw-bold ${item.color}`}>{loading ? "Loading..." : profile[item.name] || "N/A"}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}