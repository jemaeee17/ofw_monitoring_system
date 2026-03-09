import React, { useState, useRef } from "react";
import EmergencyButton from "./EmergencyButton";
import EmergencyPanel from "./EmergencyPanel";
import ComplaintForm from "./ComplaintForm";
import UrgentPage from "./UrgentPage";
import axios from "axios";

export default function RescuePage({ setActivePage }) {
    const [currentStep, setCurrentStep] = useState("initial");
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState("");
    const [isLocating, setIsLocating] = useState(false);
    const watchIdRef = useRef(null);

    const user = JSON.parse(localStorage.getItem("ofw"));

    const startTracking = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser.");
            return;
        }

        setIsLocating(true);

        watchIdRef.current = navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await axios.get(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );

                    const data = response.data;

                    const city =
                        data.address?.city ||
                        data.address?.town ||
                        data.address?.village ||
                        "";

                    const address = data.display_name || "";

                    setUserLocation({
                        lat: latitude,
                        lng: longitude,
                        city,
                        address,
                    });

                    setLocationError("");
                } catch (err) {
                    console.error(err);
                    setLocationError("Failed to get address from coordinates.");
                    setUserLocation({ lat: latitude, lng: longitude });
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                console.error(error);
                setLocationError("Unable to retrieve your location.");
                setIsLocating(false);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
        );
    };

    const stopTracking = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    };

    return (
        <div
            className="p-4 d-flex justify-content-center align-items-center"
            style={{ minHeight: "70vh", borderRadius: "16px" }}
        >
            {currentStep === "initial" && (
                <EmergencyButton onClick={() => setCurrentStep("panel")} />
            )}

            {currentStep === "panel" && (
                <EmergencyPanel
                    onComplaint={() => setCurrentStep("complaint")}
                    onUrgent={() => {
                        setCurrentStep("urgent");
                        startTracking();
                    }}
                    onBack={() => setCurrentStep("initial")}
                    userEmail={user.email}
                />
            )}

            {currentStep === "complaint" && (
                <ComplaintForm onBack={() => setCurrentStep("panel")} />
            )}

            {currentStep === "urgent" && (
                <UrgentPage
                    userLocation={userLocation}
                    locationError={locationError}
                    isLocating={isLocating}
                    stopTracking={stopTracking}
                    user={user}
                    onBack={() => {
                        stopTracking();
                        setCurrentStep("panel");
                    }}
                />
            )}
        </div>
    );
}