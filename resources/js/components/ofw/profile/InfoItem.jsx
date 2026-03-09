import React from "react";

export default function InfoItem({ label, value, editing, onChange }) {
    return (
        <div className="mb-3">
            <small className="text-muted">{label}</small>
            {editing ? (
                <input
                    className="form-control mt-1"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <div className="mt-1">{value || "—"}</div>
            )}
        </div>
    );
}