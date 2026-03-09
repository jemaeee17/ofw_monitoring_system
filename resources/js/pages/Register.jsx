import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "ofw",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post("/api/register", form);
            const newUser = res.data.user;
            localStorage.setItem("ofw", JSON.stringify(newUser));
            setShowModal(true);
        } catch (error) {
            console.error(error.response.data);
            alert("Registration Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow p-4" style={{ width: "450px" }}>
                <h3 className="fw-bold text-center mb-3">Create OFW Account</h3>
                <div className="alert alert-info text-center small py-2">
                    You are being redirected here because you must create an account before booking an appointment.
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Please enter your full name"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Confirm Password</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            className="form-control"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <input type="hidden" name="role" value="ofw" />

                    <button
                        className="btn btn-primary w-100 fw-bold d-flex justify-content-center align-items-center gap-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm"></span>
                                Creating Account...
                            </>
                        ) : (
                            "Create OFW Account"
                        )}
                    </button>
                </form>
            </div>

            {showModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg rounded-4">

                                <div className="modal-body text-center p-5">

                                    <div className="mb-3">
                                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "4rem" }}></i>
                                    </div>

                                    <h4 className="fw-bold text-success">
                                        Registration Successful!
                                    </h4>

                                    <p className="text-muted mt-2">
                                        Your OFW account has been created successfully.
                                        You may now proceed to book your appointment.
                                    </p>

                                    <div className="d-flex justify-content-center gap-3 mt-4">
                                        <button
                                            className="btn btn-outline-secondary px-4"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Stay Here
                                        </button>

                                        <button
                                            className="btn btn-primary px-4"
                                            onClick={() => {
                                                const newUser = JSON.parse(localStorage.getItem("ofw"));
                                                navigate("/appointment", { state: { user: newUser } });
                                            }}
                                        >
                                            Proceed to Booking
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