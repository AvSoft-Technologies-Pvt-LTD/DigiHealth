//patientList(API)
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  Bed,
  Users,
  Heart,
  AlertTriangle,
  Baby,
  Shield,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Snowflake,
  Monitor,
  ShowerHead,
  Wind,
  User,
  CheckCircle,
  Wrench,
} from "lucide-react";
import OPDTab from "./OPDTab";
import IPDTab from "./IPDTab";
import VirtualTab from "./VirtualTab";
import ReusableModal from "../../../../components/microcomponents/Modal";
import axios from "axios";
import { useSelector } from "react-redux";
// Import the API functions
import {
  getPersonalHealthByPatientId,
  getFamilyMembersByPatient,
} from "../../../../utils/CrudService";

const API = {
  FORM: "https://681f2dfb72e59f922ef5774c.mockapi.io/addpatient",
  USERS: "https://6801242781c7e9fbcc41aacf.mockapi.io/api/AV1/users",
  PERSONAL_HEALTH:
    "https://680cc0c2ea307e081d4edda.mockapi.io/personalHealthDetails",
  FAMILY_DATA: "https://6808fb0f942707d722e09f1d.mockapi.io/FamilyData",
  VITAL_SIGNS: "https://6808fb0f942707d722e09f1d.mockapi.io/health-summary",
};

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

const WARD_DATA = [
  {
    type: "General",
    number: "A",
    totalBeds: 30,
    availableBeds: 16,
    occupiedBeds: 14,
    occupiedBedNumbers: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27],
  },
  {
    type: "General",
    number: "B",
    totalBeds: 30,
    availableBeds: 18,
    occupiedBeds: 12,
    occupiedBedNumbers: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
  },
  {
    type: "ICU Ward",
    number: "C",
    totalBeds: 10,
    availableBeds: 3,
    occupiedBeds: 7,
    occupiedBedNumbers: [1, 2, 3, 5, 6, 8, 9],
  },
  {
    type: "Emergency",
    number: "D",
    totalBeds: 20,
    availableBeds: 12,
    occupiedBeds: 8,
    occupiedBedNumbers: [1, 3, 5, 7, 9, 11, 13, 15],
  },
  {
    type: "Private",
    number: "F",
    totalBeds: 15,
    availableBeds: 10,
    occupiedBeds: 5,
    occupiedBedNumbers: [1, 3, 7, 10, 15],
  },
  {
    type: "Maternity",
    number: "I",
    totalBeds: 20,
    availableBeds: 14,
    occupiedBeds: 6,
    occupiedBedNumbers: [1, 5, 8, 12, 16, 20],
  },
];

const BED_FACILITIES = Object.fromEntries(
  Array.from({ length: 30 }, (_, i) => [
    i + 1,
    ["AC", "TV", "Bathroom", "Oxygen"].slice(
      0,
      Math.floor(Math.random() * 4) + 1
    ),
  ])
);
const FACILITY_ICONS = {
  AC: Snowflake,
  TV: Monitor,
  Bathroom: ShowerHead,
  Oxygen: Wind,
};
const WARD_ICONS = {
  General: Users,
  "ICU Ward": Heart,
  Emergency: AlertTriangle,
  Private: Shield,
  Maternity: Baby,
  Surgical: Stethoscope,
};

const IPD_WIZARD_STEPS = [
  { id: 1, title: "Basic Patient Details", description: "Patient Information" },
  { id: 2, title: "Ward Selection", description: "Choose Ward" },
  { id: 3, title: "Bed Selection", description: "Choose Bed" },
  { id: 4, title: "IPD Admission Details", description: "Finalize Admission" },
];

const getCurrentDate = () => new Date().toISOString().slice(0, 10);
const getCurrentTime = () => new Date().toTimeString().slice(0, 5);
const to24Hour = (t) =>
  t.includes("AM") || t.includes("PM")
    ? t.replace(
        /(\d+):(\d+)\s*(AM|PM)/,
        (_, h, m, mod) =>
          `${(mod === "PM" && h !== "12"
            ? +h + 12
            : mod === "AM" && h === "12"
            ? 0
            : +h
          )
            .toString()
            .padStart(2, "0")}:${m}`
      )
    : t;
