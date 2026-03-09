import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Step1PersonalInfo from "./Step1PersonalInfo";
import Step2Schedule from "./Step2Schedule";
import AppointmentFooter from "./AppointmentFooter";

const AppointmentBooking = () => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [step, setStep] = useState(1);
    const phBlue = "#0038a8";
    const phRed = "#ce1126";
    const phYellow = "#fcd116";

    const location = useLocation();
    const user = location.state?.user || JSON.parse(localStorage.getItem("ofw"));

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        contact_person: "",
        phone: "",
        status: "",
        business_type: "",
        schedule_date: "",
        schedule_time: ""
    });

    const handleConfirm = async () => {

        const user = JSON.parse(localStorage.getItem("ofw"));

        if (
            !formData.name ||
            !formData.email ||
            !formData.address ||
            !formData.city ||
            !formData.contact_person ||
            !formData.phone ||
            !formData.status ||
            !formData.business_type ||
            !formData.schedule_date ||
            !formData.schedule_time
        ) {
            alert("Please fill all required fields!");
            return;
        }
        try {
            const res = await axios.post("/api/appointments", {
                ofw_id: user.id,
                name: formData.name,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                contact_person: formData.contact_person,
                phone: formData.phone,
                status: formData.status,
                business_type: formData.business_type,
                schedule_date: formData.schedule_date,
                schedule_time: formData.schedule_time
            });

            setShowSuccessModal(true);

        } catch (error) {
            console.error(error);
            alert("Failed to book appointment. Please try again.");
        }
    };

    return (
        <div className="min-vh-100 py-5" style={{ backgroundColor: '#f4f7f6' }}>
            <div className="container">
                <div className="card shadow-lg border-0 mx-auto" style={{ maxWidth: '950px', borderRadius: '20px' }}>

                    {/* TOP DECORATIVE BAR */}
                    <div className="d-flex" style={{ height: '8px' }}>
                        <div className="flex-grow-1" style={{ backgroundColor: phBlue }}></div>
                        <div style={{ width: '20%', backgroundColor: phYellow }}></div>
                        <div className="flex-grow-1" style={{ backgroundColor: phRed }}></div>
                    </div>

                    {/* HEADER */}
                    <div className="p-4 bg-white d-flex justify-content-between align-items-center border-bottom">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-2 rounded-3 shadow-sm" style={{ backgroundColor: phBlue }}>
                                <span className="text-white fw-bold">PH</span>
                            </div>
                            <div>
                                <h4 className="fw-bold mb-0" style={{ color: phBlue }}>KalingaGate</h4>
                                <small className="text-muted fw-bold">OFW APPOINTMENT SYSTEM</small>
                            </div>
                        </div>
                        <div className="text-end">
                            <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: phYellow, color: '#000' }}>
                                Step {step} of 2
                            </span>
                        </div>
                    </div>

                    <div className="card-body p-4 p-md-5">
                        {step === 1 ? (

                            <Step1PersonalInfo
                                phBlue={phBlue}
                                phRed={phRed}
                                phYellow={phYellow}
                                formData={formData}
                                setFormData={setFormData}
                            />

                        ) : (

                            <Step2Schedule
                                phBlue={phBlue}
                                formData={formData}
                                setFormData={setFormData}
                            />

                        )}
                    </div>

                    <AppointmentFooter
                        step={step}
                        setStep={setStep}
                        phBlue={phBlue}
                        phRed={phRed}
                        onConfirm={handleConfirm}
                    />

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
                                        Appointment Successful!
                                    </h4>

                                    <p className="text-muted mt-2">
                                        Your appointment has been successfully booked.
                                        Please check your account for more details.
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
                                            onClick={() => navigate("/ofw", { state: { activePage: "dashboard" } })}
                                        >
                                            Go to Dashboard
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

export default AppointmentBooking;