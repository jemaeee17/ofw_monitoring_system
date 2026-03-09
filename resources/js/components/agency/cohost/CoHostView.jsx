import React, { useState, useEffect } from 'react';
import CoHostTable from './CoHostTable';
import CoHostModal from './CoHostModal';

const CoHostView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [selectedAgency, setSelectedAgency] = useState(null);

    const [agencies, setAgencies] = useState([]);

    useEffect(() => {
        fetch('/api/co-hosts')
            .then(res => res.json())
            .then(data => setAgencies(data))
            .catch(err => console.error(err));
    }, []);

    const handleAction = (type, agency = null) => {
        setModalType(type);
        setSelectedAgency(agency);
        setShowModal(true);
    };

    const filteredAgencies = agencies.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const saveAgency = async (data) => {
        try {
            let response;

            if (modalType === 'add') {
                response = await fetch('/api/co-hosts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                response = await fetch(`/api/co-hosts/${selectedAgency.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }

            await response.json();

            const updatedAgencies = await fetch('/api/co-hosts').then(res => res.json());
            setAgencies(updatedAgencies);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="animate-fade-in p-2">

            <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white shadow-sm" style={{ borderRadius: '15px', borderLeft: '6px solid #0038a8' }}>
                <div>
                    <h2 className="fw-bold mb-0" style={{ color: '#0038a8' }}>Co-Host Partners</h2>
                    <p className="text-muted mb-0 small">
                        Managing <span className="px-2 py-1 rounded bg-primary-subtle text-primary fw-bold" style={{ fontSize: '0.9rem' }}>Verified Agencies</span> across the Kingdom.
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-ph-blue px-4 py-2 shadow-sm fw-bold border-0 transition-all"
                        style={{
                            borderRadius: '12px',
                            letterSpacing: '0.5px',
                            color: '#0038a8',
                        }}
                        onClick={() => handleAction('add')}
                    >
                        + Add New Partner
                    </button>
                </div>
            </div>

            <div className="modern-card p-2 mb-4 bg-white shadow-sm border-0" style={{ borderRadius: '50px' }}>
                <div className="search-group-ph border-0 bg-light px-4 py-2 rounded-pill d-flex align-items-center">
                    <span className="me-2 text-muted">🔍</span>
                    <input
                        type="text"
                        className="form-control border-0 bg-transparent shadow-none"
                        placeholder="Search agency name..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <CoHostTable agencies={filteredAgencies} onAction={handleAction} />

            <CoHostModal
                show={showModal}
                onClose={() => setShowModal(false)}
                type={modalType}
                agency={selectedAgency}
                onSave={saveAgency}
            />

        </div>
    );
};

export default CoHostView;