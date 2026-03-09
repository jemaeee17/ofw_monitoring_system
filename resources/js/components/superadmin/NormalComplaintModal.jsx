export function NormalComplaintModal({ complaint, onClose }) {
    if (!complaint) return null;

    return (
        <div className="modal-overlay">
            <div className="details-modal">
                <div className="modal-header">
                    <h3>Normal Complaint Details</h3>
                    <button onClick={onClose}>✕</button>
                </div>

                <div className="complaint-details">
                    {/* LEFT COLUMN */}
                    <div className="details-section">
                        <h4 className="section-title">OFW Information</h4>
                        {complaint.ofw_name && <div className="detail-row"><strong>Name:</strong> <span>{complaint.ofw_name}</span></div>}
                        {complaint.gender && <div className="detail-row"><strong>Gender:</strong> <span>{complaint.gender}</span></div>}
                        {complaint.birthdate && <div className="detail-row"><strong>Birthdate:</strong> <span>{complaint.birthdate}</span></div>}
                        {complaint.occupation && <div className="detail-row"><strong>Occupation:</strong> <span>{complaint.occupation}</span></div>}
                        {complaint.passport_no && <div className="detail-row"><strong>Passport No:</strong> <span>{complaint.passport_no}</span></div>}
                        {complaint.national_id && <div className="detail-row"><strong>National ID:</strong> <span>{complaint.national_id}</span></div>}
                        {complaint.email && <div className="detail-row"><strong>Email:</strong> <span>{complaint.email}</span></div>}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="details-section right">
                        <h4 className="section-title">Contact & Complaint</h4>
                        {complaint.contact_person && <div className="detail-row"><strong>Contact Person:</strong> <span>{complaint.contact_person}</span></div>}
                        {complaint.primary_contact && <div className="detail-row"><strong>Primary Contact:</strong> <span>{complaint.primary_contact}</span></div>}
                        {complaint.secondary_contact && <div className="detail-row"><strong>Secondary Contact:</strong> <span>{complaint.secondary_contact}</span></div>}
                        {complaint.address_abroad && <div className="detail-row"><strong>Address Abroad:</strong> <span>{complaint.address_abroad}</span></div>}
                        <div className="detail-row"><strong>Date Submitted:</strong> <span>{new Date(complaint.created_at).toLocaleString()}</span></div>

                        {complaint.complaint && (
                            <>
                                <h4 className="section-title mt-3">Complaint</h4>
                                <p className="complaint-text">{complaint.complaint}</p>
                            </>
                        )}

                        {(complaint.image1 || complaint.image2 || complaint.image3) && (
                            <>
                                <h4 className="section-title mt-3">Evidence</h4>
                                <div className="evidence-images">
                                    {complaint.image1 && <img src={`http://127.0.0.1:8000/storage/${complaint.image1}`} alt="evidence1" />}
                                    {complaint.image2 && <img src={`http://127.0.0.1:8000/storage/${complaint.image2}`} alt="evidence2" />}
                                    {complaint.image3 && <img src={`http://127.0.0.1:8000/storage/${complaint.image3}`} alt="evidence3" />}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}