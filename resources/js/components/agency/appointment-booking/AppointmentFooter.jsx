import React from "react";

const AppointmentFooter = ({ step, setStep, phBlue, phRed, onConfirm }) => {
    return (
        <div className="p-4 bg-light border-top d-flex justify-content-between">
            <button
                className="btn fw-bold px-4"
                style={{ color: phBlue }}
                onClick={() => setStep(1)}
                disabled={step === 1}
            >
                {step === 2 ? "← Back" : ""}
            </button>

            {step === 1 ? (
                <button
                    className="btn btn-lg px-5 shadow text-white"
                    style={{ backgroundColor: phBlue, borderRadius: '10px' }}
                    onClick={() => setStep(2)}
                >
                    Next Step
                </button>
            ) : (
                <button
                    className="btn btn-lg px-5 shadow text-white"
                    style={{ backgroundColor: phRed, borderRadius: '10px' }}
                    onClick={onConfirm}
                >
                    Confirm Appointment
                </button>
            )}
        </div>
    );
};

export default AppointmentFooter;