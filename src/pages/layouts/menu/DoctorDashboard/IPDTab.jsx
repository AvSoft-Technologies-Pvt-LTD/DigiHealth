import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaNotesMedical } from "react-icons/fa";
import DynamicTable from "../../../../components/microcomponents/DynamicTable";
import Pagination from "../../../../components/Pagination";
import TeleConsultFlow from "../../../../components/microcomponents/Call";
import { FiExternalLink } from "react-icons/fi";

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
  highlightedPatientId, // Added as prop
  onViewPatient,
}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.ceil(patients.length / pageSize);
  const paginatedPatients = patients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Define virtualFilters if not passed as prop
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
          <button onClick={() => handleAddRecord(row)} className="text-base">
            <FaNotesMedical className="text-base" />
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
            <FiExternalLink className="text-base" />
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