const incrementTime = (time) => {
  const [h, m] = time.split(":").map(Number);
  return `${((h + Math.floor((m + 30) / 60)) % 24)
    .toString()
    .padStart(2, "0")}:${((m + 30) % 60).toString().padStart(2, "0")}`;
};

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
    colSpan: 1.5,
  },
  {
    name: "addressTemp",
    label: "Temporary Address",
    type: "textarea",
    required: true,
    colSpan: 1.5,
  },
  {
    name: "sameAsPermAddress",
    label: "Same as Permanent Address",
    type: "checkbox",
    colSpan: 3,
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
    options: ["Consultation", "Follow-up", "Test", "Other"].map((r) => ({
      value: r,
      label: r,
    })),
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
    options: ["Video Call", "Voice Call", "Chat"].map((t) => ({
      value: t,
      label: t,
    })),
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

const IPD_FINAL_FIELDS = [
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
  { name: "wardType", label: "Ward Type", type: "text", readonly: true },
  { name: "wardNumber", label: "Ward Number", type: "text", readonly: true },
  { name: "bedNumber", label: "Bed Number", type: "text", readonly: true },
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

// Updated PatientViewSections component to handle the new API structure
const PatientViewSections = ({
  data,
  personalHealthDetails,
  familyHistory,
  vitalSigns,
  loading,
}) => (
  <div className="space-y-4">
    {[
      {
        title: "Basic Information",
        data: {
          Name: data.name,
          Email: data.email,
          Phone: data.phone,
          Gender: data.gender,
          "Blood Group": data.bloodGroup,
          DOB: data.dob,
        },
      },
      {
        title: "Personal Health Details",
        data: personalHealthDetails
          ? {
              Height: `${personalHealthDetails.height || "N/A"} cm`,
              Weight: `${personalHealthDetails.weight || "N/A"} kg`,
              "Blood Group": personalHealthDetails.bloodGroupName || "N/A",
              Allergies: personalHealthDetails.allergies || "None",
              Surgeries: personalHealthDetails.surgeries || "None",
              Smoking: personalHealthDetails.isSmoker ? "Yes" : "No",
              "Years Smoking": personalHealthDetails.isSmoker ? 
                (personalHealthDetails.yearsSmoking || "Not specified") : "N/A",
              Alcohol: personalHealthDetails.isAlcoholic ? "Yes" : "No",
              "Years Alcohol": personalHealthDetails.isAlcoholic ? 
                (personalHealthDetails.yearsAlcoholic || "Not specified") : "N/A",
              Tobacco: personalHealthDetails.isTobacco ? "Yes" : "No",
              "Years Tobacco": personalHealthDetails.isTobacco ? 
                (personalHealthDetails.yearsTobacco || "Not specified") : "N/A",
            }
          : null,
      },
      { title: "Family History", isArray: true, data: familyHistory },
      {
        title: "Vital Signs",
        data: vitalSigns
          ? {
              "Blood Pressure": vitalSigns.bloodPressure,
              "Heart Rate": vitalSigns.heartRate,
              Temperature: vitalSigns.temperature,
              "Blood Sugar": vitalSigns.bloodSugar,
              "Oxygen Saturation": vitalSigns.oxygenSaturation,
              "Respiratory Rate": vitalSigns.respiratoryRate,
            }
          : null,
      },
    ].map((section) => (
      <div key={section.title} className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">{section.title}</h3>
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Loading...</span>
          </div>
        ) : section.isArray ? (
          section.data?.length > 0 ? (
            section.data.map((member, i) => (
              <div key={i} className="p-2 bg-gray-50 rounded text-sm mb-2">
                <p>
                  <strong>{member.memberName}</strong> ({member.relationName})
                </p>
                <p>
                  <strong>Phone:</strong> {member.phoneNumber || "Not provided"}
                </p>
                <p>
                  <strong>Health Conditions:</strong>{" "}
                  {member.healthConditions?.length > 0
                    ? member.healthConditions
                        .map((condition) => condition.healthConditionName)
                        .join(", ")
                    : "None reported"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No data available</p>
          )
        ) : section.data ? (
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(section.data).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value || "N/A"}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No data available</p>
        )}
      </div>
    ))}
  </div>
);

const PatientViewModal = ({
  isOpen,
  onClose,
  patient,
  personalHealthDetails,
  familyHistory,
  vitalSigns,
  loading,
  onEdit,
}) => {
  if (!isOpen) return null;
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col relative w-full max-w-4xl max-h-[95vh] rounded-xl bg-white shadow-xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sticky top-0 z-20 bg-gradient-to-r from-[#01B07A] to-[#1A223F] rounded-t-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#01B07A] text-xl font-bold uppercase shadow-inner">
                {(patient?.name || "NA").substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {patient?.name || "-"}
                </h2>
                <p className="text-white text-lg">
                  {patient?.sequentialId || "-"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white text-white hover:bg-white hover:text-[#01B07A] transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <PatientViewSections
            data={patient || {}}
            personalHealthDetails={personalHealthDetails}
            familyHistory={familyHistory}
            vitalSigns={vitalSigns}
            loading={loading}
          />
        </div>
        <div className="bg-white border-t p-4 flex justify-end">
          <button
            onClick={() => onEdit(patient)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Patient
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function PatientList() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [doctorName, setDoctorName] = useState("");
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
    ipdWizard: false,
    scheduleConsultation: false,
    viewPatient: false,
    editPatient: false,
  });
  const [formData, setFormData] = useState({});
  const [appointmentFormData, setAppointmentFormData] = useState({
    date: getCurrentDate(),
    time: getCurrentTime(),
  });
  const [consultationFormData, setConsultationFormData] = useState({
    scheduledDate: getCurrentDate(),
    scheduledTime: getCurrentTime(),
    duration: 30,
  });
  const [patientIdInput, setPatientIdInput] = useState("");
  const [ipdWizardStep, setIpdWizardStep] = useState(1);
  const [ipdWizardData, setIpdWizardData] = useState({});
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [bedScrollIndex, setBedScrollIndex] = useState(0);
  const [personalHealthDetails, setPersonalHealthDetails] = useState(null);
  const [familyHistory, setFamilyHistory] = useState([]);
  const [vitalSigns, setVitalSigns] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const tabs = [
    { label: "OPD", value: "OPD" },
    { label: "IPD", value: "IPD" },
    { label: "Virtual", value: "Virtual" },
  ];

  useEffect(() => {
    const fetchDoctorName = async () => {
      if (!user?.email) return;
      try {
        const res = await axios.get(
          `${API.USERS}?email=${encodeURIComponent(user.email)}`
        );
        if (res.data.length > 0) {
          const doctor = res.data[0];
          setDoctorName(`Dr. ${doctor.firstName} ${doctor.lastName}`.trim());
        }
      } catch (error) {
        console.error("Error fetching doctor name:", error);
        toast.error("Failed to fetch doctor name");
      }
    };
    fetchDoctorName();
  }, [user]);

  useEffect(() => {
    if (doctorName) fetchAllPatients();
  }, [doctorName]);

  useEffect(() => {
    const tabFromUrl = new URLSearchParams(location.search).get("tab");
    const tabFromState = location.state?.tab;
    const highlightIdFromState = location.state?.highlightId;
    const autoNavigated = location.state?.autoNavigated;
    if (autoNavigated && tabFromState) {
      setActiveTab(tabFromState);
      if (highlightIdFromState) setNewPatientId(highlightIdFromState);
    } else if (tabFromUrl) {
      setActiveTab(tabFromUrl.charAt(0).toUpperCase() + tabFromUrl.slice(1));
    }
  }, [location.search, location.state]);

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

      setPatients(
        allPatients
          .filter(
            (p) =>
              (!p.type || p.type.toLowerCase() === "opd") &&
              p.doctorName === doctorName
          )
          .map((p, i) => ({
            ...p,
            sequentialId: i + 1,
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
        allPatients
          .filter(
            (p) =>
              p.type?.toLowerCase() === "ipd" && p.doctorName === doctorName
          )
          .map((p, i) => ({
            ...p,
            sequentialId: i + 1,
            wardNo: p.wardNumber || p.wardNo,
            bedNo: p.bedNumber || p.bedNo,
            ward: `${p.wardType || "N/A"}-${
              p.wardNumber || p.wardNo || "N/A"
            }-${p.bedNumber || p.bedNo || "N/A"}`,
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
        allPatients
          .filter(
            (p) =>
              (p.type?.toLowerCase() === "virtual" || p.consultationType) &&
              p.doctorName === doctorName
          )
          .map((p, i) => ({
            ...p,
            sequentialId: i + 1,
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

  // Updated fetchPatientDetails function with improved error handling and data structure
  const fetchPatientDetails = async (patientId) => {
    if (!patientId) {
      console.warn("No patientId provided to fetchPatientDetails");
      return;
    }
    
    setDetailsLoading(true);
    try {
      console.log("Fetching patient details for ID:", patientId);
      
      // Fetch personal health details
      const personalHealthPromise = getPersonalHealthByPatientId(patientId)
        .then(response => {
          console.log("Personal health response:", response);
          return response;
        })
        .catch(error => {
          console.warn("Personal health fetch failed:", error);
          return { data: null };
        });

      // Fetch family members
      const familyMembersPromise = getFamilyMembersByPatient(patientId)
        .then(response => {
          console.log("Family members response:", response);
          return response;
        })
        .catch(error => {
          console.warn("Family members fetch failed:", error);
          return { data: [] };
        });

      // Fetch vital signs (keeping existing mock implementation)
      const vitalSignsPromise = axios.get(API.VITAL_SIGNS)
        .then(response => response)
        .catch(error => {
          console.warn("Vital signs fetch failed:", error);
          return { data: [] };
        });

      // Wait for all promises to resolve
      const [personalRes, familyRes, vitalRes] = await Promise.all([
        personalHealthPromise,
        familyMembersPromise,
        vitalSignsPromise,
      ]);

      // Set personal health details
      if (personalRes.data) {
        console.log("Setting personal health details:", personalRes.data);
        setPersonalHealthDetails(personalRes.data);
      } else {
        setPersonalHealthDetails(null);
      }

      // Set family history
      if (Array.isArray(familyRes.data)) {
        console.log("Setting family history:", familyRes.data);
        setFamilyHistory(familyRes.data);
      } else {
        setFamilyHistory([]);
      }

      // Set vital signs (keep existing logic for email matching)
      const patientEmail = selectedPatient?.email?.toLowerCase().trim();
      if (patientEmail && Array.isArray(vitalRes.data)) {
        const matchingVitalSigns = vitalRes.data.find(
          (v) => v.email?.toLowerCase().trim() === patientEmail
        );
        setVitalSigns(matchingVitalSigns || null);
      } else {
        setVitalSigns(null);
      }

      toast.success("Patient details loaded successfully!");

    } catch (error) {
      console.error("Error fetching patient details:", error);
      toast.error("Failed to fetch some patient details");
      
      // Reset to default values
      setPersonalHealthDetails(null);
      setFamilyHistory([]);
      setVitalSigns(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    setNewPatientId(null);
    navigate(`/doctordashboard/patients?tab=${tabValue}`);
  };

  const openModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
    if (modalName === "ipdWizard") {
      setIpdWizardStep(1);
      setBedScrollIndex(0);
      setIpdWizardData({
        admissionDate: getCurrentDate(),
        admissionTime: getCurrentTime(),
      });
      setSelectedWard(null);
      setSelectedBed(null);
      setPatientIdInput("");
    }
  };

  const closeModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
    if (modalName === "addPatient") setFormData({});
    if (modalName === "appointment")
      setAppointmentFormData({
        date: getCurrentDate(),
        time: getCurrentTime(),
      });
    if (modalName === "scheduleConsultation")
      setConsultationFormData({
        scheduledDate: getCurrentDate(),
        scheduledTime: getCurrentTime(),
        duration: 30,
      });
    if (modalName === "viewPatient" || modalName === "editPatient") {
      setSelectedPatient(null);
      setPersonalHealthDetails(null);
      setFamilyHistory([]);
      setVitalSigns(null);
      setDetailsLoading(false);
    }
    if (modalName === "ipdWizard") {
      setIpdWizardStep(1);
      setIpdWizardData({
        admissionDate: getCurrentDate(),
        admissionTime: getCurrentTime(),
      });
      setSelectedWard(null);
      setSelectedBed(null);
      setPatientIdInput("");
      setBedScrollIndex(0);
    }
  };

  const handleFetchPatientDetails = async () => {
    if (!patientIdInput.trim()) return toast.error("Please enter a Patient ID");
    try {
      const data = await (await fetch(API.FORM)).json();
      const found = data
        .filter((p) => !p.type || p.type.toLowerCase() === "opd")
        .find((p) => (p.id || "").toString() === patientIdInput.trim());
      if (found) {
        const nameParts = (found.name || "").split(" ");
        const firstName = found.firstName || nameParts[0] || "";
        const middleName = found.middleName || nameParts[1] || "";
        const lastName =
          found.lastName || nameParts[nameParts.length - 1] || "";
        setIpdWizardData({
          ...ipdWizardData,
          ...found,
          firstName,
          middleName,
          lastName,
          name: found.name || `${firstName} ${middleName} ${lastName}`.trim(),
          addressPerm: found.permanentAddress || found.addressPerm || "",
          addressTemp: found.temporaryAddress || found.addressTemp || "",
          admissionDate: getCurrentDate(),
          admissionTime: getCurrentTime(),
        });
        toast.success("OPD Patient details loaded for IPD transfer!");
      } else {
        toast.info(
          "No OPD patient found with this ID. Only OPD patients can be transferred to IPD."
        );
      }
    } catch (error) {
      console.error("Error fetching patient:", error);
      toast.error("Failed to fetch patient");
    }
  };

  const handleFormChange = (data) => {
    if (data.sameAsPermAddress && data.addressPerm)
      data.addressTemp = data.addressPerm;
    setFormData(data);
  };

  // Updated handleViewPatient to pass patientId and handle the flow better
  const handleViewPatient = (patient) => {
    console.log("Viewing patient:", patient);
    setSelectedPatient(patient);
    openModal("viewPatient");
    
    // Use the patient ID to fetch details
    const patientId = patient.id || patient.patientId;
    if (patientId) {
      fetchPatientDetails(patientId);
    } else {
      console.error("No patient ID found for patient:", patient);
      toast.error("Unable to load patient details: Missing patient ID");
    }
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      ...patient,
      addressPerm: patient.permanentAddress || patient.addressPerm || "",
      addressTemp: patient.temporaryAddress || patient.addressTemp || "",
    });
    closeModal("viewPatient");
    openModal("editPatient");
  };

  const handleUpdatePatient = async (formData) => {
    try {
      const payload = {
        ...formData,
        name: `${formData.firstName || ""} ${formData.middleName || ""} ${
          formData.lastName || ""
        }`.trim(),
        permanentAddress: formData.addressPerm,
        temporaryAddress: formData.addressTemp,
        updatedAt: new Date().toISOString(),
      };
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
        doctorName,
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
        ...formData,
        appointmentDate: formData.date,
        appointmentTime: formData.time,
        diagnosis: formData.diagnosis,
        reason: formData.reason,
        doctorName,
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

  const handleScheduleConsultation = async (formData) => {
    try {
      const payload = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        type: "virtual",
        scheduledDateTime: `${formData.scheduledDate} ${formData.scheduledTime}`,
        consultationStatus: "Scheduled",
        doctorName,
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

  const handleIpdWizardChange = (field, value) => {
    setIpdWizardData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "sameAsPermAddress" && value && prev.addressPerm)
        updated.addressTemp = prev.addressPerm;
      return updated;
    });
  };

  const validateStep = (step) => {
    const data = ipdWizardData;
    const required = {
      1: [
        "firstName",
        "lastName",
        "phone",
        "email",
        "gender",
        "dob",
        "occupation",
        "addressPerm",
        "addressTemp",
        "password",
        "confirmPassword",
      ],
      4: [
        "admissionDate",
        "admissionTime",
        "status",
        "department",
        "insuranceType",
      ],
    };
    if (required[step]) {
      for (let field of required[step]) {
        if (!data[field] || data[field].trim() === "") {
          toast.error(
            `Please fill ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
          );
          return false;
        }
      }
      if (step === 1 && data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }
    }
    if (step === 2 && !selectedWard) {
      toast.error("Please select a ward");
      return false;
    }
    if (step === 3 && !selectedBed) {
      toast.error("Please select a bed");
      return false;
    }
    return true;
  };

  const handleIpdWizardNext = async () => {
    if (!validateStep(ipdWizardStep)) return;
    if (ipdWizardStep === 1) {
      try {
        const isExistingPatient = ipdWizardData.id && patientIdInput.trim();
        const payload = {
          firstName: ipdWizardData.firstName,
          middleName: ipdWizardData.middleName,
          lastName: ipdWizardData.lastName,
          phone: ipdWizardData.phone,
          email: ipdWizardData.email,
          gender: ipdWizardData.gender,
          dob: ipdWizardData.dob,
          bloodGroup: ipdWizardData.bloodGroup,
          occupation: ipdWizardData.occupation,
          permanentAddress: ipdWizardData.addressPerm,
          temporaryAddress: ipdWizardData.addressTemp,
          password: ipdWizardData.password,
          name: `${ipdWizardData.firstName || ""} ${
            ipdWizardData.middleName || ""
          } ${ipdWizardData.lastName || ""}`.trim(),
          type: "ipd",
          doctorName,
          updatedAt: new Date().toISOString(),
        };
        let response;
        if (isExistingPatient) {
          response = await axios.put(
            `${API.FORM}/${ipdWizardData.id}`,
            payload
          );
          setNewPatientId(ipdWizardData.id);
          toast.success("Existing OPD patient converted to IPD!");
        } else {
          payload.createdAt = new Date().toISOString();
          response = await axios.post(API.FORM, payload);
          setNewPatientId(response.data.id);
          toast.success("New IPD patient created!");
        }
        setIpdWizardStep(2);
      } catch (error) {
        console.error("Error saving patient:", error);
        toast.error("Failed to save patient details");
      }
    } else if (ipdWizardStep === 2) {
      setIpdWizardData((prev) => ({
        ...prev,
        wardType: selectedWard.type,
        wardNumber: selectedWard.number,
      }));
      setIpdWizardStep(3);
    } else if (ipdWizardStep === 3) {
      setIpdWizardData((prev) => ({
        ...prev,
        bedNumber: selectedBed.toString(),
        admissionDate: getCurrentDate(),
        admissionTime: incrementTime(prev.admissionTime),
      }));
      setIpdWizardStep(4);
    }
  };

  const handleIpdWizardFinish = async () => {
    if (!validateStep(4)) return;
    try {
      const payload = {
        ...ipdWizardData,
        name: `${ipdWizardData.firstName || ""} ${
          ipdWizardData.middleName || ""
        } ${ipdWizardData.lastName || ""}`.trim(),
        permanentAddress: ipdWizardData.addressPerm,
        temporaryAddress: ipdWizardData.addressTemp,
        admissionTime: to24Hour(ipdWizardData.admissionTime),
        wardNo: ipdWizardData.wardNumber,
        bedNo: ipdWizardData.bedNumber,
        type: "ipd",
        doctorName,
        updatedAt: new Date().toISOString(),
      };
      await axios.put(`${API.FORM}/${newPatientId}`, payload);
      toast.success("IPD admission completed successfully!");
      closeModal("ipdWizard");
      fetchAllPatients();
    } catch (error) {
      console.error("Error finalizing IPD admission:", error);
      toast.error("Failed to finalize IPD admission");
    }
  };

  const handleWardSelection = (ward) => {
    setSelectedWard(ward);
    setIpdWizardData((prev) => ({
      ...prev,
      wardType: ward.type,
      wardNumber: ward.number,
    }));
    setIpdWizardStep(3);
  };

  const handleBedSelection = (bedNumber) => {
    const isOccupied = selectedWard.occupiedBedNumbers?.includes(bedNumber);
    const isUnderMaintenance = Math.random() < 0.05;
    if (isOccupied || isUnderMaintenance) return;
    setSelectedBed(bedNumber);
    setIpdWizardData((prev) => ({
      ...prev,
      bedNumber: bedNumber.toString(),
      admissionDate: getCurrentDate(),
      admissionTime: incrementTime(prev.admissionTime),
    }));
  };

  const scrollBeds = (direction) => {
    if (!selectedWard) return;
    const newIndex =
      direction === "left"
        ? Math.max(0, bedScrollIndex - 1)
        : Math.min(selectedWard.totalBeds - 12, bedScrollIndex + 1);
    setBedScrollIndex(newIndex);
  };

  const renderActiveTab = () => {
    const commonProps = {
      loading,
      newPatientId,
      onViewPatient: handleViewPatient,
      highlightedPatientId: location.state?.highlightId || newPatientId,
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

  const getAddButtonLabel = () =>
    ({ IPD: "Add Patient", Virtual: "Schedule Consultation" }[activeTab] ||
    "Add Patient");

  const handleAddButtonClick = () => {
    if (activeTab === "Virtual") openModal("scheduleConsultation");
    else if (activeTab === "IPD") openModal("ipdWizard");
    else openModal("addPatient");
  };

  const getWardIcon = (wardType) => {
    const IconComponent = WARD_ICONS[wardType] || Bed;
    return <IconComponent className="w-5 h-5" />;
  };

  const renderBedSelection = () => {
    if (!selectedWard) return null;
    const visibleBeds = Array.from(
      { length: 12 },
      (_, i) => bedScrollIndex + i + 1
    ).filter((bed) => bed <= selectedWard.totalBeds);
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-4 text-lg">
          Select Bed for {selectedWard.type} Ward {selectedWard.number}
        </h4>
        <div className="flex items-center gap-2 mb-4">
          {bedScrollIndex > 0 && (
            <motion.button
              onClick={() => scrollBeds("left")}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-all duration-200 shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-4 h-4 text-blue-600" />
            </motion.button>
          )}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 flex-1">
            {visibleBeds.map((bedNumber) => {
              const isOccupied =
                selectedWard.occupiedBedNumbers?.includes(bedNumber);
              const isSelected = selectedBed === bedNumber;
              const facilities = BED_FACILITIES[bedNumber] || [];
              const isUnderMaintenance = Math.random() < 0.05;
              const getBedStatus = () =>
                isUnderMaintenance
                  ? "maintenance"
                  : isOccupied
                  ? "occupied"
                  : "available";
              const getBedColors = () => {
                const status = getBedStatus();
                if (isSelected)
                  return "border-green-500 bg-green-50 text-green-700 shadow-lg shadow-green-200";
                if (status === "occupied")
                  return "border-gray-400 bg-gray-100 text-gray-600";
                if (status === "maintenance")
                  return "border-gray-400 bg-gray-100 text-gray-500";
                return "border-[var(--primary-color,#0E1630)] bg-white text-[var(--primary-color,#0E1630)] hover:border-[var(--primary-color,#0E1630)] hover:shadow-lg hover:shadow-blue-200 hover:glow";
              };
              const getBedIcon = () => {
                const status = getBedStatus();
                if (isSelected) return "text-green-500";
                if (status === "occupied") return "text-gray-500";
                if (status === "maintenance") return "text-gray-400";
                return "text-[var(--primary-color,#0E1630)]";
              };
              return (
                <motion.div
                  key={bedNumber}
                  onClick={() => handleBedSelection(bedNumber)}
                  className={`relative p-2 rounded-lg border-2 cursor-pointer transition-all duration-300 ${getBedColors()} ${
                    isOccupied || isUnderMaintenance
                      ? "cursor-not-allowed opacity-60"
                      : ""
                  }`}
                  whileHover={
                    !isOccupied && !isUnderMaintenance
                      ? { scale: 1.05, y: -2 }
                      : {}
                  }
                  whileTap={
                    !isOccupied && !isUnderMaintenance ? { scale: 0.98 } : {}
                  }
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: bedNumber * 0.05 }}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <motion.div
                      className={`text-2xl ${getBedIcon()}`}
                      animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                      transition={{
                        duration: 0.6,
                        repeat: isSelected ? Infinity : 0,
                        repeatDelay: 2,
                      }}
                    >
                      {getBedStatus() === "maintenance" ? (
                        <Wrench className="w-5 h-5" />
                      ) : getBedStatus() === "occupied" ? (
                        <User className="w-5 h-5" />
                      ) : isSelected ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Bed className="w-5 h-5" />
                      )}
                    </motion.div>
                    <div className="text-center">
                      <div className="font-bold text-xs">Bed {bedNumber}</div>
                      <div className="text-[10px] opacity-75 capitalize">
                        {getBedStatus() === "maintenance"
                          ? "Maintenance"
                          : getBedStatus() === "occupied"
                          ? "Occupied"
                          : "Available"}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-0.5 justify-center">
                      {facilities.map((facility) => {
                        const IconComponent = FACILITY_ICONS[facility];
                        return (
                          IconComponent && (
                            <div key={facility} className="relative group">
                              <IconComponent className="w-3 h-3 opacity-70" />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                {facility}
                              </div>
                            </div>
                          )
                        );
                      })}
                    </div>
                    {facilities.length === 0 && (
                      <div className="text-[10px] opacity-60">Basic Room</div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
          {bedScrollIndex + 12 < selectedWard.totalBeds && (
            <motion.button
              onClick={() => scrollBeds("right")}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-all duration-200 shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-4 h-4 text-blue-600" />
            </motion.button>
          )}
        </div>
        {selectedBed && (
          <motion.div
            className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-semibold text-blue-700 flex items-center gap-2 text-sm">
                Selected: {selectedWard.type} Ward {selectedWard.number} - Bed{" "}
                {selectedBed}
              </h5>
              <button
                onClick={() => setIpdWizardStep(4)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
              >
                Next
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <span className="font-medium text-xs">Facilities:</span>
              <div className="flex gap-1.5">
                {(BED_FACILITIES[selectedBed] || []).map((facility) => {
                  const IconComponent = FACILITY_ICONS[facility];
                  return (
                    <motion.div
                      key={facility}
                      className="flex items-center gap-0.5 bg-white px-2 py-0.5 rounded-full shadow-sm border border-blue-200 text-xs"
                      whileHover={{ scale: 1.05 }}
                    >
                      {IconComponent && <IconComponent className="w-3 h-3" />}
                      <span className="text-[10px] font-medium">
                        {facility}
                      </span>
                    </motion.div>
                  );
                })}
                {(!BED_FACILITIES[selectedBed] ||
                  BED_FACILITIES[selectedBed].length === 0) && (
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full shadow-sm border border-blue-200">
                    Basic Room
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  const renderIpdWizardContent = () => (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col relative w-full max-w-5xl max-h-[95vh] rounded-xl bg-white shadow-xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sticky top-0 z-20 bg-gradient-to-r from-[#01B07A] to-[#004f3d] rounded-t-xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-white">
            IPD Patient Admission
          </h2>
          <button
            onClick={() => closeModal("ipdWizard")}
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white text-white hover:bg-white hover:text-[#01B07A] transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="bg-gradient-to-br from-[#E6FBF5] to-[#C1F1E8] px-6 py-4">
          <div className="flex items-center justify-center space-x-4">
            {IPD_WIZARD_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      ipdWizardStep >= step.id
                        ? "bg-[#01B07A] text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                    animate={
                      ipdWizardStep === step.id ? { scale: [1, 1.1, 1] } : {}
                    }
                    transition={{
                      duration: 0.6,
                      repeat: ipdWizardStep === step.id ? Infinity : 0,
                      repeatDelay: 2,
                    }}
                  >
                    {ipdWizardStep > step.id ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </motion.div>
                  <div className="text-center mt-2">
                    <div
                      className={`text-sm font-medium ${
                        ipdWizardStep >= step.id
                          ? "text-[#01B07A]"
                          : "text-gray-600"
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < IPD_WIZARD_STEPS.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 transition-all duration-500 ${
                      ipdWizardStep > step.id ? "bg-[#01B07A]" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-gradient-to-br from-[#E6FBF5] to-[#C1F1E8] p-6">
          <motion.div
            className="bg-white rounded-xl p-6 shadow-inner"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            key={ipdWizardStep}
          >
            {ipdWizardStep === 1 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Basic Patient Details
                </h3>
                <div className="mb-6">
                  <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
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
                        Transfer OPD Patient to IPD{" "}
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full ml-2">
                          (optional)
                        </span>
                      </h4>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        Only OPD patients
                      </span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={patientIdInput}
                        onChange={(e) => setPatientIdInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Enter OPD Patient ID"
                      />
                      <button
                        onClick={handleFetchPatientDetails}
                        disabled={!patientIdInput.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        Search
                      </button>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      💡 Only OPD patients can be transferred to IPD. IPD
                      patients won't appear in search results.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PATIENT_BASIC_FIELDS.map((field) => (
                    <div
                      key={field.name}
                      className={`col-span-1 ${
                        field.colSpan === 1.5
                          ? "md:col-span-1"
                          : field.colSpan === 2
                          ? "md:col-span-2"
                          : field.colSpan === 3
                          ? "md:col-span-3"
                          : "md:col-span-1"
                      }`}
                    >
                      {field.type === "checkbox" ? (
                        <label className="inline-flex items-center gap-2 text-sm mt-2">
                          <input
                            type="checkbox"
                            name={field.name}
                            checked={!!ipdWizardData[field.name]}
                            onChange={(e) =>
                              handleIpdWizardChange(
                                field.name,
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-blue-600"
                          />
                          <span>{field.label}</span>
                        </label>
                      ) : (
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                          </label>
                          {field.type === "select" ? (
                            <select
                              value={ipdWizardData[field.name] || ""}
                              onChange={(e) =>
                                handleIpdWizardChange(
                                  field.name,
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#01B07A]"
                            >
                              <option value="">Select {field.label}</option>
                              {field.options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          ) : field.type === "textarea" ? (
                            <textarea
                              name={field.name}
                              value={ipdWizardData[field.name] || ""}
                              onChange={(e) =>
                                handleIpdWizardChange(
                                  field.name,
                                  e.target.value
                                )
                              }
                              rows={3}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#01B07A]"
                            />
                          ) : (
                            <input
                              type={field.type || "text"}
                              name={field.name}
                              value={ipdWizardData[field.name] || ""}
                              onChange={(e) =>
                                handleIpdWizardChange(
                                  field.name,
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#01B07A]"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {ipdWizardStep === 2 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Ward Selection</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {WARD_DATA.map((ward) => (
                    <motion.div
                      key={`${ward.type}-${ward.number}`}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        selectedWard?.type === ward.type &&
                        selectedWard?.number === ward.number
                          ? "border-[#01B07A] bg-[#E6FBF5] shadow-lg"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleWardSelection(ward)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getWardIcon(ward.type)}
                          <h4 className="font-semibold text-sm">{ward.type}</h4>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {ward.number}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Total:</span>
                          <span>{ward.totalBeds}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Available:</span>
                          <span className="text-green-600">
                            {ward.availableBeds}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Occupied:</span>
                          <span className="text-red-600">
                            {ward.occupiedBeds}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (ward.occupiedBeds / ward.totalBeds) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {selectedWard && (
                  <motion.div
                    className="mt-6 p-4 bg-[#E6FBF5] rounded-lg border border-[#01B07A]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-sm text-[#01B07A] font-medium">
                      Selected: {selectedWard.type} Ward {selectedWard.number}
                    </p>
                  </motion.div>
                )}
              </div>
            )}
            {ipdWizardStep === 3 && renderBedSelection()}
            {ipdWizardStep === 4 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  IPD Admission Details
                </h3>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                    {getWardIcon(ipdWizardData.wardType)} Ward Assignment
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Ward Type:</span>
                      <div className="font-medium">
                        {ipdWizardData.wardType}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Ward Number:</span>
                      <div className="font-medium">
                        {ipdWizardData.wardNumber}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Bed Number:</span>
                      <div className="font-medium">
                        {ipdWizardData.bedNumber}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {IPD_FINAL_FIELDS.map((field) => (
                    <div
                      key={field.name}
                      className={`col-span-1 ${
                        field.colSpan === 2
                          ? "md:col-span-2"
                          : field.colSpan === 3
                          ? "md:col-span-3"
                          : "md:col-span-1"
                      }`}
                    >
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                        </label>
                        {field.type === "select" ? (
                          <select
                            value={ipdWizardData[field.name] || ""}
                            onChange={(e) =>
                              handleIpdWizardChange(field.name, e.target.value)
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#01B07A]"
                          >
                            <option value="">Select {field.label}</option>
                            {field.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : field.type === "textarea" ? (
                          <textarea
                            name={field.name}
                            value={ipdWizardData[field.name] || ""}
                            onChange={(e) =>
                              handleIpdWizardChange(field.name, e.target.value)
                            }
                            rows={3}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#01B07A]"
                          />
                        ) : (
                          <input
                            type={field.type || "text"}
                            name={field.name}
                            value={ipdWizardData[field.name] || ""}
                            onChange={(e) =>
                              handleIpdWizardChange(field.name, e.target.value)
                            }
                            readOnly={field.readonly}
                            className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#01B07A] ${
                              field.readonly
                                ? "bg-gray-100 cursor-not-allowed"
                                : ""
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
        <div className="bg-white border-t p-4 flex justify-between">
          <motion.button
            onClick={
              ipdWizardStep === 1
                ? () => closeModal("ipdWizard")
                : () => setIpdWizardStep(ipdWizardStep - 1)
            }
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {ipdWizardStep === 1 ? "Cancel" : "Back"}
          </motion.button>
          <motion.button
            onClick={
              ipdWizardStep === 4 ? handleIpdWizardFinish : handleIpdWizardNext
            }
            className="px-6 py-2 bg-[#01B07A] text-white rounded-lg hover:bg-[#018A65] transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {ipdWizardStep === 4 ? "Save Admission" : "Next"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="p-2 sm:p-4 md:p-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`relative cursor-pointer flex items-center gap-1 px-4 py-2 font-medium transition-colors duration-300 ${
                activeTab === tab.value
                  ? "text-[var(--primary-color)] after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[var(--primary-color)]"
                  : "text-gray-500 hover:text-[var(--accent-color)]"
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

      <PatientViewModal
        isOpen={modals.viewPatient}
        onClose={() => closeModal("viewPatient")}
        patient={selectedPatient}
        personalHealthDetails={personalHealthDetails}
        familyHistory={familyHistory}
        vitalSigns={vitalSigns}
        loading={detailsLoading}
        onEdit={handleEditPatient}
      />

      {modals.ipdWizard && renderIpdWizardContent()}

      <ReusableModal
        isOpen={modals.addPatient}
        onClose={() => closeModal("addPatient")}
        mode="add"
        title={`Add ${activeTab} Patient`}
        fields={PATIENT_BASIC_FIELDS}
        data={formData}
        onSave={handleSavePatient}
        onChange={handleFormChange}
        saveLabel="Next"
        cancelLabel="Cancel"
        size="lg"
      />

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
              {formData.firstName} {formData.middleName} {formData.lastName}
            </p>
            <p className="text-xs text-blue-600">{formData.email}</p>
          </div>
        }
      />

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

      <ReusableModal
        isOpen={modals.editPatient}
        onClose={() => closeModal("editPatient")}
        mode="edit"
        title={`Edit ${activeTab} Patient`}
        fields={PATIENT_BASIC_FIELDS}
        data={formData}
        onSave={handleUpdatePatient}
        onChange={handleFormChange}
        saveLabel="Update"
        cancelLabel="Cancel"
        size="lg"
      />
    </div>
  );
}