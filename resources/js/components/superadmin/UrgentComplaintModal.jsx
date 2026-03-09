export function UrgentComplaintModal({ complaint, onClose }) {
    if (!complaint) return null;

    return (
        <div className="modal-overlay">
            <div className="details-modal">
                <div className="modal-header">
                    <h3>Urgent Complaint Details</h3>
                    <button onClick={onClose}>✕</button>
                </div>

                <div className="complaint-details">
                    <div className="details-section">
                        <h4 className="section-title">OFW Information</h4>
                        <div className="detail-row"><strong>Name:</strong> <span>{complaint.ofw_name}</span></div>
                        {complaint.co_host_id && <div className="detail-row"><strong>Agency ID:</strong> <span>{complaint.co_host_id}</span></div>}
                        {complaint.city && <div className="detail-row"><strong>City:</strong> <span>{complaint.city}</span></div>}
                        {complaint.address && <div className="detail-row"><strong>Address:</strong> <span>{complaint.address}</span></div>}
                        {complaint.latitude && complaint.longitude && <div className="detail-row"><strong>Location:</strong> <span>{complaint.latitude}, {complaint.longitude}</span></div>}
                    </div>

                    <div className="details-section right">
                        <h4 className="section-title">Complaint</h4>
                        {complaint.complaint && <p className="complaint-text">{complaint.complaint}</p>}
                        <div className="detail-row"><strong>Date Submitted:</strong> <span>{new Date(complaint.created_at).toLocaleString()}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}