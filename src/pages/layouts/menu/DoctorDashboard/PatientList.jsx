//patientlist.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OPDTab from "./OPDTab";
import IPDTab from "./IPDTab";
import VirtualTab from "./VirtualTab";
import ReusableModal from "../../../../components/microcomponents/Modal";
import axios from "axios";

const DEFAULT_DOCTOR_NAME = "Dr.Sheetal S. Shelke";
const OPT = {
  GENDER: ["Female", "Male", "Other"],
  BLOOD: ["A+", "B+", "O+", "AB+"],
  OCC: ["Doctor", "Engineer", "Teacher", "Student", "Retired"],
  DEPT: [
    "General Medicine",
    "Surgery",
    "Cardiology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
  ],
  INS: ["None", "CGHS", "ESIC", "Private Insurance", "Other"],
  STATUS: ["Admitted", "Discharged"],
  SURGERY: ["No", "Yes"],
};
const API = {
  FORM: "https://681f2dfb72e59f922ef5774c.mockapi.io/addpatient",
  HD: "https://680cc0c92ea307e081d4edda.mockapi.io/personalHealthDetails",
  FD: "https://6808fb0f942707d722e09f1d.mockapi.io/FamilyData",
  HS: "https://6808fb0f942707d722e09f1d.mockapi.io/health-summary",
};
const WARD_TYPES = [
  "General",
  "Semi-Private",
  "Private",
  "Deluxe",
  "ICU",
  "ICCU",
  "Special Wards",
];
const WARD_NUMBERS = ["A", "B", "C", "D", "E"];
const BED_NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const PATIENT_BASIC_FIELDS = [
  { name: "firstName", label: "First Name", type: "text", required: true },
  { name: "middleName", label: "Middle Name", type: "text" },
  { name: "lastName", label: "Last Name", type: "text", required: true },
  { name: "phone", label: "Phone Number", type: "text", required: true },
  { name: "email", label: "Email Address", type: "email", required: true },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    required: true,
    options: OPT.GENDER.map((g) => ({ value: g, label: g })),
  },
  { name: "dob", label: "Date of Birth", type: "date", required: true },
  {
    name: "bloodGroup",
    label: "Blood Group",
    type: "select",
    options: OPT.BLOOD.map((b) => ({ value: b, label: b })),
  },
  {
    name: "occupation",
    label: "Occupation",
    type: "select",
    required: true,
    options: OPT.OCC.map((o) => ({ value: o, label: o })),
  },
  {
    name: "addressPerm",
    label: "Permanent Address",
    type: "textarea",
    required: true,
    colSpan: 1.5, // Half width for side-by-side display
  },
  {
    name: "addressTemp",
    label: "Temporary Address",
    type: "textarea",
    required: true,
    colSpan: 1.5, // Half width for side-by-side display
  },
  {
    name: "sameAsPermAddress",
    label: "Same as Permanent Address",
    type: "checkbox",
    colSpan: 3, // Full width below address fields
  },
  {
    name: "password",
    label: "Create Password",
    type: "password",
    required: true,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    required: true,
  },
];

const APPOINTMENT_FIELDS = [
  { name: "date", label: "Appointment Date", type: "date", required: true },
  { name: "time", label: "Appointment Time", type: "time", required: true },
  { name: "diagnosis", label: "Diagnosis", type: "text", required: true },
  {
    name: "reason",
    label: "Reason for Visit",
    type: "select",
    required: true,
    options: [
      { value: "Consultation", label: "Consultation" },
      { value: "Follow-up", label: "Follow-up" },
      { value: "Test", label: "Test" },
      { value: "Other", label: "Other" },
    ],
  },
];

