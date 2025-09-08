


import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import DynamicTable from "../../../../components/microcomponents/DynamicTable";
import ReusableModal from "../../../../components/microcomponents/Modal";
import {
  ArrowLeft,
  Search,
  Plus,
  CheckCircle,
  EyeOff,
  Heart,
  Activity,
  Thermometer,
} from "lucide-react";
import {
  getHospitalDropdown,
  getAllMedicalConditions,
  getAllMedicalStatus,
} from "../../../../utils/masterService";

const DrMedicalRecords = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  // Extract patient data from location.state
  const patientDataFromOPD = location.state?.patientData || location.state || {};
  const patientNameFromOPD = location.state?.patientName || patientDataFromOPD?.name || "";
  const patientEmailFromOPD = location.state?.email || patientDataFromOPD?.email || "";
  const patientPhoneFromOPD = location.state?.phone || patientDataFromOPD?.phone || "";
  const patientGenderFromOPD = location.state?.gender || patientDataFromOPD?.gender || "";
  const patientDobFromOPD = location.state?.dob || patientDataFromOPD?.dob || "";
  const patientAgeFromOPD = location.state?.age || patientDataFromOPD?.age || "";
  const patientDiagnosisFromOPD = location.state?.diagnosis || patientDataFromOPD?.diagnosis || "";
  const patientVisitDateFromOPD = location.state?.dateOfVisit || location.state?.appointmentDate || patientDataFromOPD?.dateOfVisit || patientDataFromOPD?.appointmentDate || "";
  const patientTypeFromOPD = location.state?.type || patientDataFromOPD?.type || "OPD";

  const [state, setState] = useState({
    activeTab: patientTypeFromOPD || "OPD",
    showAddModal: false,
    hiddenIds: [],
  });

  const [medicalData, setMedicalData] = useState({
    OPD: [],
    IPD: [],
    Virtual: [],
  });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [patientDetailsMap, setPatientDetailsMap] = useState({});
  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  const [apiDataLoading, setApiDataLoading] = useState({
    hospitals: false,
    conditions: false,
    status: false,
  });

  const hospitalMap = useMemo(() => {
    const m = {};
    for (const opt of hospitalOptions) {
      m[String(opt.value)] = opt.label;
    }
    return m;
  }, [hospitalOptions]);

  const resolveHospitalLabel = (val) => {
    if (val == null) return "";
    return hospitalMap[String(val)] || String(val);
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const isRecordForSelectedPatient = (record) => {
    const patientEmail = patientEmailFromOPD;
    const patientPhone = patientPhoneFromOPD;
    const recordEmail = record.email || record.patientEmail || record.Email;
    const recordPhone = record.phone || record.phoneNumber || record.Phone;
    return recordEmail === patientEmail || recordPhone === patientPhone;
  };

  useEffect(() => {
    const fetchAllRecords = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await axios.get(
          "https://6895d385039a1a2b28907a16.mockapi.io/pt-mr/patient-mrec"
        );
        const opd = [];
        const ipd = [];
        const virtual = [];
        response.data.forEach((rec) => {
          if (isRecordForSelectedPatient(rec)) {
            if (rec.type === "OPD") opd.push(rec);
            else if (rec.type === "IPD") ipd.push(rec);
            else if (rec.type === "Virtual") virtual.push(rec);
          }
        });
        setMedicalData({ OPD: opd, IPD: ipd, Virtual: virtual });
        await fetchPatientDetailsForRecords([...opd, ...ipd, ...virtual]);
      } catch (err) {
        setFetchError("Failed to fetch medical records.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllRecords();
  }, []);

  const fetchPatientDetailsForRecords = async (records) => {
    const patientMap = {};
    for (const record of records) {
      try {
        const phone = record.phone || record.phoneNumber || record.Phone;
        const email = record.email || record.patientEmail || record.Email;
        const patientId = record.patientId || record.id;
        let patientDetails = null;
        if (phone) {
          try {
            const phoneResponse = await axios.get(
              `https://681f2dfb72e59f922ef5774c.mockapi.io/addpatient?phone=${encodeURIComponent(phone)}`
            );
            if (Array.isArray(phoneResponse.data) && phoneResponse.data.length > 0) {
              patientDetails = phoneResponse.data[0];
            } else if (phoneResponse.data) {
              patientDetails = phoneResponse.data;
            }
          } catch (e) {
            console.log("Phone lookup failed for:", phone);
          }
        }
        if (!patientDetails && email) {
          try {
            const emailResponse = await axios.get(
              `https://681f2dfb72e59f922ef5774c.mockapi.io/addpatient?email=${encodeURIComponent(email)}`
            );
            if (Array.isArray(emailResponse.data) && emailResponse.data.length > 0) {
              patientDetails = emailResponse.data[0];
            } else if (emailResponse.data) {
              patientDetails = emailResponse.data;
            }
          } catch (e) {
            console.log("Email lookup failed for:", email);
          }
        }
        if (!patientDetails && patientId) {
          try {
            const idResponse = await axios.get(
              `https://681f2dfb72e59f922ef5774c.mockapi.io/addpatient?id=${patientId}`
            );
            if (Array.isArray(idResponse.data) && idResponse.data.length > 0) {
              patientDetails = idResponse.data[0];
            } else if (idResponse.data) {
              patientDetails = idResponse.data;
            }
          } catch (e) {
            console.log("ID lookup failed for:", patientId);
          }
        }
        if (patientDetails) {
          patientMap[record.id] = {
            ...patientDetails,
            hospitalName: record.hospitalName,
          };
        }
      } catch (error) {
        console.error("Error fetching patient details for record:", record.id, error);
      }
    }
    setPatientDetailsMap(patientMap);
  };

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

  const updateState = (updates) => setState((prev) => ({ ...prev, ...updates }));

  const handleViewDetails = (record) => {
    const patientDetails = patientDetailsMap[record.id];
    const patientName = patientNameFromOPD || (patientDetails ? `${patientDetails.firstName || ""} ${patientDetails.lastName || ""}`.trim() : record.patientName || record.name || "");
    const email = patientEmailFromOPD || patientDetails?.email || record.email || record.patientEmail || record.Email || "";
    const phone = patientPhoneFromOPD || patientDetails?.phone || record.phone || record.phoneNumber || record.Phone || "";
    const gender = patientGenderFromOPD || patientDetails?.gender || record.gender || record.sex || "";
    const dob = patientDobFromOPD || patientDetails?.dob || record.dob || "";
    const diagnosis = patientDiagnosisFromOPD || patientDetails?.diagnosis || record.diagnosis || record.chiefComplaint || "";
    let firstName, lastName;
    if (patientNameFromOPD) {
      const nameParts = patientNameFromOPD.split(" ");
      firstName = nameParts[0] || "Guest";
      lastName = nameParts.slice(1).join(" ") || "";
    } else if (patientDetails) {
      firstName = patientDetails.firstName || "Guest";
      lastName = patientDetails.lastName || "";
    } else if (record.firstName && record.lastName) {
      firstName = record.firstName;
      lastName = record.lastName;
    } else if (patientName) {
      const nameParts = patientName.split(" ");
      firstName = nameParts[0] || "Guest";
      lastName = nameParts.slice(1).join(" ") || "";
    } else {
      firstName = "Guest";
      lastName = "";
    }
    const patientData = {
      ...record,
      patientName,
      email,
      phone,
      gender,
      id: record.id || record.patientId || "",
      currentDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      currentTime: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      firstName,
      lastName,
      patientDetails,
      opdPatientData: patientDataFromOPD,
      dob,
      diagnosis,
      hospitalName: patientDetails?.hospitalName || record.hospitalName || "AV Hospital",
    };
    navigate("/doctordashboard/medical-record-details", {
      state: {
        selectedRecord: {
          ...patientData,
          isVerified: record.isVerified || false,
          hasDischargeSummary: record.hasDischargeSummary || false,
          phoneConsent: record.phoneConsent || false,
          createdBy: record.createdBy || "patient",
        },
        firstName,
        lastName,
        email,
        phone,
        gender,
        dob,
        diagnosis,
        patientName,
        patientDetails,
        patientPhone: phone,
        patientEmail: email,
        patientId: record.id || record.patientId || "",
        recordType: record.type || state.activeTab,
        opdPatientData: patientDataFromOPD,
        hospitalName: patientDetails?.hospitalName || record.hospitalName || "AV Hospital",
      },
    });
  };

  const handleHideRecord = (id) => {
    updateState({ hiddenIds: [...state.hiddenIds, id] });
  };

  const handleUnhideRecord = (id) => {
    updateState({
      hiddenIds: state.hiddenIds.filter((hiddenId) => hiddenId !== id),
    });
  };

  const handleAddRecord = async (formData) => {
    const recordType = formData.type || state.activeTab;
    const selectedHospital = hospitalOptions.find(
      (o) => String(o.value) === String(formData.hospitalId)
    );
    const userFirstName = user?.firstName || "Guest";
    const userLastName = user?.lastName || "";
    const fullPatientName = `${userFirstName} ${userLastName}`.trim();
    const newRecord = {
      id: Date.now(),
      ...formData,
      hospitalId: selectedHospital?.value ?? formData.hospitalId ?? formData.hospitalName,
      hospitalName: selectedHospital?.label ?? resolveHospitalLabel(formData.hospitalId ?? formData.hospitalName),
      type: recordType,
      patientName: fullPatientName,
      firstName: userFirstName,
      lastName: userLastName,
      age: user?.age ? `${user.age} years` : "N/A",
      sex: user?.gender || "Not specified",
      phone: formData.phoneNumber || user?.phone || "Not provided",
      email: formData.email || user?.email || "Not provided",
      phoneConsent: formData.phoneConsent || false,
      address: user?.address || "Not provided",
      isVerified: true,
      hasDischargeSummary: recordType === "IPD",
      isNewlyAdded: true,
      createdBy: "doctor",
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
      const response = await axios.post(
        "https://6895d385039a1a2b28907a16.mockapi.io/pt-mr/patient-mrec",
        newRecord
      );
      setMedicalData((prev) => ({
        ...prev,
        [recordType]: [...(prev[recordType] || []), response.data],
      }));
      try {
        const phone = newRecord.phone || newRecord.phoneNumber;
        const email = newRecord.email;
        let patientDetails = null;
        if (phone) {
          try {
            const phoneResponse = await axios.get(
              `https://681f2dfb72e59f922ef5774c.mockapi.io/addpatient?phone=${encodeURIComponent(phone)}`
            );
            if (Array.isArray(phoneResponse.data) && phoneResponse.data.length > 0) {
              patientDetails = phoneResponse.data[0];
            }
          } catch (e) {
            console.log("Phone lookup failed for new record");
          }
        }
        if (!patientDetails && email) {
          try {
            const emailResponse = await axios.get(
              `https://681f2dfb72e59f922ef5774c.mockapi.io/addpatient?email=${encodeURIComponent(email)}`
            );
            if (Array.isArray(emailResponse.data) && emailResponse.data.length > 0) {
              patientDetails = emailResponse.data[0];
            }
          } catch (e) {
            console.log("Email lookup failed for new record");
          }
        }
        if (patientDetails) {
          setPatientDetailsMap((prev) => ({
            ...prev,
            [response.data.id]: {
              ...patientDetails,
              hospitalName: newRecord.hospitalName,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching patient details for new record:", error);
      }
      updateState({ showAddModal: false });
      alert("Record added successfully!");
    } catch (error) {
      console.error("Error adding record:", error);
      setMedicalData((prev) => ({
        ...prev,
        [recordType]: [...(prev[recordType] || []), newRecord],
      }));
      updateState({ showAddModal: false });
      alert("Failed to add record. The record has been saved locally.");
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
          if (key === "hospitalName") {
            return (
              <div className="flex items-center gap-2">
                {(row.isVerified === true || row.hasDischargeSummary === true || row.phoneConsent === true || row.createdBy === "doctor") && (
                  <CheckCircle
                    size={16}
                    className="text-green-600"
                    title={
                      row.isVerified ? "Verified record" :
                      row.hasDischargeSummary ? "Has discharge summary" :
                      row.phoneConsent ? "Phone consent given" :
                      "Doctor created record"
                    }
                  />
                )}
                <button
                  type="button"
                  className="text-[var(--primary-color)] underline hover:text-[var(--accent-color)] font-semibold"
                  onClick={() => handleViewDetails(row)}
                >
                  {row.hospitalName}
                </button>
              </div>
            );
          }
          if (key === "type") {
            return (
              <span className={`text-sm font-semibold px-2 py-1 rounded-full bg-${typeColors[row.type]}-100 text-${typeColors[row.type]}-800`}>
                {row.type}
              </span>
            );
          }
          if (key === "status") {
            return (
              <span className="text-sm font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800">
                {row.status}
              </span>
            );
          }
          return <span>{row[key]}</span>;
        },
      })),
      {
        header: "Actions",
        accessor: "actions",
        cell: (row) => (
          <div className="flex gap-2">
            <button
              onClick={() => row.hiddenByPatient ? handleUnhideRecord(row.id) : handleHideRecord(row.id)}
              className={`transition-colors ${row.hiddenByPatient ? "text-green-500 hover:text-green-700" : "text-gray-500 hover:text-red-500"}`}
              title={row.hiddenByPatient ? "Unhide Record" : "Hide Record"}
              type="button"
            >
              <EyeOff size={16} />
            </button>
          </div>
        ),
      },
    ];
  };

  const getCurrentTabData = () =>
    (medicalData[state.activeTab] || [])
      .filter((record) => !record.hiddenByPatient)
      .map((record) => {
        const chiefComplaint = record.chiefComplaint || record.diagnosis || "";
        const displayHospital = resolveHospitalLabel(record.hospitalId ?? record.hospitalName);
        const patientDetails = patientDetailsMap[record.id];
        return {
          ...record,
          hospitalName: displayHospital,
          chiefComplaint,
          displayPatientName: patientDetails ? `${patientDetails.firstName || ""} ${patientDetails.lastName || ""}`.trim() : record.patientName || record.name || "Unknown Patient",
        };
      })
      .sort((a, b) => {
        const dateA = a.dateOfVisit || a.dateOfAdmission || a.dateOfConsultation || "1970-01-01";
        const dateB = b.dateOfVisit || b.dateOfAdmission || b.dateOfConsultation || "1970-01-01";
        return new Date(dateB) - new Date(dateA);
      });

  const getFormFields = (recordType) => [
    {
      name: "hospitalId",
      label: "Hospital Name",
      type: "select",
      options: hospitalOptions,
      loading: apiDataLoading.hospitals,
    },
    { name: "chiefComplaint", label: "Chief Complaint", type: "text" },
    {
      name: "conditions",
      label: "Medical Conditions",
      type: "multiselect",
      options: medicalConditions,
      loading: apiDataLoading.conditions,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: statusTypes,
      loading: apiDataLoading.status,
    },
    ...(recordType === "OPD" ? [{ name: "dateOfVisit", label: "Date of Visit", type: "date" }] : recordType === "IPD" ? [
      { name: "dateOfAdmission", label: "Date of Admission", type: "date" },
      { name: "dateOfDischarge", label: "Date of Discharge", type: "date" },
    ] : [{ name: "dateOfConsultation", label: "Date of Consultation", type: "date" }]),
    {
      name: "phoneNumber",
      label: "Register Phone Number",
      type: "text",
      hasInlineCheckbox: true,
      inlineCheckbox: {
        name: "phoneConsent",
        label: "Sync with patient number",
      },
    },
  ];

  const tabs = Object.keys(medicalData).map((key) => ({
    label: key,
    value: key,
  }));

  const filters = [
    {
      key: "hospitalName",
      label: "Hospital",
      options: [
        ...new Set(
          Object.values(medicalData)
            .flatMap((records) =>
              records.map((r) =>
                resolveHospitalLabel(r.hospitalId ?? r.hospitalName)
              )
            )
            .filter(Boolean)
        ),
      ].map((label) => ({ value: label, label })),
    },
    {
      key: "status",
      label: "Status",
      options: statusTypes,
    },
  ];

  const selectedRecord = location.state?.selectedRecord || location.state || null;

  const tabActions = [
    {
      label: (
        <div className="flex items-center gap-1">
          <Plus size={16} className="sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-xs">Add Record</span>
        </div>
      ),
      onClick: () => updateState({ showAddModal: true }),
      className: "btn btn-primary w-full sm:w-auto py-1 px-2 sm:py-2 sm:px-9 text-xs sm:text-sm",
    },
  ];

  const getConsentStats = () => {
    const allRecords = Object.values(medicalData).flat();
    const visibleToDoctor = allRecords.filter((record) => !record.hiddenByPatient);
    const verifiedRecords = visibleToDoctor.filter(
      (record) => record.isVerified === true || record.hasDischargeSummary === true || record.phoneConsent === true || record.createdBy === "doctor"
    );
    const totalRecords = visibleToDoctor.length;
    return {
      withConsent: verifiedRecords.length,
      visible: visibleToDoctor.length,
      total: totalRecords,
      percentage: totalRecords > 0 ? Math.round((visibleToDoctor.length / totalRecords) * 100) : 0,
    };
  };

  const consentStats = getConsentStats();

  // Helper function to format visit date based on record type
  const getVisitDate = (record) => {
    const type = record?.type || patientTypeFromOPD;
    if (type === "OPD") {
      return record?.dateOfVisit || patientVisitDateFromOPD || "--";
    } else if (type === "IPD") {
      return record?.dateOfAdmission || patientDataFromOPD?.admissionDate || "--";
    } else {
      return record?.dateOfConsultation || patientDataFromOPD?.dateOfConsultation || "--";
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Back Button */}
      <button
        className="mb-4 inline-flex items-center text-sm sm:text-base"
        onClick={() => navigate("/doctordashboard/patients")}
      >
        <ArrowLeft size={18} className="sm:h-5 sm:w-5" />
        <span className="ms-2 font-medium">Back to Patient List</span>
      </button>

      {/* Patient Header */}
      {(selectedRecord || patientDataFromOPD) && (
        <div className="bg-gradient-to-r from-[#01B07A] to-[#1A223F] rounded-xl p-3 sm:p-6 mb-6 text-white">
     
     <div className="flex flex-col items-center gap-2 md:hidden w-full">

  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-[#01B07A] text-xs font-bold uppercase shadow-inner ring-2 ring-white ring-offset-1">
    {getInitials(patientNameFromOPD || selectedRecord?.patientName || selectedRecord?.name || "")}
  </div>


  <h3 className="text-sm font-bold truncate text-center w-full ">
    {patientNameFromOPD || selectedRecord?.patientName || selectedRecord?.name || "--"}
  </h3>
{/* <div className="w-full flex justify-center">
  <div className="grid grid-cols-[120px_1fr] gap-y-2 gap-x-1 text-xs max-w-lg w-full py-2 rounded-lg shadow-sm">
    
    <p className="font-semibold text-left ml-10">Age:</p>
    <p>{patientAgeFromOPD || selectedRecord?.age || "35 year"}</p>

    <p className="font-semibold text-left  ml-10">Gender:</p>
    <p className="break-words">{patientGenderFromOPD || selectedRecord?.gender || selectedRecord?.sex || "--"}</p>

    <p className="font-semibold text-left  ml-10">Hospital:</p>
    <p className="break-words  mr-4">{selectedRecord?.hospitalName || patientDataFromOPD?.hospitalName || "AV Hospital"}</p>

    <p className="font-semibold text-left  ml-10">Visit Date:</p>
    <p>{getVisitDate(selectedRecord || patientDataFromOPD || "23/10/2025")}</p>

    <p className="font-semibold text-left  ml-10">Diagnosis:</p>
    <p className="break-words">{patientDiagnosisFromOPD || selectedRecord?.diagnosis || selectedRecord?.chiefComplaint || "Fever"}</p>

    <p className="font-semibold text-left  ml-10">K/C/O:</p>
    <p className="break-words me-4">{selectedRecord?.["K/C/O"] || "--"}</p>

    {(selectedRecord?.type === "IPD" || patientTypeFromOPD === "IPD") && (
      <>
        <p className="font-semibold text-left">Ward Type:</p>
        <p>{selectedRecord?.wardType || patientDataFromOPD?.wardType || "--"}</p>
      </>
    )}
  </div>
</div> */}


<div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs w-full ps-2">
  <div className="col-span-2 grid grid-cols-2">
    <p className="">
      <span className="font-semibold">Age:</span> {patientAgeFromOPD || selectedRecord?.age || "35 year"}
    </p>
    <p className="break-words">
      <span className="font-semibold">Gender:</span> {patientGenderFromOPD || selectedRecord?.gender || selectedRecord?.sex || "--"}
    </p>
  </div>
  <div className="col-span-2 grid grid-cols-2">
    <p className="break-words">
      <span className="font-semibold">Hospital:</span> {selectedRecord?.hospitalName || patientDataFromOPD?.hospitalName || "AV Hospital"}
    </p>
    <p className="break-words">
      <span className="font-semibold">Visit Date:</span> {getVisitDate(selectedRecord || patientDataFromOPD || "23/10/2025")}
    </p>
  </div>
  <div className="col-span-2 grid grid-cols-2">
    <p className="break-words">
      <span className="font-semibold">Diagnosis:</span> {patientDiagnosisFromOPD || selectedRecord?.diagnosis || selectedRecord?.chiefComplaint || "Fever"}
    </p>
    <p className="break-words">
      <span className="font-semibold">K/C/O:</span> {selectedRecord?.["K/C/O"] || "--"}
    </p>
  </div>
  {(selectedRecord?.type === "IPD" || patientTypeFromOPD === "IPD") && (
    <p className="col-span-2 truncate">
      <span className="font-semibold">Ward Type:</span> {selectedRecord?.wardType || patientDataFromOPD?.wardType || "--"}
    </p>
  )}
</div>

  
  {/* <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs w-full ps-2 ">
    <div className="col-span-2 grid grid-cols-2 ">
      <p className="">
        <span className="font-semibold">Age:</span> {patientAgeFromOPD || selectedRecord?.age || "35 year"}
      </p>
      <p className="break-words">
        <span className="font-semibold">Gender:</span> {patientGenderFromOPD || selectedRecord?.gender || selectedRecord?.sex || "--"}
      </p>
    </div>

 <div className="col-span-2 grid grid-cols-2 ">
  <p className="break-words">
    <span className="font-semibold">Hospital:</span> {selectedRecord?.hospitalName || patientDataFromOPD?.hospitalName || "AV Hospital"}
  </p>
  <p className="break-words">
    <span className="font-semibold">Visit Date:</span> {getVisitDate(selectedRecord || patientDataFromOPD || "23/10/2025")}
  </p>
</div>


    <div className="col-span-2 grid grid-cols-2">
      <p className="break-words">
        <span className="font-semibold">Diagnosis:</span> {patientDiagnosisFromOPD || selectedRecord?.diagnosis || selectedRecord?.chiefComplaint || "Fever"}
      </p>
      <p className="break-words">
        <span className="font-semibold">K/C/O:</span> {selectedRecord?.["K/C/O"] || "--"}
      </p>
    </div>

    {(selectedRecord?.type === "IPD" || patientTypeFromOPD === "IPD") && (
      <p className="col-span-2 truncate">
        <span className="font-semibold">Ward Type:</span> {selectedRecord?.wardType || patientDataFromOPD?.wardType || "--"}
      </p>
    )}
  </div> */}
  
</div>



          {/* Tablet View (iPad) */}
          <div className="hidden md:grid lg:hidden grid-cols-1 gap-2">
            {/* Avatar + Name */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-[#01B07A] text-lg font-bold uppercase shadow-inner ring-4 ring-white ring-offset-2">
                {getInitials(patientNameFromOPD || selectedRecord?.patientName || selectedRecord?.name || "")}
              </div>
              <h3 className="text-lg font-bold truncate">
                {patientNameFromOPD || selectedRecord?.patientName || selectedRecord?.name || "--"}
              </h3>
            </div>
            {/* Details grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 ml-14 text-sm">
              <p><span className="font-semibold">Age:</span> {patientAgeFromOPD || selectedRecord?.age || "36 year old"}</p>
              <p><span className="font-semibold">Gender:</span> {patientGenderFromOPD || selectedRecord?.gender || selectedRecord?.sex || "--"}</p>
              <p><span className="font-semibold">Hospital:</span> {selectedRecord?.hospitalName || patientDataFromOPD?.hospitalName || "AV Hospital"}</p>
              <p><span className="font-semibold">Visit Date:</span> {getVisitDate(selectedRecord || patientDataFromOPD)}</p>
              {(selectedRecord?.type === "IPD" || patientTypeFromOPD === "IPD") && (
                <p><span className="font-semibold">Ward Type:</span> {selectedRecord?.wardType || patientDataFromOPD?.wardType || "--"}</p>
              )}
              <p><span className="font-semibold">Diagnosis:</span> {patientDiagnosisFromOPD || selectedRecord?.diagnosis || selectedRecord?.chiefComplaint || "--"}</p>
              <p><span className="font-semibold">K/C/O:</span> {selectedRecord?.["K/C/O"] || "--"}</p>
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden lg:flex flex-row sm:items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0 flex justify-start">
              <div className="h-20 w-20 flex items-center justify-center rounded-full bg-white text-[#01B07A] text-2xl font-bold uppercase shadow-inner ring-4 ring-white ring-offset-2">
                {getInitials(patientNameFromOPD || selectedRecord?.patientName || selectedRecord?.name || "")}
              </div>
            </div>
            {/* Name + Details */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3 truncate">
                {patientNameFromOPD || selectedRecord?.patientName || selectedRecord?.name || "--"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6 text-base">
                <div>
                  <p><span className="font-semibold">Age:</span> {patientAgeFromOPD || selectedRecord?.age || "--"}</p>
                  <p><span className="font-semibold">Gender:</span> {patientGenderFromOPD || selectedRecord?.gender || selectedRecord?.sex || "--"}</p>
                </div>
                <div>
                  <p><span className="font-semibold">Hospital:</span> {selectedRecord?.hospitalName || patientDataFromOPD?.hospitalName || "AV Hospital"}</p>
                  <p><span className="font-semibold">Visit Date:</span> {getVisitDate(selectedRecord || patientDataFromOPD)}</p>
                  {(selectedRecord?.type === "IPD" || patientTypeFromOPD === "IPD") && (
                    <p><span className="font-semibold">Ward Type:</span> {selectedRecord?.wardType || patientDataFromOPD?.wardType || "--"}</p>
                  )}
                </div>
                <div>
                  <p><span className="font-semibold">Diagnosis:</span> {patientDiagnosisFromOPD || selectedRecord?.diagnosis || selectedRecord?.chiefComplaint || "--"}</p>
                  <p><span className="font-semibold">K/C/O:</span> {selectedRecord?.["K/C/O"] || "--"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Medical Records Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <Search size={20} className="text-[var(--primary-color)] sm:h-6 sm:w-6" />
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Medical Records History</h2>
          </div>
        </div>
      </div>

      {/* Dynamic Table */}
      <div className="overflow-x-auto">
        <DynamicTable
          columns={createColumns(state.activeTab)}
          data={getCurrentTabData()}
          filters={filters}
          tabs={tabs}
          tabActions={tabActions}
          activeTab={state.activeTab}
          onTabChange={(tab) => updateState({ activeTab: tab })}
        />
      </div>

      {/* Loading/Error/Empty States */}
      {loading && (
        <div className="text-center py-6 sm:py-8">
          <p className="text-sm sm:text-base">Loading medical records...</p>
        </div>
      )}
      {fetchError && (
        <div className="text-center text-red-600 py-6 sm:py-8">
          <p className="text-sm sm:text-base">{fetchError}</p>
        </div>
      )}
      {getCurrentTabData().length === 0 && !loading && !fetchError && (
        <div className="text-center py-6 sm:py-8 text-gray-600">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <CheckCircle size={36} className="text-gray-400 sm:h-10 sm:w-10" />
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">No Accessible Medical Records</h3>
              <p className="text-xs sm:text-sm">No medical records found for this patient in the selected category.</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
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

export default DrMedicalRecords;