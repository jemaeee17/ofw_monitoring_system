import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileHeader from "./ProfileHeader";
import InfoItem from "./InfoItem";

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "",
        title: "",
        email: "",
        phone: "",
        birthdate: "",
        gender: "",
        nationality: "",
        passport: "",
        employer: "",
        position: "",
        contract: "",
        photo: ""
    });

    const userId = localStorage.getItem("ofwId");

    // Fetch profile on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`/api/ofw/profile/${userId}`);
            setProfile({
                name: res.data.name,
                title: res.data.title,
                email: res.data.email,
                phone: res.data.phone,
                birthdate: res.data.birthdate,
                gender: res.data.gender,
                nationality: res.data.nationality || "",
                passport: res.data.passport || "",
                employer: res.data.employer || "",
                position: res.data.position || "",
                contract: res.data.contract || "",
                photo: res.data.photo
            });
        } catch (err) {
            console.error("Failed to fetch profile:", err);
        }
    };

    // Toggle edit/save
    const toggleEdit = async () => {
        if (isEditing) {
            try {
                const formData = new FormData();
                Object.keys(profile).forEach((key) => {
                    if (key === "photo" && profile.photo instanceof File) {
                        formData.append("photo", profile.photo);
                    } else {
                        formData.append(key, profile[key]);
                    }
                });

                await axios.put(`/api/ofw/profile/${userId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                alert("Profile updated successfully");
                fetchProfile(); // Refresh data
            } catch (err) {
                console.error("Failed to update profile:", err);
            }
        }
        setIsEditing(!isEditing);
    };

    return (
        <>
            <ProfileHeader
                profile={profile}
                isEditing={isEditing}
                setProfile={setProfile}
                toggleEdit={toggleEdit}
            />

            <div className="row g-4">
                {/* PERSONAL INFO */}
                <div className="col-md-6">
                    <div className="card p-4 h-100 shadow-sm border-0">
                        <h5 className="fw-bold mb-4">Personal Information</h5>
                        <InfoItem
                            label="Date of Birth"
                            value={profile.birthdate}
                            editing={isEditing}
                            onChange={(val) => setProfile({ ...profile, birthdate: val })}
                        />
                        <InfoItem
                            label="Gender"
                            value={profile.gender}
                            editing={isEditing}
                            onChange={(val) => setProfile({ ...profile, gender: val })}
                        />
                        <InfoItem
                            label="Nationality"
                            value={profile.nationality}
                            editing={isEditing}
                            onChange={(val) => setProfile({ ...profile, nationality: val })}
                        />
                        <InfoItem
                            label="Passport Number"
                            value={profile.passport}
                            editing={isEditing}
                            onChange={(val) => setProfile({ ...profile, passport: val })}
                        />
                    </div>
                </div>

                {/* EMPLOYMENT INFO */}
                <div className="col-md-6">
                    <div className="card p-4 h-100 shadow-sm border-0">
                        <h5 className="fw-bold mb-4">Employment Information</h5>
                        <InfoItem
                            label="Current Employer"
                            value={profile.employer}
                            editing={isEditing}
                            onChange={(val) => setProfile({ ...profile, employer: val })}
                        />
                        <InfoItem
                            label="Position"
                            value={profile.position}
                            editing={isEditing}
                            onChange={(val) => setProfile({ ...profile, position: val })}
                        />
                        <InfoItem
                            label="Contract Start"
                            value={profile.contract}
                            editing={isEditing}
                            onChange={(val) => setProfile({ ...profile, contract: val })}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}