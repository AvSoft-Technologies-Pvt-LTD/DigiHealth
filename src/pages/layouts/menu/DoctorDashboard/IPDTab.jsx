import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaNotesMedical, FaVideo } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import DynamicTable from "../../../../components/microcomponents/DynamicTable";
import Pagination from "../../../../components/Pagination";
import TeleConsultFlow from "../../../../components/microcomponents/Call";
import toast from "react-hot-toast";

const OPT = {
  STATUS: ["Admitted", "Under Treatment", "Discharged"],
  DEPT: [
    "General Medicine",
    "Surgery",
    "Cardiology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
  ],
};

export default function IPDTab({
  patients,
  loading,
  newPatientId,
  highlightedPatientId,
  onViewPatient,
}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoBlob, setSelectedVideoBlob] = useState(null);
  const [selectedVideoMetadata, setSelectedVideoMetadata] = useState(null);

  // Helper: Load recording from localStorage
  const loadRecordingFromLocalStorage = (key) => {
    const dataUrl = localStorage.getItem(key);
    const metadataStr = localStorage.getItem(`${key}_metadata`);
    if (!dataUrl) return null;
    try {
      const byteString = atob(dataUrl.split(",")[1]);
      const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return {
        blob: new Blob([ab], { type: mimeString }),
        metadata: metadataStr ? JSON.parse(metadataStr) : null,
      };
    } catch (error) {
      console.error("Failed to decode data URL from localStorage:", error);
      return null;
    }
  };

  // Helper: Check if a patient has a recording
  const hasRecording = useCallback((patientEmail, hospitalName) => {
    const videoKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("consultationVideo_")
    );
    for (const key of videoKeys) {
      const metadataStr = localStorage.getItem(`${key}_metadata`);
      if (metadataStr) {
        try {
          const metadata = JSON.parse(metadataStr);
          if (
            metadata.patientEmail === patientEmail &&
            metadata.hospitalName === hospitalName
          ) {
            return true;
          }
        } catch (error) {
          console.error("Failed to parse metadata:", error);
        }
      }
    }
    return false;
  }, []);

  const pageSize = 6;
  const totalPages = Math.ceil(patients.length / pageSize);
  const paginatedPatients = patients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const virtualFilters = [
    {
      key: "status",
      label: "Status",
      options: OPT.STATUS.map((status) => ({ value: status, label: status })),
    },
    {
      key: "department",
      label: "Department",
      options: OPT.DEPT.map((dept) => ({ value: dept, label: dept })),
    },
  ];

  const ipdColumns = [
    {
      header: "ID",
      accessor: "sequentialId",
    },
    {
      header: "Name",
      accessor: "name",
      clickable: true,
      cell: (row) => (
        <button
          className="cursor-pointer text-[var(--primary-color)] hover:text-[var(--accent-color)]"
          onClick={() => onViewPatient(row)}
        >
          {row.name ||
            `${row.firstName || ""} ${row.middleName || ""} ${
              row.lastName || ""
            }`
              .replace(/\s+/g, " ")
              .trim()}
        </button>
      ),
    },
    { header: "Admission", accessor: "admissionDate" },
    {
      header: "Status",
      cell: (row) => (
        <span
          className={`status-badge ${
            row.status === "Admitted"
              ? "status-admitted"
              : row.status === "Under Treatment"
              ? "status-pending"
              : "status-discharged"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    { header: "Diagnosis", accessor: "diagnosis" },
    {
      header: "Ward",
      accessor: "ward",
      cell: (row) => row.ward || "N/A",
    },
    {
      header: "Discharge",
      accessor: "dischargeDate",
      cell: (row) => {
        if (!row.dischargeDate || typeof row.dischargeDate === "number") {
          return "-";
        }
        return row.dischargeDate;
      },
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleAddRecord(row)} className="text-base p-1">
            <FaNotesMedical />
          </button>
          <div className="text-sm">
            <TeleConsultFlow
              phone={row.phone}
              patientName={
                row.name ||
                `${row.firstName || ""} ${row.middleName || ""} ${
                  row.lastName || ""
                }`
                  .replace(/\s+/g, " ")
                  .trim()
              }
              context="IPD"
              patientEmail={row.email}
              hospitalName={row.hospitalName || "AV Hospital"}
            />
          </div>
          {hasRecording(row.email, row.hospitalName || "AV Hospital") && (
            <button
              onClick={() => {
                const key = Object.keys(localStorage).find((k) =>
                  k.startsWith("consultationVideo_") &&
                  localStorage.getItem(`${k}_metadata`) &&
                  JSON.parse(localStorage.getItem(`${k}_metadata`)).patientEmail === row.email
                );
                if (key) {
                  const { blob, metadata } = loadRecordingFromLocalStorage(key);
                  setSelectedVideoBlob(blob);
                  setSelectedVideoMetadata(metadata);
                  setShowVideoModal(true);
                }
              }}
              className="text-base p-1 text-green-600"
              title="View Recording"
            >
              <FaVideo />
            </button>
          )}
          <button
            title="View Medical Record"
            onClick={() => {
              let age = "";
              if (row.dob) {
                const dobDate = new Date(row.dob);
                const today = new Date();
                age = today.getFullYear() - dobDate.getFullYear();
                const m = today.getMonth() - dobDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
                  age--;
                }
              }
              navigate("/doctordashboard/medical-record", {
                state: {
                  patientName: row.name,
                  email: row.email || "",
                  phone: row.phone || "",
                  gender: row.gender || row.sex || "",
                  temporaryAddress:
                    row.temporaryAddress ||
                    row.addressTemp ||
                    row.address ||
                    "",
                  address:
                    row.address ||
                    row.temporaryAddress ||
                    row.addressTemp ||
                    "",
                  addressTemp:
                    row.addressTemp ||
                    row.temporaryAddress ||
                    row.address ||
                    "",
                  dob: row.dob || "",
                  age: age,
                  bloodType: row.bloodGroup || row.bloodType || "",
                  regNo: row.regNo || "2025/072/0032722",
                  mobileNo: row.mobileNo || row.phone || "",
                  department: row.department || "Ophthalmology",
                  wardType: row.wardType,
                  wardNo: row.wardNo,
                  bedNo: row.bedNo,
                },
              });
            }}
            className="p-1 text-base text-[var(--primary-color)]"
            style={{ display: "flex", alignItems: "center" }}
          >
            <FiExternalLink />
          </button>
        </div>
      ),
    },
  ];

  const handleAddRecord = (patient) => {
    navigate("/doctordashboard/form", { state: { patient } });
  };

  const handleCellClick = (row, column) => {
    if (column.accessor === "name") {
      onViewPatient(row);
    }
  };

  const getRowClassName = (row) => {
    if (
      row.sequentialId === newPatientId ||
      row.sequentialId === highlightedPatientId
    ) {
      return "font-bold bg-yellow-100 hover:bg-yellow-200 transition-colors duration-150";
    }
    return "";
  };

  return (
    <div className="space-y-4 p-2 sm:p-4">
      {/* Responsive Table Container */}
      <div className="overflow-x-auto custom-scrollbar w-full">
        <DynamicTable
          columns={ipdColumns}
          data={paginatedPatients}
          newRowIds={[newPatientId, highlightedPatientId].filter(Boolean)}
          onCellClick={handleCellClick}
          filters={virtualFilters}
          tabs={[]}
          tabActions={[]}
          activeTab=""
          onTabChange={() => {}}
          rowClassName={getRowClassName}
        />
      </div>

      {/* Responsive Pagination */}
      <div className="w-full flex justify-center sm:justify-end mt-4">
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Responsive Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4">
          <div className="relative bg-white p-4 sm:p-6 rounded-xl w-full max-w-xs sm:max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h3 className="text-lg sm:text-xl font-semibold">
                Consultation Recording - {selectedVideoMetadata?.patientEmail}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Recorded on: {selectedVideoMetadata?.timestamp ? new Date(selectedVideoMetadata.timestamp).toLocaleString() : "N/A"}
              </p>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl"
              >
                ×
              </button>
            </div>
            <div className="bg-black rounded-lg overflow-hidden mb-4">
              <video
                controls
                className="w-full h-48 sm:h-96 object-contain"
                src={selectedVideoBlob ? URL.createObjectURL(selectedVideoBlob) : undefined}
              >
                <p className="text-center text-white p-4 sm:p-8">
                  Unable to load video recording.
                </p>
              </video>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={() => setShowVideoModal(false)}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <button
                className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => {
                  if (selectedVideoBlob) {
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(selectedVideoBlob);
                    a.download = `consult_${selectedVideoMetadata?.patientEmail || "patient"}_${selectedVideoMetadata?.timestamp || Date.now()}.webm`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    toast.success("Video download started");
                  }
                }}
              >
                Download Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
