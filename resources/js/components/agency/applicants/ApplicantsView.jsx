import React, { useState, useEffect } from "react";
import axios from "axios";
import ApplicantsTable from "./ApplicantsTable";
import ApplicationFormModal from "./ApplicationFormModal";
import AssignEmployerModal from "./AssignEmployerModal";
import DownloadModal from "./DownloadModal";
import ApplicantDetailsModal from "./ApplicantDetailsModal";

axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.withCredentials = true;

const ApplicantsView = () => {
    const [employers, setEmployers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [loadingApplicants, setLoadingApplicants] = useState(false);
    const [applicantsData, setApplicantsData] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const fetchApplicants = async () => {
        setLoadingApplicants(true);
        try {
            const res = await axios.get("/api/applications?status=Applicant");

            const applicantsArray = Array.isArray(res.data) ? res.data : res.data.data;

            const formatted = applicantsArray.map((item) => ({
                id: item.id,
                date: item.created_at ? new Date(item.created_at).toLocaleDateString() : "-",
                name: item.full_name ?? "N/A",
                gender: item.gender ?? "-",
                age: calculateAge(item.birthdate),
                contact: item.contact_number ?? "-",
                email: item.email ?? "N/A",
                passport: item.passport_number ?? "-",
                assignedEmployer: item.assignedEmployer && item.assignedEmployer.employer_id
                    ? item.assignedEmployer
                    : null,
                hasAssignedEmployer: item.assignedEmployer ? true : false,
            }));

            setApplicantsData(formatted);
        } catch (err) {
            console.error(err);
            setApplicantsData([]);
        } finally {
            setLoadingApplicants(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
        fetchEmployers();
    }, []);

    const calculateAge = (birthdate) => {
        if (!birthdate) return "-";
        const birth = new Date(birthdate);
        if (isNaN(birth.getTime())) return "-";
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    const fetchEmployers = async () => {
        try {
            const res = await axios.get("/api/employers");
            setEmployers(res.data);
        } catch (err) {
            console.error("Failed to fetch employers:", err);
        }
    };

    const handleOpenAssign = (applicant) => {
        setSelectedApplicant(applicant);
        setShowAssignModal(true);
    };

    const handleDownloadClick = (applicant) => {
        setSelectedApplicant(applicant);
        setShowDownloadModal(true);
    };

    const handleOpenDetails = (applicant) => {
        setSelectedApplicant(applicant);
        setShowDetailsModal(true);
    };

    const handleAssign = async ({ applicantId, employerId, position, salary }) => {
        try {
            const res = await axios.post("/api/assign-employer", {
                applicant_id: applicantId,
                employer_id: employerId,
                job_title: position,
                salary: salary
            });

            setApplicantsData(prev =>
                prev.map(app =>
                    app.id === applicantId
                        ? {
                            ...app,
                            assignedEmployer: { employer_id: employerId, position, salary },
                            hasAssignedEmployer: true
                        }
                        : app
                )
            );

            return res.data;
        } catch (err) {
            console.error(err);
            alert("Failed to assign employer. Please try again.");
        }
    };

    return (
        <div className="animate-fade-in">
            <ApplicantsTable
                applicantsData={applicantsData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setShowForm={setShowForm}
                handleDownloadClick={handleDownloadClick}
                handleOpenAssign={handleOpenAssign}
                handleOpenDetails={handleOpenDetails}
                loading={loadingApplicants}
            />

            {showDownloadModal && (
                <DownloadModal
                    selectedApplicant={selectedApplicant}
                    setShowDownloadModal={setShowDownloadModal}
                    isGenerating={isGenerating}
                    setIsGenerating={setIsGenerating}
                />
            )}

            {showAssignModal && (
                <AssignEmployerModal
                    show={showAssignModal}
                    onClose={() => setShowAssignModal(false)}
                    selectedApplicant={selectedApplicant}
                    employers={employers}
                    onAssign={handleAssign}
                />
            )}

            {showForm && (
                <ApplicationFormModal
                    showForm={showForm}
                    closeAndReset={() => setShowForm(false)}
                    onApplicationSaved={fetchApplicants}
                    agencyId={user.id}
                />
            )}

            {showDetailsModal && (
                <ApplicantDetailsModal
                    show={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    selectedApplicant={selectedApplicant}
                    onSave={(id) => {
                        setApplicantsData(prev => prev.filter(app => app.id !== id));
                    }}
                />
            )}
        </div>
    );
};

export default ApplicantsView;