const IPD_DETAILS_FIELDS = [
  {
    name: "admissionDate",
    label: "Admission Date",
    type: "date",
    required: true,
  },
  {
    name: "admissionTime",
    label: "Admission Time",
    type: "time",
    required: true,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: OPT.STATUS.map((s) => ({ value: s, label: s })),
  },
  {
    name: "wardType",
    label: "Ward Type",
    type: "select",
    required: true,
    options: WARD_TYPES.map((w) => ({ value: w, label: w })),
  },
  {
    name: "wardNumber",
    label: "Ward Number",
    type: "select",
    required: true,
    options: WARD_NUMBERS.map((w) => ({ value: w, label: w })),
  },
  {
    name: "bedNumber",
    label: "Bed Number",
    type: "select",
    required: true,
    options: BED_NUMBERS.map((b) => ({ value: b, label: b })),
  },
  {
    name: "department",
    label: "Department",
    type: "select",
    required: true,
    options: OPT.DEPT.map((d) => ({ value: d, label: d })),
  },
  {
    name: "insuranceType",
    label: "Insurance Type",
    type: "select",
    required: true,
    options: OPT.INS.map((i) => ({ value: i, label: i })),
  },
  {
    name: "surgeryRequired",
    label: "Surgery Required",
    type: "select",
    options: OPT.SURGERY.map((s) => ({ value: s, label: s })),
  },
  { name: "dischargeDate", label: "Discharge Date", type: "date" },
  { name: "diagnosis", label: "Diagnosis", type: "text" },
  {
    name: "reasonForAdmission",
    label: "Reason For Admission",
    type: "textarea",
    colSpan: 2,
  },
];

const CONSULTATION_FIELDS = [
  { name: "firstName", label: "First Name", type: "text", required: true },
  { name: "lastName", label: "Last Name", type: "text", required: true },
  { name: "email", label: "Email Address", type: "email", required: true },
  { name: "phone", label: "Phone Number", type: "text", required: true },
  {
    name: "consultationType",
    label: "Consultation Type",
    type: "select",
    required: true,
    options: [
      { value: "Video Call", label: "Video Call" },
      { value: "Voice Call", label: "Voice Call" },
      { value: "Chat", label: "Chat" },
    ],
  },
  {
    name: "scheduledDate",
    label: "Scheduled Date",
    type: "date",
    required: true,
  },
  {
    name: "scheduledTime",
    label: "Scheduled Time",
    type: "time",
    required: true,
  },
  {
    name: "duration",
    label: "Duration (minutes)",
    type: "number",
    required: true,
  },
  { name: "notes", label: "Consultation Notes", type: "textarea", colSpan: 2 },
];

function getCurrentDate() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentTime() {
  return new Date().toTimeString().slice(0, 5);
}

