import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function EmergencyPanel({ onComplaint, onUrgent, onBack, userEmail }) {
    const [codeSent, setCodeSent] = useState(false);
    const [enteredCode, setEnteredCode] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const hasSentCode = useRef(false);

    useEffect(() => {
        const sendCode = async () => {
            if (hasSentCode.current) return;
            hasSentCode.current = true;

            try {
                setLoading(true);
                await axios.post("/api/send-emergency-code", { email: userEmail });
                setCodeSent(true);
            } catch (err) {
                console.error(err);
                alert("Failed to send code. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        sendCode();
    }, [userEmail]);

    const handleVerifyCode = async () => {
        try {
            setLoading(true);
            const res = await axios.post("/api/verify-emergency-code", { email: userEmail, code: enteredCode });
            if (res.data.verified) {
                setIsVerified(true);
                setError("");
            } else {
                setError("Incorrect code. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Verification failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        try {
            setResendLoading(true);
            await axios.post("/api/send-emergency-code", { email: userEmail });
            alert("A new code has been sent to your email.");
        } catch (err) {
            console.error(err);
            alert("Failed to resend code. Please try again.");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="card shadow-lg border-0 p-4" style={{ width: "100%", maxWidth: "420px", borderRadius: "16px" }}>
            <h4 className="fw-bold text-center mb-3">OFW Emergency and Support Services</h4>

            {!isVerified && (
                <>
                    <p className="text-muted text-center mb-2">
                        {codeSent ? "A verification code has been sent to your email. Please enter it to continue." : "Sending code..."}
                    </p>

                    <input
                        type="text"
                        className="form-control mb-2 text-center"
                        placeholder="Enter code"
                        value={enteredCode}
                        onChange={(e) => setEnteredCode(e.target.value)}
                        disabled={!codeSent || loading}
                    />

                    {error && <p className="text-danger text-center">{error}</p>}

                    <button
                        className="btn btn-success w-100 mb-2"
                        onClick={handleVerifyCode}
                        disabled={!codeSent || loading}
                    >
                        {loading ? "Processing..." : "Submit Code"}
                    </button>

                    <p className="text-center mt-2">
                        <span className="text-muted">Didn't receive code? </span>
                        <span
                            className="text-primary"
                            style={{ cursor: resendLoading ? "not-allowed" : "pointer" }}
                            onClick={resendLoading ? null : handleResendCode}
                        >
                            {resendLoading ? "Sending..." : "Resend Code"}
                        </span>
                    </p>
                </>
            )}

            {isVerified && (
                <div className="d-flex flex-column gap-3 mt-3">
                    <button className="btn btn-outline-primary w-100 py-2" onClick={onComplaint}>
                        Complaint
                    </button>
                    <button className="btn btn-danger w-100 py-2" onClick={onUrgent}>
                        Urgent
                    </button>
                </div>
            )}

            <button className="btn btn-link mt-3 text-muted" onClick={onBack}>
                Back
            </button>
        </div>
    );
}
