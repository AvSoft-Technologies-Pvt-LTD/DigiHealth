import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";
import DynamicTable from "../../../../components/microcomponents/DynamicTable";
import Pagination from "../../../../components/Pagination";
import TeleConsultFlow from "../../../../components/microcomponents/Call";
import { FaNotesMedical } from "react-icons/fa";

export default function VirtualTab({
  patients,
  loading,
  newPatientId,
  highlightedPatientId,
  onViewPatient,
}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Add sequentialId to each patient
  const patientsWithSequentialId = patients.map((patient, index) => ({
    ...patient,
    sequentialId: index + 1,
  }));

  const totalPages = Math.ceil(patientsWithSequentialId.length / pageSize);
  const paginatedPatients = patientsWithSequentialId.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddRecord = (patient) => {
    let age = "";
    if (patient.dob) {
      const dobDate = new Date(patient.dob);
      const today = new Date();
      age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
    }
    navigate("/doctordashboard/form", {
      state: {
        patient: {
          id: patient.id,
          name: patient.name,
          email: patient.email || "",
          phone: patient.phone || "",
          gender: patient.gender || patient.sex || "",
          dob: patient.dob || "",
          consultationType: patient.consultationType || "Virtual",
          scheduledDateTime: patient.scheduledDateTime || "",
          age: age,
          bloodGroup: patient.bloodGroup || "",
          notes: patient.notes || "",
          address:
            patient.address ||
            patient.temporaryAddress ||
            patient.addressTemp ||
            "",
        },
      },
    });
  };

  const virtualColumns = [
    {
      header: "ID",
      accessor: "sequentialId", // Use sequentialId for serial numbering
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
          {row.name}
        </button>
      ),
    },
    {
      header: "Consultation Type",
      cell: (row) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          {row.consultationType || "Video Call"}
        </span>
      ),
    },
    { header: "Scheduled", accessor: "scheduledDateTime" },
    {
      header: "Status",
      cell: (row) => (
        <span
          className={`status-badge ${
            row.consultationStatus === "Scheduled"
              ? "status-admitted"
              : row.consultationStatus === "In Progress"
              ? "status-pending"
              : row.consultationStatus === "Completed"
              ? "status-discharged"
              : "status-pending"
          }`}
        >
          {row.consultationStatus || "Scheduled"}
        </span>
      ),
    },
    { header: "Duration", cell: (row) => `${row.duration || 30} min` },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <button
            title="Add New Consultation"
            onClick={(e) => {
              e.stopPropagation();
              handleAddRecord(row);
            }}
            className="text-base p-1"
            style={{ display: "flex", alignItems: "center" }}
          >
            <FaNotesMedical />
          </button>
          <TeleConsultFlow
            phone={row.phone}
            patientName={row.name}
            context="virtual"
          />

          <button
            title="View Patient Records"
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
                  dob: row.dob,
                  age: age,
                  consultationType: row.consultationType || "Virtual",
                },
              });
            }}
            className="text-lg text-[var(--primary-color)]"
            style={{ display: "flex", alignItems: "center" }}
          >
            <FiExternalLink />
          </button>
        </div>
      ),
    },
  ];

  const getRowClassName = (row) => {
    if (
      row.sequentialId === newPatientId ||
      row.sequentialId === highlightedPatientId
    ) {
      return "font-bold bg-yellow-100 hover:bg-yellow-200 transition-colors duration-150";
    }
    return "";
  };

  const virtualFilters = [
    {
      key: "consultationStatus",
      label: "Status",
      options: [
        { value: "Scheduled", label: "Scheduled" },
        { value: "In Progress", label: "In Progress" },
        { value: "Completed", label: "Completed" },
        { value: "Cancelled", label: "Cancelled" },
      ],
    },
    {
      key: "consultationType",
      label: "Type",
      options: [
        { value: "Video Call", label: "Video Call" },
        { value: "Voice Call", label: "Voice Call" },
        { value: "Chat", label: "Chat" },
      ],
    },
  ];

  const handleCellClick = (row, column) => {
    if (column.accessor === "name") {
      onViewPatient(row);
    }
  };

  return (
    <div className="space-y-4">
      <DynamicTable
        columns={virtualColumns}
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
      <div className="w-full flex justify-end mt-4">
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
