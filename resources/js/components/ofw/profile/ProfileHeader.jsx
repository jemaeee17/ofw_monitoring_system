import React from "react";

export default function ProfileHeader({ profile, isEditing, setProfile, toggleEdit }) {
    return (
        <div className="card p-4 mb-4 shadow-sm border-0">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

                <div className="d-flex align-items-center gap-4">
                    {isEditing && (
                        <input
                            type="file"
                            className="form-control mt-2"
                            onChange={(e) => setProfile({ ...profile, photo: e.target.files[0] })}
                        />
                    )}

                    <img
                        src={profile.photo ? `/storage/${profile.photo}` : "/images/woman.png"}
                        width="90"
                        className="rounded-circle"
                        alt="profile"
                    />

                    <div>
                        {isEditing ? (
                            <>
                                <input
                                    className="form-control mb-2"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                />
                                <input
                                    className="form-control"
                                    value={profile.title}
                                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                />
                            </>
                        ) : (
                            <>
                                <h3 className="fw-bold">{profile.name}</h3>
                                <div className="text-muted">{profile.title}</div>
                            </>
                        )}

                        <div className="text-muted small d-flex flex-wrap gap-3 mt-1">
                            {isEditing ? (
                                <>
                                    <input
                                        className="form-control"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    />
                                    <input
                                        className="form-control mt-2"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    />
                                </>
                            ) : (
                                <>
                                    <span><i className="bi bi-envelope me-1"></i> {profile.email}</span>
                                    <span><i className="bi bi-telephone me-1"></i> {profile.phone}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <button className="btn btn-primary" onClick={toggleEdit}>
                    <i className="bi bi-pencil me-2"></i>
                    {isEditing ? "Save Profile" : "Edit Profile"}
                </button>
            </div>
        </div>
    );
}