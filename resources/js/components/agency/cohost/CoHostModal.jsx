import React, { useState, useEffect } from 'react';

const CoHostModal = ({ show, onClose, type, agency, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        contact: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (agency) {
            setFormData({
                name: agency.name || '',
                location: agency.location || '',
                contact: agency.contact || ''
            });
        } else {
            setFormData({ name: '', location: '', contact: '' });
        }
    }, [agency, show]);

    if (!show) return null;

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (onSave) {
            onSave(formData);
        }
        setShowSuccess(true); 
    };

    const closeSuccessModal = () => {
        setShowSuccess(false);
        onClose();
    };

    return (
        <>
            <div
                className="modal-overlay-ph"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    zIndex: 5000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)'
                }}
            >
                <div
                    className="bg-white rounded-4 shadow-lg p-0 overflow-hidden animate-slide-up"
                    style={{ width: '95%', maxWidth: '500px' }}
                >
                    <div className="p-4 text-center" style={{ borderTop: '8px solid #00d2ff' }}>
                        <h4 className="fw-bold mb-1 text-dark">
                            {type === 'add' && 'New Partner Registration'}
                            {type === 'edit' && 'Edit Partner Details'}
                        </h4>
                        <p className="text-muted small">
                            ID: {agency ? agency.id : 'NEW-ENTRY'}
                        </p>
                    </div>

                    <div className="px-4 py-2">
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="small fw-bold text-secondary mb-1">
                                    Legal Agency Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="form-control bg-light border-0 py-2"
                                    style={{ borderRadius: '8px' }}
                                />
                            </div>

                            <div className="col-6">
                                <label className="small fw-bold text-secondary mb-1">
                                    HQ City
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    className="form-control bg-light border-0 py-2"
                                    style={{ borderRadius: '8px' }}
                                />
                            </div>

                            <div className="col-6">
                                <label className="small fw-bold text-secondary mb-1">
                                    Primary Contact
                                </label>
                                <input
                                    type="text"
                                    value={formData.contact}
                                    onChange={(e) => handleChange('contact', e.target.value)}
                                    className="form-control bg-light border-0 py-2"
                                    style={{ borderRadius: '8px' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-light mt-4 d-flex justify-content-end gap-2">
                        <button
                            className="btn btn-outline-secondary fw-bold rounded-pill"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            className="btn text-white px-5 shadow-sm rounded-pill fw-bold"
                            style={{ backgroundColor: '#0038a8' }}
                            onClick={handleSave}
                        >
                            Confirm & Save
                        </button>
                    </div>
                </div>
            </div>

            {showSuccess && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 6000
                    }}
                >
                    <div className="bg-white p-4 rounded shadow-lg text-center" style={{ width: '90%', maxWidth: '400px' }}>
                        <h5 className="fw-bold text-success mb-2">Success!</h5>
                        <p className="text-muted mb-4">Partner agency has been saved successfully.</p>
                        <button className="btn btn-success px-4 fw-bold rounded-pill" onClick={closeSuccessModal}>
                            OK
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CoHostModal;