import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";
import { FaNotesMedical } from "react-icons/fa";
import DynamicTable from "../../../../components/microcomponents/DynamicTable";
import Pagination from "../../../../components/Pagination";
import TeleConsultFlow from "../../../../components/microcomponents/Call";

export default function OPDTab({
  patients,
  loading,
  newPatientId,
  onViewPatient,
  highlightedPatientId,
}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.ceil(patients.length / pageSize);
  const paginatedPatients = patients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const opdColumns = [
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
            row.fullName ||
            `${row.firstName || ""} ${row.lastName || ""}`.trim() ||
            "Unknown Patient"}
        </button>
      ),
    },
    {
      header: "Diagnosis",
      accessor: "diagnosis",
      cell: (row) => row.diagnosis || "Not specified",
    },
    {
      header: "Date & Time",
      accessor: "datetime",
      cell: (row) => row.datetime || "Not scheduled",
    },
    {
      header: "Phone",
      accessor: "phone",
      cell: (row) => row.phone || "Not provided",
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAddRecord(row)}
            className="text-base p-1"
          >
            <FaNotesMedical />
          </button>
          <div className="text-sm">
            <TeleConsultFlow
              phone={row.phone}
              patientName={row.name}
              context="opd"
            />
          </div>
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
                  patientName:
                    row.name ||
                    row.fullName ||
                    `${row.firstName || ""} ${row.lastName || ""}`.trim(),
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
                },
              });
            }}
            className="text-base text-[var(--primary-color)] p-1"
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
    <div className="space-y-4">
      <DynamicTable
        columns={opdColumns}
        data={paginatedPatients}
        newRowIds={[newPatientId, highlightedPatientId].filter(Boolean)}
        onCellClick={handleCellClick}
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
