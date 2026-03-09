import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployedHeader from './EmployedHeader';
import EmployedTable from './EmployedTable';
import EmployedModal from './EmployedModal';

const EmployedView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [workers, setWorkers] = useState([]);
    const [allWorkers, setAllWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [workerDocuments, setWorkerDocuments] = useState([]);
    const [workerFlights, setWorkerFlights] = useState([]);

    const fetchWorkers = () => {
        setLoading(true);
        axios.get('/api/employed')
            .then(res => {
                setAllWorkers(res.data);
                setWorkers(res.data.filter(w => w.status === 'Employed'));
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchWorkers();
    }, []);

    const filteredWorkers = workers.filter(worker =>
        worker.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalWorkers = allWorkers.length;
    const newDeployments = allWorkers.filter(w => w.status === 'Deployed').length;

    const handleOpenWorker = async (worker) => {
        try {
            const res = await axios.get(`/api/applications/${worker.id}`);
            const application = res.data;

            setSelectedWorker({
                ...worker,
                documents: application.documents || [],
                flights: application.flights || []
            });
        } catch (err) {
            console.error(err);
            alert('Failed to fetch worker details');
        }
    };

    if (loading) return <p>Loading employed workers...</p>;

    return (
        <div className="animate-fade-in p-3" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <EmployedHeader
                total={totalWorkers}
                newDeployments={newDeployments}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <EmployedTable
                workers={filteredWorkers}
                onOpenWorker={handleOpenWorker}
                setWorkers={setWorkers}
                setAllWorkers={setAllWorkers}
            />

            {selectedWorker && (
                <EmployedModal
                    selectedWorker={selectedWorker}
                    workerDocuments={selectedWorker.documents} 
                    workerFlights={selectedWorker.flights}
                    onClose={() => setSelectedWorker(null)}
                />
            )}
        </div>
    );
};

export default EmployedView;