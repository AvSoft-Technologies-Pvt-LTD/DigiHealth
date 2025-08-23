//medicalRecords.jsx
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
  
  // State management
  const [state, setState] = useState({ activeTab: "OPD", showAddModal: false, hiddenIds: [] });
  const [medicalData, setMedicalData] = useState({ OPD: [], IPD: [], Virtual: [] });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  
  // API data states
  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  const [apiDataLoading, setApiDataLoading] = useState({
    hospitals: false,
    conditions: false,
    status: false
  });

  // Fetch master data from APIs
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        // Fetch hospitals dropdown
        setApiDataLoading(prev => ({ ...prev, hospitals: true }));
        const hospitalsResponse = await getHospitalDropdown();
        const hospitalsList = hospitalsResponse.data?.map(hospital => ({
          label: hospital.name || hospital.hospitalName || hospital.label,
          value: hospital.name || hospital.hospitalName || hospital.value || hospital.id
        })) || [];
        setHospitalOptions(hospitalsList);
        setApiDataLoading(prev => ({ ...prev, hospitals: false }));

        // Fetch medical conditions
        setApiDataLoading(prev => ({ ...prev, conditions: true }));
        const conditionsResponse = await getAllMedicalConditions();
        const conditionsList = conditionsResponse.data?.map(condition => ({
          label: condition.name || condition.conditionName || condition.label,
          value: condition.name || condition.conditionName || condition.value || condition.id
        })) || [];
        setMedicalConditions(conditionsList);
        setApiDataLoading(prev => ({ ...prev, conditions: false }));

        // Fetch medical status
        setApiDataLoading(prev => ({ ...prev, status: true }));
        const statusResponse = await getAllMedicalStatus();
        const statusList = statusResponse.data?.map(status => ({
          label: status.name || status.statusName || status.label,
          value: status.name || status.statusName || status.value || status.id
        })) || [];
        setStatusTypes(statusList);
        setApiDataLoading(prev => ({ ...prev, status: false }));

      } catch (error) {
        console.error("Error fetching master data:", error);
        
        // Fallback to default data if API fails
        setHospitalOptions([
          { label: "AIIMS Delhi", value: "AIIMS Delhi" },
          { label: "Fortis Hospital, Gurgaon", value: "Fortis Hospital, Gurgaon" },
          { label: "Apollo Hospital, Chennai", value: "Apollo Hospital, Chennai" },
          { label: "Medanta – The Medicity, Gurgaon", value: "Medanta – The Medicity, Gurgaon" },
          { label: "Max Super Speciality Hospital, Delhi", value: "Max Super Speciality Hospital, Delhi" }
        ]);
        
        setMedicalConditions([
          { label: "Diabetic Disease", value: "Diabetic" },
          { label: "BP (Blood Pressure)", value: "BP" },
          { label: "Heart Disease", value: "Heart" },
          { label: "Asthma Disease", value: "Asthma" },
        ]);
        
        setStatusTypes([
          { label: "Active", value: "Active" },
          { label: "Treated", value: "Treated" },
          { label: "Recovered", value: "Recovered" },
          { label: "Discharged", value: "Discharged" },
          { label: "Consulted", value: "Consulted" }
        ]);
      } finally {
        setApiDataLoading(prev => ({ hospitals: false, conditions: false, status: false }));
      }
    };

    fetchMasterData();
  }, []);

  // Fetch medical records data
  useEffect(() => {
    const fetchAllRecords = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await axios.get("https://6895d385039a1a2b28907a16.mockapi.io/pt-mr/patient-mrec");
        const opd = [];
        const ipd = [];
        const virtual = [];
        
        response.data.forEach((rec) => {
          if (rec.type === "OPD") opd.push(rec);
          else if (rec.type === "IPD") ipd.push(rec);
          else if (rec.type === "Virtual") virtual.push(rec);
        });
        
        setMedicalData({ OPD: opd, IPD: ipd, Virtual: virtual });
        const hiddenRecords = response.data.filter((record) => record.hiddenByPatient).map((record) => record.id);
        updateState({ hiddenIds: hiddenRecords });
      } catch (err) {
        setFetchError("Failed to fetch medical records.");
        console.error("Error fetching medical records:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllRecords();
  }, []);

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

  const handleHideRecord = (id) => { updateHideStatus(id, true); };
  const handleUnhideRecord = (id) => { updateHideStatus(id, false); };

  const updateHideStatus = async (recordId, isHidden) => {
    try {
      await axios.put(`https://6895d385039a1a2b28907a16.mockapi.io/pt-mr/patient-mrec/${recordId}`, { hiddenByPatient: isHidden });
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
      // Fallback update for UI consistency
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
      address: user?.address || "Not provided",
      isVerified: formData.uploadedBy === "Doctor",
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
        weight: "N/A",
      },
    };

    try {
      const response = await axios.post("https://6895d385039a1a2b28907a16.mockapi.io/pt-mr/patient-mrec", newRecord);
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
      // Fallback - add locally if API fails
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
      Virtual: ["hospitalName", "type", "chiefComplaint", "dateOfConsultation", "status"],
    };
    
    const fieldLabels = {
      hospitalName: "Hospital",
      type: "Type",
      chiefComplaint: "Chief Complaint",
      dateOfVisit: "Date of Visit",
      dateOfAdmission: "Date of Admission",
      dateOfDischarge: "Date of Discharge",
      dateOfConsultation: "Date of Consultation",
      status: "Status",
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
                {(row.isVerified || row.hasDischargeSummary) && (
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
              <span className={`text-xs sm:text-sm font-semibold px-1 sm:px-2 py-0.5 sm:py-1 rounded-full bg-${typeColors[row.type]}-100 text-${typeColors[row.type]}-800 ${hiddenClass}`}>
                {row.type}
              </span>
            );
          }
          
          if (key === "status") {
            return (
              <span className={`text-xs sm:text-sm font-semibold px-1 sm:px-2 py-0.5 sm:py-1 rounded-full bg-green-100 text-green-800 ${hiddenClass}`}>
                {row.status}
              </span>
            );
          }
          
          return <span className={hiddenClass}>{row[key]}</span>;
        },
      })),
      {
        header: "Actions",
        accessor: "actions",
        cell: (row) => (
          <div className="flex gap-1 sm:gap-2">
            <button 
              onClick={() => row.isHidden ? handleUnhideRecord(row.id) : handleHideRecord(row.id)}
              className={`transition-colors ${row.isHidden ? "text-green-500 hover:text-green-700" : "text-gray-500 hover:text-red-500"}`}
              title={row.isHidden ? "Unhide Record" : "Hide Record"}
              type="button"
            >
              <EyeOff size={14} />
            </button>
          </div>
        ),
      },
    ];
  };

  const getCurrentTabData = () => 
    (medicalData[state.activeTab] || []).map((record) => {
      const chiefComplaint = record.chiefComplaint || record.diagnosis || "";
      return { 
        ...record, 
        chiefComplaint, 
        isHidden: state.hiddenIds.includes(record.id) 
      };
    });

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
        { name: "dateOfDischarge", label: "Date of Discharge", type: "date" },
      ],
      Virtual: [{ name: "dateOfConsultation", label: "Date of Consultation", type: "date" }],
    }[recordType] || []),
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
        )
      ].map((hospital) => ({ value: hospital, label: hospital })),
    },
    { 
      key: "status", 
      label: "Status", 
      options: statusTypes
    },
  ];

  const isDataLoading = loading || Object.values(apiDataLoading).some(loading => loading);

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-4">
      {userData && healthId && (
        <div className="bg-gradient-to-r from-[#0e1630] via-[#1b2545] to-[#038358] p-3 sm:p-6 rounded-lg shadow-md max-w-full w-full">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white text-lg sm:text-2xl font-bold text-green-600">
              {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
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
      
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search size={18} className="text-[var(--primary-color)]" />
          <h2 className="text-lg sm:text-xl font-bold">Medical Records History</h2>
        </div>
        <button 
          onClick={() => updateState({ showAddModal: true })} 
          className="btn btn-primary flex items-center gap-1 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm mt-2 sm:mt-0"
          disabled={isDataLoading}
        >
          <Plus size={14} /> Add Record
        </button>
      </div>
      
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