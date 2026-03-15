import React, { useEffect, useRef } from "react";
import ofwApi from "../../../services/ofwApi";

export default function UrgentPage({ userLocation, locationError, isLocating, onBack, user, selectedAgency }) {
    const hasSent = useRef(false);

    useEffect(() => {

        if (!userLocation || !user || hasSent.current) return;

        const sendUrgentComplaint = async () => {
            try {
                const payload = {
                    ofw_id: user.id,
                    ofw_name: user.name,
                    latitude: userLocation.lat,
                    longitude: userLocation.lng,
                    city: userLocation.city,
                    address: userLocation.address
                };

                console.log("Sending urgent complaint:", payload);

                await ofwApi.post("complaints/urgent", payload);

                alert("Your urgent complaint has been sent to Super Admin!");

                hasSent.current = true;

            } catch (err) {
                console.error(err.response || err);
                alert("Failed to send urgent complaint.");
            }
        };

        sendUrgentComplaint();

    }, [userLocation, user]);

    const handleCopyLocation = () => {
        if (!userLocation) return;
        const text = `Latitude: ${userLocation.lat}
Longitude: ${userLocation.lng}
${userLocation.city ? `City: ${userLocation.city}\n` : ""}${userLocation.address ? `Address: ${userLocation.address}` : ""}`;

        navigator.clipboard.writeText(text)
            .then(() => alert("Location copied to clipboard!"))
            .catch(() => alert("Failed to copy location."));
    };

    return (
        <div className="p-4">
            <h4 className="fw-bold mb-4 text-danger">Emergency Location</h4>

            {isLocating && (
                <div className="text-center mt-5">
                    <div className="spinner-border text-danger mb-3" />
                    <div className="fw-semibold">Please wait… we are tracking your location</div>
                </div>
            )}

            {userLocation && (
                <div className="card p-3 shadow-sm border-0">
                    <h6 className="fw-bold mb-3">📍 Your Exact Location</h6>
                    <div style={{ height: "350px" }}>
                        <iframe
                            title="User Location"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}&z=17&output=embed`}
                        />
                    </div>
                    <div className="mt-3 small">
                        <div><strong>Latitude:</strong> {userLocation.lat}</div>
                        <div><strong>Longitude:</strong> {userLocation.lng}</div>
                        {userLocation.city && <div><strong>City:</strong> {userLocation.city}</div>}
                        {userLocation.address && <div><strong>Address:</strong> {userLocation.address}</div>}
                    </div>
                    <button
                        className="btn btn-outline-primary w-100 mt-3"
                        onClick={handleCopyLocation}
                    >
                        Copy Location
                    </button>
                </div>
            )}

            {locationError && <div className="alert alert-danger mt-3">{locationError}</div>}

            <button className="btn btn-link mt-4" onClick={onBack}>← Back to Rescue Report</button>
        </div>
    );
}