function to24Hour(t) {
  if (!t.includes("AM") && !t.includes("PM")) return t;
  let [time, mod] = t.trim().split(" ");
  let [h, m] = time.split(":").map(Number);
  if (mod === "PM" && h !== 12) h += 12;
  if (mod === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function PatientList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("OPD");
  const [patients, setPatients] = useState([]);
  const [ipdPatients, setIpdPatients] = useState([]);
  const [virtualPatients, setVirtualPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPatientId, setNewPatientId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modals, setModals] = useState({
    addPatient: false,
    appointment: false,
    ipdDetails: false,
    scheduleConsultation: false,
    viewPatient: false,
    editPatient: false,
  });
  const [patientFormData, setPatientFormData] = useState({});
  const [appointmentFormData, setAppointmentFormData] = useState({
    date: getCurrentDate(),
    time: getCurrentTime(),
  });
  const [ipdFormData, setIpdFormData] = useState({
    admissionDate: getCurrentDate(),
    admissionTime: getCurrentTime(),
  });
  const [consultationFormData, setConsultationFormData] = useState({
    scheduledDate: getCurrentDate(),
    scheduledTime: getCurrentTime(),
    duration: 30,
  });
  const [patientIdInput, setPatientIdInput] = useState("");
  const tabs = [
    { label: "OPD", value: "OPD" },
    { label: "IPD", value: "IPD" },
    { label: "Virtual", value: "Virtual" },
  ];

  useEffect(() => {
    fetchAllPatients();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get("tab");
    if (tab) {
      setActiveTab(tab.charAt(0).toUpperCase() + tab.slice(1));
    }
  }, [location.search]);

  const fetchAllPatients = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API.FORM);
      const allPatients = res.data
        .map((p) => ({
          ...p,
          name:
            p.name ||
            [p.firstName, p.middleName, p.lastName].filter(Boolean).join(" "),
          fullName: [p.firstName, p.middleName, p.lastName]
            .filter(Boolean)
            .join(" "),
        }))
        .reverse();

      const opdData = allPatients.filter(
        (p) =>
          (!p.type || p.type.toLowerCase() === "opd") &&
          p.doctorName === DEFAULT_DOCTOR_NAME
      );
      const ipdData = allPatients.filter(
        (p) => p.type?.toLowerCase() === "ipd"
      );
      const virtualData = allPatients.filter(
        (p) => p.type?.toLowerCase() === "virtual" || p.consultationType
      );

      // Add sequential IDs for each type
      setPatients(
        opdData.map((p, index) => ({
          ...p,
          sequentialId: index + 1, // Sequential ID for OPD
          datetime:
            p.appointmentDate && p.appointmentTime
              ? `${p.appointmentDate} ${p.appointmentTime}`
              : "Not scheduled",
          temporaryAddress:
            p.temporaryAddress || p.addressTemp || p.address || "",
          address: p.address || p.temporaryAddress || p.addressTemp || "",
          addressTemp: p.addressTemp || p.temporaryAddress || p.address || "",
          diagnosis: p.diagnosis || "Not specified",
          reason: p.reason || "General consultation",
        }))
      );

      setIpdPatients(
        ipdData.map((p, index) => ({
          ...p,
          sequentialId: index + 1, // Sequential ID for IPD
          wardNo: p.wardNumber || p.wardNo,
          bedNo: p.bedNumber || p.bedNo,
          // Combined ward field for display: WardType-WardNo-BedNo
          ward: `${p.wardType || "N/A"}-${p.wardNumber || p.wardNo || "N/A"}-${
            p.bedNumber || p.bedNo || "N/A"
          }`,
          temporaryAddress:
            p.temporaryAddress || p.addressTemp || p.address || "",
          address: p.address || p.temporaryAddress || p.addressTemp || "",
          addressTemp: p.addressTemp || p.temporaryAddress || p.address || "",
          status: p.status || "Admitted",
          diagnosis: p.diagnosis || "Under evaluation",
          admissionDate: p.admissionDate || "Not specified",
          department: p.department || "General Medicine",
        }))
      );

      setVirtualPatients(
        virtualData.map((p, index) => ({
          ...p,
          sequentialId: index + 1, // Sequential ID for Virtual
          scheduledDateTime:
            p.scheduledDateTime ||
            (p.scheduledDate && p.scheduledTime
              ? `${p.scheduledDate} ${p.scheduledTime}`
              : "Not scheduled"),
          consultationStatus: p.consultationStatus || "Scheduled",
          duration: p.duration || 30,
          temporaryAddress:
            p.temporaryAddress || p.addressTemp || p.address || "",
          address: p.address || p.temporaryAddress || p.addressTemp || "",
          addressTemp: p.addressTemp || p.temporaryAddress || p.address || "",
          consultationType: p.consultationType || "Video Call",
        }))
      );
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    setNewPatientId(null);
    navigate(`/doctordashboard/patients?tab=${tabValue}`);
  };

  const openModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
    if (modalName === "addPatient") {
      setPatientFormData({});
      setPatientIdInput("");
    }
    if (modalName === "appointment") {
      setAppointmentFormData({
        date: getCurrentDate(),
        time: getCurrentTime(),
      });
    }
    if (modalName === "ipdDetails") {
      setIpdFormData({
        admissionDate: getCurrentDate(),
        admissionTime: getCurrentTime(),
      });
    }
    if (modalName === "scheduleConsultation") {
      setConsultationFormData({
        scheduledDate: getCurrentDate(),
        scheduledTime: getCurrentTime(),
        duration: 30,
      });
    }
    if (modalName === "viewPatient" || modalName === "editPatient") {
      setSelectedPatient(null);
    }
  };

  const handleFetchPatientDetails = async () => {
    if (!patientIdInput.trim()) {
      toast.error("Please enter a Patient ID");
      return;
    }
    try {
      const data = await (await fetch(API.FORM)).json();
      const found = data.find(
        (p) => (p.id || "").toString() === patientIdInput.trim()
      );
      if (found) {
        setPatientFormData({
          ...found,
          name: `${found.firstName || ""} ${found.middleName || ""} ${
            found.lastName || ""
          }`.trim(),
          addressPerm: found.permanentAddress || "",
          addressTemp: found.temporaryAddress || "",
        });
        toast.success(`${found.type || "Patient"} details loaded!`);
      } else {
        toast.info("No patient found with this ID.");
      }
    } catch {
      toast.error("Failed to fetch patient");
    }
  };

  const handlePatientFormChange = (formData) => {
    // Handle "Same as Permanent Address" checkbox
    if (formData.sameAsPermAddress && formData.addressPerm) {
      formData.addressTemp = formData.addressPerm;
    }
    setPatientFormData(formData);
  };

  const handleIPDFormChange = (formData) => {
    setIpdFormData(formData);
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    openModal("viewPatient");
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setPatientFormData({
      ...patient,
      addressPerm: patient.permanentAddress || patient.addressPerm || "",
      addressTemp: patient.temporaryAddress || patient.addressTemp || "",
    });
    if (activeTab === "IPD") {
      setIpdFormData({
        ...patient,
        wardType: patient.wardType || "",
        wardNumber: patient.wardNumber || patient.wardNo || "",
        bedNumber: patient.bedNumber || patient.bedNo || "",
      });
    }
    closeModal("viewPatient");
    openModal("editPatient");
  };

  const handleUpdatePatient = async (formData) => {
    try {
      let payload = {
        ...formData,
        name: `${formData.firstName || ""} ${formData.middleName || ""} ${
          formData.lastName || ""
        }`.trim(),
        permanentAddress: formData.addressPerm,
        temporaryAddress: formData.addressTemp,
        updatedAt: new Date().toISOString(),
      };

      if (activeTab === "IPD") {
        payload = {
          ...payload,
          ...ipdFormData,
          admissionTime: to24Hour(ipdFormData.admissionTime),
          wardNo: ipdFormData.wardNumber,
          bedNo: ipdFormData.bedNumber,
        };
      }

      await axios.put(`${API.FORM}/${selectedPatient.id}`, payload);
      toast.success("Patient updated successfully!");
      closeModal("editPatient");
      fetchAllPatients();
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error("Failed to update patient");
    }
  };

  const handleSavePatient = async (formData) => {
    try {
      const payload = {
        ...formData,
        name: `${formData.firstName || ""} ${formData.middleName || ""} ${
          formData.lastName || ""
        }`.trim(),
        permanentAddress: formData.addressPerm,
        temporaryAddress: formData.addressTemp,
        type: activeTab.toLowerCase(),
        doctorName: DEFAULT_DOCTOR_NAME,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const response = await axios.post(API.FORM, payload);
      setNewPatientId(response.data.id);
      toast.success("Patient details saved!");
      closeModal("addPatient");
      if (activeTab === "OPD") {
        openModal("appointment");
        toast.success("Please schedule appointment.");
      } else if (activeTab === "IPD") {
        openModal("ipdDetails");
        toast.success("Please fill IPD details.");
      }
      fetchAllPatients();
    } catch (error) {
      console.error("Error saving patient:", error);
      toast.error("Failed to save patient details");
    }
  };

  const handleScheduleAppointment = async (formData) => {
    try {
      const payload = {
        ...patientFormData,
        appointmentDate: formData.date,
        appointmentTime: formData.time,
        diagnosis: formData.diagnosis,
        reason: formData.reason,
        doctorName: DEFAULT_DOCTOR_NAME,
        type: "OPD",
        updatedAt: new Date().toISOString(),
      };
      await axios.put(`${API.FORM}/${newPatientId}`, payload);
      toast.success("Appointment scheduled successfully!");
      closeModal("appointment");
      fetchAllPatients();
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      toast.error("Failed to schedule appointment.");
    }
  };

  const handleSaveIPD = async (formData) => {
    try {
      const patientData = {
        ...patientFormData,
        ...formData,
        type: "ipd",
        name: `${patientFormData.firstName || ""} ${
          patientFormData.middleName || ""
        } ${patientFormData.lastName || ""}`.trim(),
        permanentAddress: formData.addressPerm || patientFormData.addressPerm,
        temporaryAddress: formData.addressTemp || patientFormData.addressTemp,
        admissionTime: to24Hour(formData.admissionTime),
        wardNo: formData.wardNumber,
        bedNo: formData.bedNumber,
        updatedAt: new Date().toISOString(),
      };
      await axios.put(`${API.FORM}/${newPatientId}`, patientData);
      toast.success("IPD details updated successfully!");
      closeModal("ipdDetails");
      fetchAllPatients();
    } catch (error) {
      console.error("Error updating IPD details:", error);
      toast.error("Failed to update IPD details");
    }
  };

  const handleScheduleConsultation = async (formData) => {
    try {
      const payload = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        type: "virtual",
        scheduledDateTime: `${formData.scheduledDate} ${formData.scheduledTime}`,
        consultationStatus: "Scheduled",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const response = await axios.post(API.FORM, payload);
      toast.success("Virtual consultation scheduled successfully!");
      closeModal("scheduleConsultation");
      setNewPatientId(response.data.id);
      fetchAllPatients();
    } catch (error) {
      console.error("Error scheduling consultation:", error);
      toast.error("Failed to schedule consultation.");
    }
  };

  const renderActiveTab = () => {
    const commonProps = {
      loading,
      newPatientId,
      onViewPatient: handleViewPatient,
    };

    switch (activeTab) {
      case "OPD":
        return <OPDTab patients={patients} {...commonProps} />;
      case "IPD":
        return <IPDTab patients={ipdPatients} {...commonProps} />;
      case "Virtual":
        return <VirtualTab patients={virtualPatients} {...commonProps} />;
      default:
        return <OPDTab patients={patients} {...commonProps} />;
    }
  };

  const getAddButtonLabel = () => {
    switch (activeTab) {
      case "IPD":
        return "Add Patient";
      case "Virtual":
        return "Schedule Consultation";
      default:
        return "Add Patient";
    }
  };

  const handleAddButtonClick = () => {
    if (activeTab === "Virtual") {
      openModal("scheduleConsultation");
    } else {
      openModal("addPatient");
    }
  };

  // Define view fields for patient details
  const getViewFields = () => {
    const baseFields = [
      { key: "name", label: "Patient Name", titleKey: true },
      { key: "sequentialId", label: "Patient ID", subtitleKey: true },
      { key: "name", label: "Full Name", initialsKey: true },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "gender", label: "Gender" },
      { key: "bloodGroup", label: "Blood Group" },
      { key: "addressPerm", label: "Permanent Address" },
      { key: "addressTemp", label: "Temporary Address" },
    ];

    if (activeTab === "IPD") {
      return [
        ...baseFields.slice(0, 3),
        { key: "admissionDate", label: "Admission Date" },
        { key: "admissionTime", label: "Admission Time" },
        { key: "status", label: "Status" },
        { key: "ward", label: "Ward" },
        { key: "department", label: "Department" },
        { key: "diagnosis", label: "Diagnosis" },
        ...baseFields.slice(3),
      ];
    }

    if (activeTab === "Virtual") {
      return [
        ...baseFields.slice(0, 3),
        { key: "consultationType", label: "Consultation Type" },
        { key: "scheduledDateTime", label: "Scheduled Date & Time" },
        { key: "consultationStatus", label: "Status" },
        { key: "duration", label: "Duration (minutes)" },
        { key: "notes", label: "Notes" },
        ...baseFields.slice(3),
      ];
    }

    return [
      ...baseFields.slice(0, 3),
      { key: "datetime", label: "Appointment" },
      { key: "diagnosis", label: "Diagnosis" },
      { key: "reason", label: "Reason" },
      ...baseFields.slice(3),
    ];
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Patients</h2>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`relative cursor-pointer flex items-center gap-1 px-4 py-2 font-medium transition-colors duration-300 ${
                activeTab === tab.value
                  ? "text-[var(--primary-color)] after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[var(--primary-color)]"
                  : "text-gray-500 hover:text-[var(--accent-color)] before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-0 before:bg-[var(--accent-color)] before:transition-all before:duration-300 hover:before:w-full"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleAddButtonClick}
          className="btn btn-primary whitespace-nowrap px-4 py-2 text-xs flex items-center gap-2"
        >
          {getAddButtonLabel()}
        </button>
      </div>
      {renderActiveTab()}

      {/* Add Patient Modal */}
      <ReusableModal
        isOpen={modals.addPatient}
        onClose={() => closeModal("addPatient")}
        mode="add"
        title={`Add ${activeTab} Patient`}
        fields={PATIENT_BASIC_FIELDS}
        data={patientFormData}
        onSave={handleSavePatient}
        onChange={handlePatientFormChange}
        saveLabel="Next"
        cancelLabel="Cancel"
        size="lg"
        extraContentPosition="top"
        extraContent={
          activeTab === "IPD" && (
            <div className="mb-3">
              <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-blue-800 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Search Existing Patient
                  </h4>
                  <span className="text-[10px] text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
                    Optional
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={patientIdInput}
                    onChange={(e) => setPatientIdInput(e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs placeholder-blue-400"
                    placeholder="Patient ID"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleFetchPatientDetails();
                      }
                    }}
                  />
                  <button
                    onClick={handleFetchPatientDetails}
                    disabled={!patientIdInput.trim()}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-xs font-medium flex items-center gap-1"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    Search
                  </button>
                </div>
              </div>
            </div>
          )
        }
      />

      {/* Appointment Modal */}
      <ReusableModal
        isOpen={modals.appointment}
        onClose={() => closeModal("appointment")}
        mode="add"
        title="Schedule Appointment"
        fields={APPOINTMENT_FIELDS}
        data={appointmentFormData}
        onSave={handleScheduleAppointment}
        onChange={setAppointmentFormData}
        saveLabel="Schedule"
        cancelLabel="Back"
        size="md"
        extraContent={
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              Patient Information
            </h4>
            <p className="text-sm text-blue-700">
              {patientFormData.firstName} {patientFormData.middleName}{" "}
              {patientFormData.lastName}
            </p>
            <p className="text-xs text-blue-600">{patientFormData.email}</p>
          </div>
        }
      />

      {/* IPD Details Modal */}
      <ReusableModal
        isOpen={modals.ipdDetails}
        onClose={() => closeModal("ipdDetails")}
        mode="add"
        title="IPD Details"
        fields={IPD_DETAILS_FIELDS}
        data={ipdFormData}
        onSave={handleSaveIPD}
        onChange={handleIPDFormChange}
        saveLabel="Save"
        cancelLabel="Back"
        size="lg"
      />

      {/* Schedule Consultation Modal */}
      <ReusableModal
        isOpen={modals.scheduleConsultation}
        onClose={() => closeModal("scheduleConsultation")}
        mode="add"
        title="Schedule Virtual Consultation"
        fields={CONSULTATION_FIELDS}
        data={consultationFormData}
        onSave={handleScheduleConsultation}
        onChange={setConsultationFormData}
        saveLabel="Schedule"
        cancelLabel="Cancel"
        size="lg"
        extraContent={
          <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-green-800 mb-2">
              Virtual Consultation Info
            </h4>
            <p className="text-sm text-green-700">
              This will create a virtual consultation appointment. The patient
              will receive notification with joining details.
            </p>
          </div>
        }
      />

      {/* View Patient Modal */}
      <ReusableModal
        isOpen={modals.viewPatient}
        onClose={() => closeModal("viewPatient")}
        mode="viewProfile"
        title="Patient Details"
        viewFields={getViewFields()}
        data={selectedPatient || {}}
        extraContent={
          <div className="flex justify-end mt-4">
            <button
              onClick={() => handleEditPatient(selectedPatient)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
          </div>
        }
      />

      {/* Edit Patient Modal */}
      <ReusableModal
        isOpen={modals.editPatient}
        onClose={() => closeModal("editPatient")}
        mode="edit"
        title={`Edit ${activeTab} Patient`}
        fields={
          activeTab === "IPD"
            ? [...PATIENT_BASIC_FIELDS, ...IPD_DETAILS_FIELDS]
            : PATIENT_BASIC_FIELDS
        }
        data={
          activeTab === "IPD"
            ? { ...patientFormData, ...ipdFormData }
            : patientFormData
        }
        onSave={handleUpdatePatient}
        onChange={
          activeTab === "IPD"
            ? (formData) => {
                // Split the form data between patient and IPD fields
                const ipdFieldNames = IPD_DETAILS_FIELDS.map((f) => f.name);
                const patientData = {};
                const ipdData = {};

                Object.keys(formData).forEach((key) => {
                  if (ipdFieldNames.includes(key)) {
                    ipdData[key] = formData[key];
                  } else {
                    patientData[key] = formData[key];
                  }
                });

                handlePatientFormChange(patientData);
                handleIPDFormChange(ipdData);
              }
            : handlePatientFormChange
        }
        saveLabel="Update"
        cancelLabel="Cancel"
        size="lg"
      />
    </div>
  );
}