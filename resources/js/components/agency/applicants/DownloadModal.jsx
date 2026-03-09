import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DownloadModal = ({ selectedApplicant, setShowDownloadModal, isGenerating, setIsGenerating, refCode }) => {
    const executeDownload = (applicant) => {
        setIsGenerating(true);

        const doc = new jsPDF();
        doc.setFillColor(0, 51, 102);
        doc.rect(0, 0, 210, 40, "F");
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text("KALINGAGATE KSA", 14, 20);
        doc.text(`REFERENCE CODE: ${refCode}`, 14, 34);

        doc.autoTable({
            startY: 50,
            head: [["PERSONAL INFORMATION", ""]],
            body: [
                ["Full Name:", applicant.name.toUpperCase()],
                ["Gender:", applicant.gender],
                ["Age:", applicant.age.toString()],
                ["Passport No:", applicant.passport || "---"],
                ["Contact:", applicant.contact],
                ["Email:", applicant.email],
            ],
            theme: "plain",
            headStyles: { fillColor: [220, 53, 69] },
        });

        doc.save(`${applicant.name.replace(/\s+/g, "_")}_Record.pdf`);

        setIsGenerating(false);
        setShowDownloadModal(false);
    };

    return (
        <div className="modal-overlay-ph" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.7)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="bg-white p-4 rounded shadow-lg text-center animate-slide-up" style={{ maxWidth: "400px", width: "90%" }}>
                <div className="mb-3" style={{ fontSize: "40px" }}>{isGenerating ? "⏳" : "📄"}</div>
                <h5 className="fw-bold text-dark">Export Applicant Record</h5>
                <p className="text-muted small">Prepare formal PDF for <strong>{selectedApplicant?.name}</strong>?</p>
                <div className="d-flex gap-2 justify-content-center mt-4">
                    <button className="btn btn-light border px-4" onClick={() => setShowDownloadModal(false)} disabled={isGenerating}>Cancel</button>
                    <button className="btn btn-ph-blue text-white px-4" style={{ backgroundColor: "#0038a8" }} onClick={() => executeDownload(selectedApplicant)} disabled={isGenerating}>
                        {isGenerating ? "Generating..." : "Download PDF"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DownloadModal;