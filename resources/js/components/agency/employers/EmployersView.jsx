import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployersTable from './EmployersTable';
import EmployerFormModal from './EmployerFormModal';

const EmployersView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployer, setSelectedEmployer] = useState(null);
    const [showEmployerForm, setShowEmployerForm] = useState(false);

    const phColors = {
        blue: '#0038a8',
        red: '#ce1126',
        gold: '#fcd116',
        lightBlue: '#e6ebf5',
        success: '#198754'
    };

    const fetchEmployers = async () => {
        try {
            const res = await axios.get('/api/employers');
            setEmployers(res.data);
        } catch (error) {
            console.error('Failed to fetch employers:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchEmployers();
    }, []);

    const [employers, setEmployers] = useState([]);

    const filteredEmployers = employers.filter(emp =>
        (emp.company_name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const handleEmployerCreated = (newEmployer) => {
        setEmployers(prev => [newEmployer, ...prev]);
    };

    return (
        <div className="view-container animate-fade-in p-2">

            <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white shadow-sm" style={{ borderRadius: '15px', borderLeft: '6px solid #0038a8' }}>
                <div>
                    <h2 className="fw-bold mb-0" style={{ color: '#0038a8' }}>Partner Employers</h2>
                    <p className="text-muted mb-0 small">Employers details and information.</p>
                </div>
            </div>

            <div className="d-flex justify-content-between mb-4 align-items-center">
                <div className="search-wrapper w-50">
                    <div className="input-group bg-white shadow-sm rounded-pill overflow-hidden px-3 border">
                        <span className="input-group-text bg-transparent border-0 text-muted">🔍</span>
                        <input
                            type="text"
                            className="form-control border-0 bg-transparent shadow-none"
                            placeholder="Filter by Name or Region..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    className="btn shadow-sm fw-bold px-4 rounded-pill"
                    style={{ backgroundColor: '#f0f4ff', color: phColors.blue, border: '1px solid #dbeafe' }}
                    onClick={() => setShowEmployerForm(true)}
                >
                    ➕ Add Employer
                </button>
            </div>

            <EmployersTable
                employers={filteredEmployers}
                onSelectEmployer={setSelectedEmployer}
                phColors={phColors}
            />

            <EmployerFormModal
                show={showEmployerForm}
                onClose={() => setShowEmployerForm(false)}
                phColors={phColors}
                onEmployerCreated={handleEmployerCreated}
            />

        </div>
    );
};

export default EmployersView;