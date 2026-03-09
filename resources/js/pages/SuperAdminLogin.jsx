import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SuperAdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            // Update API endpoint for SuperAdmin login
            const response = await axios.post(
                'http://127.0.0.1:8000/api/admin/login',
                { email, password }
            );

            // Store SuperAdmin user in localStorage
            localStorage.setItem('superadmin', JSON.stringify(response.data.user));
            setShowSuccessModal(true);

        } catch (err) {
            setErrorMessage(
                err.response?.data?.message || 'Invalid email or password.'
            );
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <form
                onSubmit={handleLogin}
                className="p-5 rounded shadow bg-white"
                style={{ minWidth: '350px' }}
            >
                <h2 className="mb-4 text-center">SuperAdmin Login</h2>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-pill fw-bold"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Signing In...
                        </>
                    ) : 'Login'}
                </button>
            </form>

            {/* Success Modal */}
            {showSuccessModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg rounded-4">
                                <div className="modal-body text-center p-5">
                                    <div className="mb-3">
                                        <i
                                            className="bi bi-check-circle-fill text-success"
                                            style={{ fontSize: "4rem" }}
                                        ></i>
                                    </div>

                                    <h4 className="fw-bold text-success">
                                        Login Successful!
                                    </h4>

                                    <p className="text-muted mt-2">
                                        Welcome back! You can now proceed to the SuperAdmin Dashboard.
                                    </p>

                                    <div className="d-flex justify-content-center gap-3 mt-4">
                                        <button
                                            className="btn btn-primary px-4"
                                            onClick={() => navigate('/superadmin')}
                                        >
                                            Proceed to Dashboard
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-backdrop fade show"></div>
                </>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg rounded-4">
                                <div className="modal-body text-center p-5">
                                    <div className="mb-3">
                                        <i
                                            className="bi bi-x-circle-fill text-danger"
                                            style={{ fontSize: "4rem" }}
                                        ></i>
                                    </div>

                                    <h4 className="fw-bold text-danger">Login Failed</h4>
                                    <p className="text-muted mt-2">{errorMessage}</p>

                                    <div className="d-flex justify-content-center gap-3 mt-4">
                                        <button
                                            className="btn btn-secondary px-4"
                                            onClick={() => setShowErrorModal(false)}
                                        >
                                            Close
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