
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  getHospitalDropdown,
  getAllMedicalConditions,
  getAllMedicalStatus
} from "../../../../utils/masterService";
import DynamicTable from "../../../../components/microcomponents/DynamicTable";
import ReusableModal from "../../../../components/microcomponents/Modal";
import { Search, Plus, CheckCircle, EyeOff, ArrowLeft } from "lucide-react";

const MedicalRecords = () => {
  const location = useLocation();
  const userData = location.state?.userData;
  const healthId = location.state?.healthId;
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [state, setState] = useState({
    activeTab: "OPD",
    showAddModal: false,
    hiddenIds: []
  });
  const [medicalData, setMedicalData] = useState({ OPD: [], IPD: [], Virtual: [] });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  const [apiDataLoading, setApiDataLoading] = useState({
    hospitals: false,
    conditions: false,
    status: false
  });

  useEffect(() => {
    const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: false });
    const byLabelAsc = (a, b) => collator.compare(String(a.label || ""), String(b.label || ""));

    const fetchMasterData = async () => {
      try {
        setApiDataLoading((prev) => ({ ...prev, hospitals: true }));
        const hospitalsResponse = await getHospitalDropdown();
        const hospitalsList = (hospitalsResponse?.data ?? [])
          .map((hospital) => {
            const label = hospital?.name || hospital?.hospitalName || hospital?.label || "";
            const value = hospital?.id ?? label;
            return { label, value };
          })
          .filter((opt) => opt.label)
          .sort(byLabelAsc);
        setHospitalOptions(hospitalsList);
        setApiDataLoading((prev) => ({ ...prev, hospitals: false }));

        setApiDataLoading((prev) => ({ ...prev, conditions: true }));
        const conditionsResponse = await getAllMedicalConditions();
        const conditionsList = (conditionsResponse?.data ?? [])
          .map((condition) => ({
            label: condition?.name || condition?.conditionName || condition?.label || "",
            value: condition?.name || condition?.conditionName || condition?.value || condition?.id || "",
          }))
          .filter((opt) => opt.label)
          .sort(byLabelAsc);
        setMedicalConditions(conditionsList);
        setApiDataLoading((prev) => ({ ...prev, conditions: false }));

        setApiDataLoading((prev) => ({ ...prev, status: true }));
        const statusResponse = await getAllMedicalStatus();
        const statusList = (statusResponse?.data ?? [])
          .map((status) => ({
            label: status?.name || status?.statusName || status?.label || "",
            value: status?.name || status?.statusName || status?.value || status?.id || "",
          }))
          .filter((opt) => opt.label)
          .sort(byLabelAsc);
        setStatusTypes(statusList);
        setApiDataLoading((prev) => ({ ...prev, status: false }));
      } catch (error) {
        console.error("Error fetching master data:", error);
        const fallbackHospitals = [
          { label: "AIIMS Delhi", value: "AIIMS Delhi" },
          { label: "Apollo Hospital, Chennai", value: "Apollo Hospital, Chennai" },
          { label: "Fortis Hospital, Gurgaon", value: "Fortis Hospital, Gurgaon" },
          { label: "Max Super Speciality Hospital, Delhi", value: "Max Super Speciality Hospital, Delhi" },
          { label: "Medanta – The Medicity, Gurgaon", value: "Medanta – The Medicity, Gurgaon" },
        ].sort(byLabelAsc);
        setHospitalOptions(fallbackHospitals);
        const fallbackConditions = [
          { label: "Asthma Disease", value: "Asthma" },
          { label: "BP (Blood Pressure)", value: "BP" },
          { label: "Diabetic Disease", value: "Diabetic" },
          { label: "Heart Disease", value: "Heart" },
        ].sort(byLabelAsc);
        setMedicalConditions(fallbackConditions);
        const fallbackStatus = [
          { label: "Active", value: "Active" },
          { label: "Consulted", value: "Consulted" },
          { label: "Discharged", value: "Discharged" },
          { label: "Recovered", value: "Recovered" },
          { label: "Treated", value: "Treated" },
        ].sort(byLabelAsc);
        setStatusTypes(fallbackStatus);
      } finally {
        setApiDataLoading((prev) => ({ ...prev, hospitals: false, conditions: false, status: false }));
      }
    };
    fetchMasterData();
  }, []);

  useEffect(() => {
    const fetchAllRecords = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await axios.get("https://6895d385039a1a2b28907a16.mockapi.io/pt-mr/patient-mrec");
        const opd = [];
        const ipd = [];
        const virtual = [];
        const patientEmail = user?.email;
        response.data.forEach((rec) => {
          if (rec.ptemail === patientEmail) {
            if (rec.type === "OPD") opd.push(rec);
            else if (rec.type === "IPD") ipd.push(rec);
            else if (rec.type === "Virtual") virtual.push(rec);
          }
        });
        setMedicalData({ OPD: opd, IPD: ipd, Virtual: virtual });
        const hiddenRecords = response.data
          .filter((record) => record.hiddenByPatient)
          .map((record) => record.id);
        updateState({ hiddenIds: hiddenRecords });
      } catch (err) {
        setFetchError("Failed to fetch medical records.");
        console.error("Error fetching medical records:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllRecords();
  }, [user?.email]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const updateState = (updates) => setState((prev) => ({ ...prev, ...updates }));

  const handleViewDetails = (record) => {
    const currentPath = location.pathname;
    let targetPath;
    if (currentPath.startsWith("/medical-record")) {
      targetPath = "/medical-record-details";
    } else if (currentPath.startsWith("/patientdashboard/medical-record")) {
      targetPath = "/patientdashboard/medical-record-details";
    } else {
      targetPath = "/medical-record-details";
    }
    navigate(targetPath, { state: { selectedRecord: record } });
  };

  const handleHideRecord = (id) => {
    updateHideStatus(id, true);
  };

  const handleUnhideRecord = (id) => {
    updateHideStatus(id, false);
  };

  const updateHideStatus = async (recordId, isHidden) => {
    try {
      await axios.put(`https://6895d385039a1a2b28907a16.mockapi.io/pt-mr/patient-mrec/${recordId}`, {
        hiddenByPatient: isHidden
      });
      setMedicalData((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((type) => {
          updated[type] = updated[type].map((record) =>
            record.id === recordId ? { ...record, hiddenByPatient: isHidden } : record
          );
        });
        return updated;
      });
      if (isHidden) {
        updateState({ hiddenIds: [...state.hiddenIds, recordId] });
      } else {
        updateState({ hiddenIds: state.hiddenIds.filter((hiddenId) => hiddenId !== recordId) });
      }
    } catch (error) {
      console.error("Error updating hide status:", error);
      if (isHidden) {
        updateState({ hiddenIds: [...state.hiddenIds, recordId] });
      } else {
        updateState({ hiddenIds: state.hiddenIds.filter((hiddenId) => hiddenId !== recordId) });
      }
    }
  };

  const handleAddRecord = async (formData) => {
    const recordType = formData.type || state.activeTab;
    const newRecord = {
      id: Date.now(),
      ...formData,
      type: recordType,
      patientName: `${user?.firstName || "Guest"} ${user?.lastName || ""}`.trim(),
      age: user?.age ? `${user.age} years` : "N/A",
      sex: user?.gender || "Not specified",
      phone: user?.phone || "Not provided",
      ptemail: user?.email,
      address: user?.address || "Not provided",
      isVerified: false,
      hasDischargeSummary: recordType === "IPD",
      isNewlyAdded: true,
      createdBy: "patient",
      hiddenByPatient: false,
      vitals: {
        bloodPressure: "N/A",
        heartRate: "N/A",
        temperature: "N/A",
        spO2: "N/A",
        respiratoryRate: "N/A",
        height: "N/A",
        weight: "N/A"
      }
    };
    try {
      const response = await axios.post(
        "https://6895d385039a1a2b28907a16.mockapi.io/pt-mr/patient-mrec",
        newRecord
      );
      setMedicalData((prev) => {
        const updated = {
          ...prev,
          [recordType]: [...(Array.isArray(prev[recordType]) ? prev[recordType] : []), response.data]
        };
        return updated;
      });
      updateState({ showAddModal: false });
    } catch (error) {
      console.error("Error adding record:", error);
      setMedicalData((prev) => {
        const updated = {
          ...prev,
          [recordType]: [...(Array.isArray(prev[recordType]) ? prev[recordType] : []), newRecord]
        };
        return updated;
      });
      updateState({ showAddModal: false });
    }
  };

  const createColumns = (type) => {
    const baseFields = {
      OPD: ["hospitalName", "type", "chiefComplaint", "dateOfVisit", "status"],
      IPD: ["hospitalName", "type", "chiefComplaint", "dateOfAdmission", "dateOfDischarge", "status"],
      Virtual: ["hospitalName", "type", "chiefComplaint", "dateOfConsultation", "status"]
    };
    const fieldLabels = {
      hospitalName: "Hospital",
      type: "Type",
      chiefComplaint: "Chief Complaint",
      dateOfVisit: "Date of Visit",
      dateOfAdmission: "Date of Admission",
      dateOfDischarge: "Date of Discharge",
      dateOfConsultation: "Date of Consultation",
      status: "Status"
    };
    const typeColors = { OPD: "purple", IPD: "blue", Virtual: "indigo" };
    return [
      ...baseFields[type].map((key) => ({
        header: fieldLabels[key],
        accessor: key,
        cell: (row) => {
          const hiddenClass = row.isHidden ? "blur-sm opacity-30" : "";
          if (key === "hospitalName") {
            return (
              <div className={`flex items-center gap-1 sm:gap-2 ${hiddenClass}`}>
                {(row.isVerified || row.hasDischargeSummary || row.createdBy === "doctor" || row.uploadedBy === "Doctor") && (
                  <CheckCircle size={14} className="text-green-600" />
                )}
                <button
                  type="button"
                  className="text-[var(--primary-color)] underline hover:text-[var(--accent-color)] font-semibold text-xs sm:text-sm"
                  onClick={() => handleViewDetails(row)}
                >
                  {row.hospitalName}
                </button>
              </div>
            );
          }
          if (key === "type") {
            return (
              <span
                className={`text-xs sm:text-sm font-semibold px-1 sm:px-2 py-0.5 sm:py-1 rounded-full bg-${
                  typeColors[row.type]
                }-100 text-${typeColors[row.type]}-800 ${hiddenClass}`}
              >
                {row.type}
              </span>
            );
          }
          if (key === "status") {
            return (
              <span
                className={`text-xs sm:text-sm font-semibold px-1 sm:px-2 py-0.5 sm:py-1 rounded-full bg-green-100 text-green-800 ${hiddenClass}`}
              >
                {row.status}
              </span>
            );
          }
          return <span className={hiddenClass}>{row[key]}</span>;
        }
      })),
{
  header: "Actions",
  accessor: "actions",
  cell: (row) => (
    <div className="flex items-center gap-1">
      <label className="relative inline-flex items-center cursor-pointer">
        {/* <input
          type="checkbox"
          checked={!row.isHidden}
          onChange={() =>
            row.isHidden ? handleUnhideRecord(row.id) : handleHideRecord(row.id)
          }
          className="sr-only peer"
        /> */}


         <input
          type="checkbox"
          checked={!row.isHidden}
          onChange={() =>
            row.isHidden ? handleUnhideRecord(row.id) : handleHideRecord(row.id)
          }
          className="sr-only peer"
        />
        <div
          className={`w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-teal-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5`}
        ></div>
        <span className="ml-1 text-xs font-medium text-gray-900">
          {/* {row.isHidden ? "Hidden" : "Visible"} */}
        </span>
      </label>
    </div>
  ),
}



    ];
  };

  const getCurrentTabData = () => {
    const records = medicalData[state.activeTab] || [];
    const seen = new Set();
    const uniqueRecords = [];
    records.forEach((record) => {
      const recordKey = `${record.hospitalName}-${record.dateOfVisit}-${record.chiefComplaint}`;
      if (!seen.has(recordKey)) {
        seen.add(recordKey);
        uniqueRecords.push({
          ...record,
          chiefComplaint: record.chiefComplaint || record.diagnosis || "",
          isHidden: state.hiddenIds.includes(record.id),
        });
      }
    });
    return uniqueRecords;
  };

  const getFormFields = (recordType) => [
    {
      name: "hospitalName",
      label: "Hospital Name",
      type: "select",
      options: hospitalOptions,
      loading: apiDataLoading.hospitals
    },
    {
      name: "chiefComplaint",
      label: "Chief Complaint",
      type: "text"
    },
    {
      name: "conditions",
      label: "Medical Conditions",
      type: "multiselect",
      options: medicalConditions,
      loading: apiDataLoading.conditions
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: statusTypes,
      loading: apiDataLoading.status
    },
    ...({
      OPD: [{ name: "dateOfVisit", label: "Date of Visit", type: "date" }],
      IPD: [
        { name: "dateOfAdmission", label: "Date of Admission", type: "date" },
        { name: "dateOfDischarge", label: "Date of Discharge", type: "date" }
      ],
      Virtual: [{ name: "dateOfConsultation", label: "Date of Consultation", type: "date" }]
    }[recordType] || [])
  ];

  const tabs = Object.keys(medicalData).map((key) => ({ label: key, value: key }));

  const filters = [
    {
      key: "hospitalName",
      label: "Hospital",
      options: [
        ...new Set(
          Object.values(medicalData)
            .flatMap((records) => records.map((record) => record.hospitalName))
            .filter((hospital) => hospital)
        )
      ].map((hospital) => ({ value: hospital, label: hospital })),
    },
    {
      key: "status",
      label: "Status",
      options: statusTypes,
    },
  ];

  const isDataLoading = loading || Object.values(apiDataLoading).some((loading) => loading);

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-4">
      {userData && healthId && (
        <div className="bg-gradient-to-r from-[#0e1630] via-[#1b2545] to-[#038358] p-3 sm:p-6 rounded-lg shadow-md max-w-full w-full">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white text-lg sm:text-2xl font-bold text-green-600">
              {userData.firstName.charAt(0)}
              {userData.lastName.charAt(0)}
            </div>
            <div className="ml-0 sm:ml-4 mt-2 sm:mt-0 text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {userData.firstName} {userData.lastName}
              </h2>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 sm:mt-4 justify-center sm:justify-start">
            <div className="text-white text-xs sm:text-sm">
              <p>Gender: {userData.gender || "N/A"}</p>
            </div>
            <div className="text-white text-xs sm:text-sm">
              <p>DOB: {userData.dob || "N/A"}</p>
            </div>
            <div className="text-white text-xs sm:text-sm">
              <p>Health ID: {healthId || "N/A"}</p>
            </div>
            <div className="text-white text-xs sm:text-sm">
              <p>Mobile No: {userData.phone || "N/A"}</p>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <div className="text-center py-4 sm:py-8">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--primary-color)]"></div>
            Loading medical records...
          </div>
        </div>
      ) : fetchError ? (
        <div className="text-center text-red-600 py-4 sm:py-8">
          <p>{fetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
                    <DynamicTable
  columns={createColumns(state.activeTab)}
  data={getCurrentTabData()}
  filters={filters}
  tabs={tabs}
  activeTab={state.activeTab}
  onTabChange={(tab) => updateState({ activeTab: tab })}
  tabActions={[
    {
      label: "Add Record",
      onClick: () => updateState({ showAddModal: true }),
      className: "edit-btn",
    },
  ]}
/>
        </div>
      )}
      <ReusableModal
        isOpen={state.showAddModal}
        onClose={() => updateState({ showAddModal: false })}
        mode="add"
        title="Add Medical Record"
        fields={getFormFields(state.activeTab)}
        data={{}}
        onSave={handleAddRecord}
      />
    </div>
  );
};

export default MedicalRecords;