import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../../../components/Pagination";
import { Printer } from "lucide-react";
import AVLogo from "../../../../assets/AV.png";
import DynamicTable from "../../../../components/microcomponents/DynamicTable"; // 👈 import reusable component

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          "https://681b32bd17018fe5057a8bcb.mockapi.io/paybook"
        );
        setPayments(res.data);
      } catch {
        setError("Failed to fetch payment data");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString();
  const closeModal = () => setSelectedPatient(null);
  const printAllForms = () => window.print();

  // Define columns for DynamicTable
  const columns = [
    {
      header: "Patient Name",
      accessor: "patientName",
      clickable: true,
    },
    { header: "Invoice No", accessor: "invoiceNo" },
    {
      header: "Date",
      accessor: "date",
      cell: (row) => formatDate(row.date),
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (row) => `₹${Number(row.amount).toLocaleString()}`,
    },
  ];

  // Filters Example
  const filters = [
    {
      key: "method",
      label: "Payment Mode",
      options: [
        { label: "Cash", value: "Cash" },
        { label: "Card", value: "Card" },
        { label: "UPI", value: "UPI" },
      ],
    },
    {
      key: "serviceType",
      label: "Service Type",
      options: [
        { label: "Consultation", value: "Consultation" },
        { label: "Lab Test", value: "Lab Test" },
        { label: "Surgery", value: "Surgery" },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-color)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Pagination Logic
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData = payments.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(payments.length / rowsPerPage);

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="h3-heading mb-4 sm:mb-6 text-lg sm:text-xl">
          Payment Records
        </h2>

        {/* ✅ Dynamic Table */}
        <DynamicTable
          columns={columns}
          data={paginatedData}
          onCellClick={(row, col) => {
            if (col.accessor === "patientName") setSelectedPatient(row);
          }}
          filters={filters}
          showSearchBar={true}
        />

        {/* Pagination */}
        <div className="w-full flex justify-end mt-4">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>

        {/* ✅ Invoice Modal */}
        {selectedPatient && (
          <div className="fixed inset-0 z-60 bg-black/70 bg-opacity-50 flex items-center justify-center overflow-y-auto p-2 print:p-0">
            <div className="bg-white w-full sm:w-[90%] md:w-[80%] lg:w-[900px] h-auto rounded-md shadow-lg p-4 sm:p-6 print:p-4 md:print:p-10 print:rounded-none print:shadow-none">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
                  <img
                    src={AVLogo}
                    alt="AV Logo"
                    className="w-16 h-16 sm:w-24 sm:h-24 object-contain"
                  />
                  <div>
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
                      AV Swasthya Multispeciality Hospital
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600">
                      123, Main Road, Bengaluru - 560001
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Phone: +91 98765 43210 | avswasthya@email.com
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs sm:text-sm text-gray-700 mt-2 sm:mt-0">
                  <p>
                    <strong>INVOICE NO:</strong> {selectedPatient.invoiceNo}
                  </p>
                  <p>
                    <strong>DATE:</strong> {formatDate(selectedPatient.date)}
                  </p>
                </div>
              </div>

              {/* Patient Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm mb-4 sm:mb-6">
                <div className="border p-2 sm:p-3">
                  <h3 className="font-semibold mb-1">Bill To:</h3>
                  <p>
                    <strong>Name:</strong> {selectedPatient.patientName}
                  </p>
                  <p>
                    <strong>City:</strong> Bengaluru
                  </p>
                  <p>
                    <strong>Country:</strong> India
                  </p>
                  <p>
                    <strong>Phone:</strong> +91 98765 43210
                  </p>
                </div>
                <div className="border p-2 sm:p-3">
                  <h3 className="font-semibold mb-1">Patient:</h3>
                  <p>
                    <strong>Name:</strong> {selectedPatient.patientName}
                  </p>
                  <p>
                    <strong>Service Type:</strong> {selectedPatient.serviceType}
                  </p>
                  <p>
                    <strong>Payment Mode:</strong> {selectedPatient.method}
                  </p>
                </div>
              </div>

              {/* Table Section */}
              <div className="overflow-x-auto">
                <table className="w-full border text-xs sm:text-sm mb-4 sm:mb-6">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="border px-2 sm:px-3 py-1 sm:py-2">
                        Dt of Service
                      </th>
                      <th className="border px-2 sm:px-3 py-1 sm:py-2">
                        Description
                      </th>
                      <th className="border px-2 sm:px-3 py-1 sm:py-2">
                        Total Fee
                      </th>
                      <th className="border px-2 sm:px-3 py-1 sm:py-2">
                        Balance (PR)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-2 sm:px-3 py-1 sm:py-2">
                        {formatDate(selectedPatient.date)}
                      </td>
                      <td className="border px-2 sm:px-3 py-1 sm:py-2">
                        {selectedPatient.serviceType}
                      </td>
                      <td className="border px-2 sm:px-3 py-1 sm:py-2">
                        ₹{selectedPatient.amount}
                      </td>
                      <td className="border px-2 sm:px-3 py-1 sm:py-2">
                        ₹{selectedPatient.amount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row justify-between gap-2 print:hidden">
                <button
                  onClick={closeModal}
                  className="btn btn-secondary animated-cancel-btn w-full sm:w-auto"
                >
                  Close
                </button>
                <button
                  onClick={printAllForms}
                  className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Printer className="w-4 h-4" />
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
