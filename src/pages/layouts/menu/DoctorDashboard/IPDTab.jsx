import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
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
  Eye,
  EyeOff,
  Camera,
} from "lucide-react";
import { FaNotesMedical, FaVideo } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import DynamicTable from "../../../../components/microcomponents/DynamicTable";
import TeleConsultFlow from "../../../../components/microcomponents/Call";
import {
  getFamilyMembersByPatient,
  getPersonalHealthByPatientId,
} from "../../../../utils/CrudService";

const API = {
  FORM: "https://681f2dfb72e59f922ef5774c.mockapi.io/addpatient",
  VITAL_SIGNS: "https://6808fb0f942707d722e09f1d.mockapi.io/health-summary",
};

const STATIC_DATA = {
  occupations: ["Doctor", "Engineer", "Teacher", "Student", "Retired"].map(
    (v) => ({ value: v, label: v })
  ),
  insurance: ["None", "CGHS", "ESIC", "Private Insurance", "Other"].map(
    (v) => ({ value: v, label: v })
  ),
  status: ["Admitted", "Discharged"].map((v) => ({ value: v, label: v })),
  surgery: ["No", "Yes"].map((v) => ({ value: v, label: v })),
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

const WIZARD_STEPS = [
  { id: 1, title: "Patient Details", description: "Basic Information", shortTitle: "Details" },
  { id: 2, title: "Ward Selection", description: "Choose Ward", shortTitle: "Ward" },
  { id: 3, title: "Bed Selection", description: "Choose Bed", shortTitle: "Bed" },
  { id: 4, title: "Admission", description: "Finalize Details", shortTitle: "Final" },
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

const PhotoUpload = ({ photoPreview, onPhotoChange, onPreviewClick, error }) => (
  <div className="relative w-full">
    <label className="block relative cursor-pointer">
      <div className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-[#01B07A] focus-within:border-[#01B07A] min-h-[2.5rem]">
        <Camera size={16} className="text-gray-500" />
        <span className="truncate text-gray-700">
          {photoPreview ? "Photo Uploaded" : "Upload Photo *"}
        </span>
      </div>
      <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={onPhotoChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </label>
    {photoPreview && (
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-green-600 font-medium">✓ Photo Uploaded</span>
        <button 
          type="button" 
          onClick={onPreviewClick} 
          className="text-blue-500 hover:text-blue-700 p-1"
        >
          <Eye size={16} />
        </button>
      </div>
    )}
    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
  </div>
);

const PatientViewSections = ({
  data,
  personalHealthDetails,
  familyHistory,
  vitalSigns,
  loading,
}) => {
  const sections = [
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
      title: "IPD Admission Details",
      data: {
        "Admission Date": data.admissionDate,
        Status: data.status,
        Ward: data.ward,
        "Ward Type": data.wardType,
        "Ward Number": data.wardNo,
        "Bed Number": data.bedNo,
        Department: data.department,
        "Insurance Type": data.insuranceType,
        "Discharge Date": data.dischargeDate || "Not discharged",
        Diagnosis: data.diagnosis,
      },
    },
    {
      title: "Personal Health Details",
      data: personalHealthDetails
        ? {
            Height: `${personalHealthDetails.height || "N/A"} cm`,
            Weight: `${personalHealthDetails.weight || "N/A"} kg`,
            "Blood Group":
              personalHealthDetails.bloodGroupName ||
              personalHealthDetails.bloodGroup ||
              "N/A",
            Allergies: personalHealthDetails.allergies || "None",
            Surgeries: personalHealthDetails.surgeries || "None",
            Smoking: personalHealthDetails.isSmoker ? "Yes" : "No",
            "Years Smoking": personalHealthDetails.isSmoker
              ? personalHealthDetails.yearsSmoking || "Not specified"
              : "N/A",
            Alcohol: personalHealthDetails.isAlcoholic ? "Yes" : "No",
            "Years Alcohol": personalHealthDetails.isAlcoholic
              ? personalHealthDetails.yearsAlcoholic || "Not specified"
              : "N/A",
            Tobacco: personalHealthDetails.isTobacco ? "Yes" : "No",
            "Years Tobacco": personalHealthDetails.isTobacco
              ? personalHealthDetails.yearsTobacco || "Not specified"
              : "N/A",
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
  ];

  return (
    <div className="space-y-4">
      {sections.map((section) => (
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
                    <strong>{member.memberName || member.name}</strong> (
                    {member.relationName || member.relation})
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {member.phoneNumber || member.phone || "Not provided"}
                  </p>
                  <p>
                    <strong>Health Conditions:</strong>{" "}
                    {member.healthConditions?.length > 0
                      ? member.healthConditions
                          .map(
                            (condition) =>
                              condition.healthConditionName || condition.name
                          )
                          .join(", ")
                      : "None reported"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No data available</p>
            )
          ) : section.data ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
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
};

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
        <div className="sticky top-0 z-20 bg-gradient-to-r from-[#01B07A] to-[#1A223F] rounded-t-xl p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative mr-3 sm:mr-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white text-[#01B07A] text-lg sm:text-xl font-bold uppercase shadow-inner">
                {(patient?.name || "NA").substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  {patient?.name || "-"}
                </h2>
                <p className="text-white text-sm sm:text-lg">
                  IPD #{patient?.sequentialId || "-"}
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
        <div className="flex-1 overflow-auto p-3 sm:p-6 bg-gray-50">
          <PatientViewSections
            data={patient || {}}
            personalHealthDetails={personalHealthDetails}
            familyHistory={familyHistory}
            vitalSigns={vitalSigns}
            loading={loading}
          />
        </div>
        <div className="bg-white border-t p-3 sm:p-4 flex justify-end">
          <button
            onClick={() => onEdit(patient)}
            className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Edit Patient
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const IpdTab = forwardRef(({ doctorName, masterData, location, setTabActions }, ref) => {
  const navigate = useNavigate();
  const [ipdPatients, setIpdPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPatientId, setNewPatientId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modals, setModals] = useState({
    ipdWizard: false,
    viewPatient: false,
    editPatient: false,
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
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useImperativeHandle(ref, () => ({
    openAddPatientModal: () => {
      openModal("ipdWizard");
    },
  }));

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
          )
            return true;
        } catch (error) {
          console.error("Failed to parse metadata:", error);
        }
      }
    }
    return false;
  }, []);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          base64: reader.result,
          name: file.name,
          type: file.type,
          size: file.size
        });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        const base64Data = await fileToBase64(file);
        setPhotoPreview(base64Data.base64);
        setIpdWizardData(prev => ({ ...prev, photo: base64Data.base64 }));
        setFormErrors(prev => ({ ...prev, photo: "" }));
      } catch (error) {
        console.error("Error converting photo to base64:", error);
        toast.error("Error processing image. Please try again.");
      }
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  const handlePincodeChange = async (pincode) => {
    const value = pincode.replace(/\D/g, '').slice(0, 6);
    setIpdWizardData(prev => ({ ...prev, pincode: value }));
    if (value.length === 6) {
      setIsLoadingCities(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await res.json();
        if (data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
          const cities = [...new Set(data[0].PostOffice.map(office => office.Name))];
          setAvailableCities(cities);
          setIpdWizardData(prev => ({
            ...prev,
            city: '',
            district: data[0].PostOffice[0].District,
            state: data[0].PostOffice[0].State
          }));
        } else {
          setAvailableCities([]);
          setIpdWizardData(prev => ({ ...prev, city: '', district: '', state: '' }));
        }
      } catch {
        setAvailableCities([]);
        setIpdWizardData(prev => ({ ...prev, city: '', district: '', state: '' }));
      } finally {
        setIsLoadingCities(false);
      }
    } else {
      setAvailableCities([]);
      setIpdWizardData(prev => ({ ...prev, city: '', district: '', state: '' }));
    }
  };

  const generateFields = (step) => {
    if (step === 1)
      return [
        { name: "firstName", label: "First Name", type: "text", required: true },
        { name: "middleName", label: "Middle Name", type: "text" },
        { name: "lastName", label: "Last Name", type: "text", required: true },
        { name: "phone", label: "Phone Number", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "aadhaar", label: "Aadhaar Number", type: "text", required: true },
        { name: "gender", label: "Gender", type: "select", required: true, options: masterData.genders },
        { name: "dob", label: "Date of Birth", type: "date", required: true },
        { name: "occupation", label: "Occupation", type: "select", required: true, options: STATIC_DATA.occupations },
        { name: "pincode", label: "Pincode", type: "text", required: true, maxLength: 6 },
        { name: "city", label: "City", type: "select", required: true, options: availableCities.map((city) => ({ value: city, label: city })), disabled: isLoadingCities || availableCities.length === 0 },
        { name: "district", label: "District", type: "text", readonly: true },
        { name: "state", label: "State", type: "text", readonly: true },
        {
          name: "photo",
          label: "Upload Photo",
          type: "custom",
          component: (
            <PhotoUpload
              photoPreview={photoPreview}
              onPhotoChange={handlePhotoChange}
              onPreviewClick={() => setIsPhotoModalOpen(true)}
              error={formErrors.photo}
            />
          ),
        },
        { name: "password", label: "Create Password", type: "password", required: true },
        { name: "confirmPassword", label: "Confirm Password", type: "password", required: true },
        { name: "agreeDeclaration", label: "I agree to the declaration / Privacy Policy", type: "checkbox", required: true, colSpan: 3 },
      ];
    return [
      { name: "admissionDate", label: "Admission Date", type: "date", required: true },
      { name: "admissionTime", label: "Admission Time", type: "time", required: true },
      { name: "status", label: "Status", type: "select", required: true, options: STATIC_DATA.status },
      { name: "wardType", label: "Ward Type", type: "text", readonly: true },
      { name: "wardNumber", label: "Ward Number", type: "text", readonly: true },
      { name: "bedNumber", label: "Bed Number", type: "text", readonly: true },
      { name: "department", label: "Department", type: "select", required: true, options: masterData.departments },
      { name: "insuranceType", label: "Insurance Type", type: "select", required: true, options: STATIC_DATA.insurance },
      { name: "surgeryRequired", label: "Surgery Required", type: "select", options: STATIC_DATA.surgery },
      { name: "dischargeDate", label: "Discharge Date", type: "date" },
      { name: "diagnosis", label: "Diagnosis", type: "text" },
      { name: "reasonForAdmission", label: "Reason For Admission", type: "textarea", colSpan: 2 },
    ];
  };

  const fetchAllPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch(API.FORM);
      const allPatients = await res.json();
      const processedPatients = allPatients
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
      setIpdPatients(
        processedPatients
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
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientDetails = async (patientId) => {
    if (!patientId) return;
    setDetailsLoading(true);
    try {
      const [personalRes, familyRes, vitalRes] = await Promise.all([
        getPersonalHealthByPatientId(patientId).catch(() => ({ data: null })),
        getFamilyMembersByPatient(patientId).catch(() => ({ data: [] })),
        fetch(API.VITAL_SIGNS)
          .then((res) => res.json())
          .then((data) => ({ data }))
          .catch(() => ({ data: [] })),
      ]);
      setPersonalHealthDetails(personalRes.data);
      setFamilyHistory(Array.isArray(familyRes.data) ? familyRes.data : []);
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
      setPersonalHealthDetails(null);
      setFamilyHistory([]);
      setVitalSigns(null);
    } finally {
      setDetailsLoading(false);
    }
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
      setPhotoPreview(null);
      setAvailableCities([]);
      setFormErrors({});
    }
  };

  const closeModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
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
      setPhotoPreview(null);
      setAvailableCities([]);
      setFormErrors({});
    }
  };

  const handleFetchPatientDetails = async () => {
    if (!patientIdInput.trim()) return toast.error("Please enter a Patient ID");
    try {
      const response = await fetch(API.FORM);
      const data = await response.json();
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
          permanentAddress: found.permanentAddress || found.addressPerm || "",
          temporaryAddress: found.temporaryAddress || found.addressTemp || "",
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

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    openModal("viewPatient");
    const patientId = patient.id || patient.patientId;
    if (patientId) fetchPatientDetails(patientId);
    else toast.error("Unable to load patient details: Missing patient ID");
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    closeModal("viewPatient");
    openModal("editPatient");
  };

  const handleIpdWizardChange = (field, value) => {
    setIpdWizardData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "phone") {
        const formatted = value.replace(/\D/g, "").slice(0, 10);
        updated.phone = formatted;
      }
      if (field === "aadhaar") {
        const formatted = value
          .replace(/\D/g, "")
          .slice(0, 12)
          .replace(/(\d{4})(\d{4})(\d{0,4})/, (_, g1, g2, g3) => [g1, g2, g3].filter(Boolean).join("-"));
        updated.aadhaar = formatted;
      }
      if (field === "pincode") {
        handlePincodeChange(value);
        return prev;
      }
      if (field === "sameAsPermAddress" && value && prev.permanentAddress) {
        updated.temporaryAddress = prev.permanentAddress;
      }
      return updated;
    });
    setFormErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateStep = (step) => {
    const data = ipdWizardData;
    const errors = {};
    if (step === 1) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      const phoneRegex = /^\d{10}$/;
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
      if (!data.firstName?.trim()) errors.firstName = "First name is required";
      if (!data.lastName?.trim()) errors.lastName = "Last name is required";
      if (!data.phone?.match(phoneRegex)) errors.phone = "Phone must be 10 digits";
      if (!data.email || !emailRegex.test(data.email)) errors.email = "Enter a valid email";
      if (!data.aadhaar || data.aadhaar.replace(/-/g, "").length !== 12) {
        errors.aadhaar = "Aadhaar must be 12 digits";
      }
      if (!data.gender) errors.gender = "Gender is required";
      if (!data.dob) errors.dob = "Date of birth is required";
      if (!data.occupation?.trim()) errors.occupation = "Occupation is required";
      if (!data.pincode || data.pincode.length !== 6) errors.pincode = "Pincode must be 6 digits";
      if (!data.city?.trim()) errors.city = "City is required";
      if (!data.photo) errors.photo = "Photo is required";
      if (!passwordRegex.test(data.password)) {
        errors.password = "Password must include capital letters, numbers, and special characters";
      }
      if (data.password !== data.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
      if (!data.agreeDeclaration) errors.agreeDeclaration = "Please accept the declaration";
    }
    if (step === 4) {
      const required = [
        "admissionDate",
        "admissionTime",
        "status",
        "department",
        "insuranceType",
      ];
      for (let field of required) {
        if (!data[field] || data[field].trim() === "") {
          errors[field] = `Please fill ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`;
        }
      }
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return false;
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
          aadhaar: ipdWizardData.aadhaar,
          gender: ipdWizardData.gender,
          dob: ipdWizardData.dob,
          occupation: ipdWizardData.occupation,
          pincode: ipdWizardData.pincode,
          city: ipdWizardData.city,
          district: ipdWizardData.district,
          state: ipdWizardData.state,
          permanentAddress: ipdWizardData.permanentAddress,
          temporaryAddress: ipdWizardData.temporaryAddress,
          photo: ipdWizardData.photo,
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
          response = await fetch(`${API.FORM}/${ipdWizardData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!response.ok) throw new Error("Failed to update patient");
          setNewPatientId(ipdWizardData.id);
          toast.success("Existing OPD patient converted to IPD!");
        } else {
          payload.createdAt = new Date().toISOString();
          response = await fetch(API.FORM, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!response.ok) throw new Error("Failed to create patient");
          const responseData = await response.json();
          setNewPatientId(responseData.id);
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
        admissionTime: to24Hour(ipdWizardData.admissionTime),
        wardNo: ipdWizardData.wardNumber,
        bedNo: ipdWizardData.bedNumber,
        type: "ipd",
        doctorName,
        updatedAt: new Date().toISOString(),
      };
      const response = await fetch(`${API.FORM}/${newPatientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to finalize IPD admission");
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
    const bedsPerPage = window.innerWidth < 640 ? 4 : window.innerWidth < 768 ? 6 : 12;
    const newIndex =
      direction === "left"
        ? Math.max(0, bedScrollIndex - bedsPerPage)
        : Math.min(selectedWard.totalBeds - bedsPerPage, bedScrollIndex + bedsPerPage);
    setBedScrollIndex(newIndex);
  };

  const getWardIcon = (wardType) => {
    const IconComponent = WARD_ICONS[wardType] || Bed;
    return <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />;
  };

  const renderField = (field) => (
    <div
      key={field.name}
      className={`col-span-1 ${
        field.colSpan === 1.5
          ? "sm:col-span-1"
          : field.colSpan === 2
          ? "sm:col-span-2"
          : field.colSpan === 3
          ? "sm:col-span-3"
          : "sm:col-span-1"
      }`}
    >
      {field.type === "custom" ? (
        field.component
      ) : field.type === "checkbox" ? (
        <label className="inline-flex items-start gap-2 text-xs sm:text-sm mt-2">
          <input
            type="checkbox"
            name={field.name}
            checked={!!ipdWizardData[field.name]}
            onChange={(e) =>
              handleIpdWizardChange(field.name, e.target.checked)
            }
            className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0"
          />
          <span className="leading-4">{field.label}</span>
          {field.required && <span className="text-red-500">*</span>}
        </label>
      ) : (
        <div className="relative">
          {field.type === "select" ? (
            <>
              <select
                value={ipdWizardData[field.name] || ""}
                onChange={(e) =>
                  handleIpdWizardChange(field.name, e.target.value)
                }
                disabled={field.disabled}
                className={`w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#01B07A] peer pt-4 pb-1 ${
                  field.disabled ? "bg-gray-100 cursor-not-allowed" : ""
                } ${formErrors[field.name] ? "border-red-500" : ""}`}
              >
                <option value="">
                  {field.disabled && isLoadingCities
                    ? "Loading cities..."
                    : field.disabled && availableCities.length === 0
                    ? "Enter pincode first"
                    : `Select ${field.label}`}
                </option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <label className="absolute left-3 -top-2 text-xs text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#01B07A]">
                {field.label}{field.required && " *"}
              </label>
            </>
          ) : field.type === "textarea" ? (
            <>
              <textarea
                name={field.name}
                value={ipdWizardData[field.name] || ""}
                onChange={(e) =>
                  handleIpdWizardChange(field.name, e.target.value)
                }
                rows={3}
                className={`w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#01B07A] peer pt-4 pb-1 ${
                  formErrors[field.name] ? "border-red-500" : ""
                }`}
              />
              <label className="absolute left-3 -top-2 text-xs text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#01B07A]">
                {field.label}{field.required && " *"}
              </label>
            </>
          ) : field.type === "password" ? (
            <>
              <input
                type={showPassword ? "text" : "password"}
                name={field.name}
                value={ipdWizardData[field.name] || ""}
                onChange={(e) =>
                  handleIpdWizardChange(field.name, e.target.value)
                }
                className={`w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#01B07A] peer pt-4 pb-1 pr-10 ${
                  formErrors[field.name] ? "border-red-500" : ""
                }`}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3 cursor-pointer text-gray-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
              <label className="absolute left-3 -top-2 text-xs text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#01B07A]">
                {field.label}{field.required && " *"}
              </label>
            </>
          ) : (
            <>
              <input
                type={field.type || "text"}
                name={field.name}
                value={ipdWizardData[field.name] || ""}
                onChange={(e) =>
                  handleIpdWizardChange(field.name, e.target.value)
                }
                readOnly={field.readonly}
                maxLength={field.maxLength}
                className={`w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#01B07A] peer pt-4 pb-1 ${
                  field.readonly ? "bg-gray-100 cursor-not-allowed" : ""
                } ${formErrors[field.name] ? "border-red-500" : ""}`}
                placeholder=" "
              />
              <label className="absolute left-3 -top-2 text-xs text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#01B07A]">
                {field.label}{field.required && " *"}
              </label>
            </>
          )}
          {formErrors[field.name] && (
            <p className="text-red-600 text-xs mt-1">{formErrors[field.name]}</p>
          )}
        </div>
      )}
      {formErrors[field.name] && field.type === "checkbox" && (
        <p className="text-red-600 text-xs mt-1">{formErrors[field.name]}</p>
      )}
    </div>
  );

  const renderBedSelection = () => {
    if (!selectedWard) return null;
    const bedsPerPage = window.innerWidth < 640 ? 4 : window.innerWidth < 768 ? 6 : 12;
    const visibleBeds = Array.from(
      { length: bedsPerPage },
      (_, i) => bedScrollIndex + i + 1
    ).filter((bed) => bed <= selectedWard.totalBeds);
    
    return (
      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
        <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
          Select Bed for {selectedWard.type} Ward {selectedWard.number}
        </h4>
        <div className="flex items-center gap-2 mb-4">
          {bedScrollIndex > 0 && (
            <button
              onClick={() => scrollBeds("left")}
              className="p-1.5 sm:p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-all duration-200 shadow-md flex-shrink-0"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
            </button>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5 sm:gap-2 flex-1">
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
                <div
                  key={bedNumber}
                  onClick={() => handleBedSelection(bedNumber)}
                  className={`relative p-1.5 sm:p-2 rounded-lg border-2 cursor-pointer transition-all duration-300 ${getBedColors()} ${
                    isOccupied || isUnderMaintenance
                      ? "cursor-not-allowed opacity-60"
                      : ""
                  }`}
                >
                  <div className="flex flex-col items-center space-y-0.5 sm:space-y-1">
                    <div className={`${getBedIcon()}`}>
                      {getBedStatus() === "maintenance" ? (
                        <Wrench className="w-3 h-3 sm:w-4 sm:h-4" />
                      ) : getBedStatus() === "occupied" ? (
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      ) : isSelected ? (
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                      ) : (
                        <Bed className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-xs">Bed {bedNumber}</div>
                      <div className="text-[8px] sm:text-[10px] opacity-75 capitalize">
                        {getBedStatus() === "maintenance"
                          ? "Maintenance"
                          : getBedStatus() === "occupied"
                          ? "Occupied"
                          : "Available"}
                      </div>
                    </div>
                    <div className="hidden sm:flex flex-wrap gap-0.5 justify-center">
                      {facilities.map((facility) => {
                        const IconComponent = FACILITY_ICONS[facility];
                        return (
                          <div key={facility} className="relative group">
                            <IconComponent className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-70" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                              {facility}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {facilities.length === 0 && (
                      <div className="text-[8px] sm:text-[10px] opacity-60 hidden sm:block">Basic Room</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {bedScrollIndex + bedsPerPage < selectedWard.totalBeds && (
            <button
              onClick={() => scrollBeds("right")}
              className="p-1.5 sm:p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-all duration-200 shadow-md flex-shrink-0"
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
            </button>
          )}
        </div>
        {selectedBed && (
  <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
      <h5 className="font-semibold text-blue-700 flex items-center gap-2 text-xs sm:text-sm">
        Selected: {selectedWard.type} Ward {selectedWard.number} - Bed {selectedBed}
      </h5>
      <button
        onClick={() => setIpdWizardStep(4)}
        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs w-full sm:w-auto"
      >
        Next
      </button>
    </div>
    {/* Facilities display remains the same */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-blue-700">
      <span className="font-medium">Facilities:</span>
      <div className="flex flex-wrap gap-1 sm:gap-1.5">
        {(BED_FACILITIES[selectedBed] || []).map((facility) => {
          const IconComponent = FACILITY_ICONS[facility];
          return (
            <div
              key={facility}
              className="flex items-center gap-0.5 bg-white px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm border border-blue-200 text-xs"
            >
              {IconComponent && <IconComponent className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
              <span className="text-[10px] font-medium">{facility}</span>
            </div>
          );
        })}
        {(!BED_FACILITIES[selectedBed] || BED_FACILITIES[selectedBed].length === 0) && (
          <span className="text-[10px] bg-white px-2 py-0.5 rounded-full shadow-sm border border-blue-200">
            Basic Room
          </span>
        )}
      </div>
    </div>
  </div>
)}

      </div>
    );
  };

  const renderWizardStep = () => {
    if (ipdWizardStep === 1)
      return (
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Basic Patient Details</h3>
          <div className="mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-blue-50 rounded-md border border-blue-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <h4 className="text-xs sm:text-sm font-semibold text-blue-800 flex items-center gap-2">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
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
                  Transfer OPD Patient to IPD
                </h4>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  Optional
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  type="text"
                  value={patientIdInput}
                  onChange={(e) => setPatientIdInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  placeholder="Enter OPD Patient ID"
                />
                <button
                  onClick={handleFetchPatientDetails}
                  disabled={!patientIdInput.trim()}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-xs sm:text-sm font-medium w-full sm:w-auto"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {generateFields(1).map((field) => renderField(field))}
          </div>
          {ipdWizardData.password && (
            <div className="text-xs text-gray-600 mt-2">
              Include Capital Letters, Numbers, and Special Characters
            </div>
          )}
        </div>
      );
    if (ipdWizardStep === 2)
      return (
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Ward Selection</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {WARD_DATA.map((ward) => (
              <div
                key={`${ward.type}-${ward.number}`}
                className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedWard?.type === ward.type &&
                  selectedWard?.number === ward.number
                    ? "border-[#01B07A] bg-[#E6FBF5] shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleWardSelection(ward)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getWardIcon(ward.type)}
                    <h4 className="font-semibold text-xs sm:text-sm">{ward.type}</h4>
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
                    <span className="text-green-600">{ward.availableBeds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Occupied:</span>
                    <span className="text-red-600">{ward.occupiedBeds}</span>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${(ward.occupiedBeds / ward.totalBeds) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          {selectedWard && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[#E6FBF5] rounded-lg border border-[#01B07A]">
              <p className="text-xs sm:text-sm text-[#01B07A] font-medium">
                Selected: {selectedWard.type} Ward {selectedWard.number}
              </p>
            </div>
          )}
        </div>
      );
    if (ipdWizardStep === 3) return renderBedSelection();
    return (
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">IPD Admission Details</h3>
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border">
          <h4 className="font-semibold mb-2 text-xs sm:text-sm flex items-center gap-2">
            {getWardIcon(ipdWizardData.wardType)}Ward Assignment
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-gray-600">Ward Type:</span>
              <div className="font-medium">{ipdWizardData.wardType}</div>
            </div>
            <div>
              <span className="text-gray-600">Ward Number:</span>
              <div className="font-medium">{ipdWizardData.wardNumber}</div>
            </div>
            <div>
              <span className="text-gray-600">Bed Number:</span>
              <div className="font-medium">{ipdWizardData.bedNumber}</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {generateFields(4).map(renderField)}
        </div>
      </div>
    );
  };

  const renderIpdWizardContent = () => (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-1 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col relative w-full max-w-6xl h-[95vh] sm:h-[90vh] rounded-xl bg-white shadow-xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header - Fixed */}
        <div className="flex-shrink-0 bg-gradient-to-r from-[#01B07A] to-[#004f3d] rounded-t-xl px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h2 className="text-sm sm:text-lg font-bold text-white">
            IPD Patient Admission
          </h2>
          <button
            onClick={() => closeModal("ipdWizard")}
            className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white text-white hover:bg-white hover:text-[#01B07A] transition-all duration-200"
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#E6FBF5] to-[#C1F1E8]">
          {/* Step Indicator */}
          <div className="flex-shrink-0 px-2 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 min-w-max overflow-x-auto pb-2">
              {WIZARD_STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                        ipdWizardStep >= step.id
                          ? "bg-[#01B07A] text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {ipdWizardStep > step.id ? (
                        <svg
                          className="w-3 h-3 sm:w-5 sm:h-5"
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
                    </div>
                    <div className="text-center mt-1 sm:mt-2">
                      <div
                        className={`text-xs sm:text-sm font-medium ${
                          ipdWizardStep >= step.id
                            ? "text-[#01B07A]"
                            : "text-gray-600"
                        }`}
                      >
                        <span className="hidden sm:inline">{step.title}</span>
                        <span className="sm:hidden">{step.shortTitle}</span>
                      </div>
                      <div className="text-xs text-gray-500 hidden sm:block">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < WIZARD_STEPS.length - 1 && (
                    <div
                      className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 transition-all duration-500 ${
                        ipdWizardStep > step.id ? "bg-[#01B07A]" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-2 sm:px-6 pb-4">
            <motion.div
              className="bg-white rounded-xl p-3 sm:p-6 shadow-inner"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              key={ipdWizardStep}
            >
              {renderWizardStep()}
            </motion.div>
          </div>
        </div>

        {/* Footer - Fixed */}
     <div className="flex-shrink-0 bg-white border-t p-3 sm:p-4 sticky bottom-0 z-10 flex flex-col-reverse sm:flex-row justify-between gap-2">
  <button
    onClick={
      ipdWizardStep === 1
        ? () => closeModal("ipdWizard")
        : () => setIpdWizardStep(ipdWizardStep - 1)
    }
    className="px-4 sm:px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 text-xs sm:text-sm"
  >
    {ipdWizardStep === 1 ? "Cancel" : "Back"}
  </button>
  <button
    onClick={
      ipdWizardStep === 4 ? handleIpdWizardFinish : handleIpdWizardNext
    }
    className="px-4 sm:px-6 py-2 bg-[#01B07A] text-white rounded-lg hover:bg-[#018A65] transition-all duration-200 text-xs sm:text-sm"
  >
    {ipdWizardStep === 4 ? "Save Admission" : "Next"}
  </button>
</div>

      </motion.div>

      {/* Photo Preview Modal */}
      {isPhotoModalOpen && photoPreview && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-2">
          <div className="bg-white p-2 sm:p-4 rounded shadow-lg relative max-w-2xl max-h-[80vh] overflow-auto">
            <img src={photoPreview} alt="Preview" className="max-h-[60vh] max-w-full object-contain" />
            <button
              onClick={() => setIsPhotoModalOpen(false)}
              className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-red-600 text-xs sm:text-base"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );

  const handleAddRecord = (patient) =>
    navigate("/doctordashboard/form", { state: { patient } });

  const columns = [
    { header: "ID", accessor: "sequentialId" },
    {
      header: "Name",
      accessor: "name",
      clickable: true,
      cell: (row) => (
        <button
          className="cursor-pointer text-[var(--primary-color)] hover:text-[var(--accent-color)]"
          onClick={() => handleViewPatient(row)}
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
    { header: "Ward", accessor: "ward", cell: (row) => row.ward || "N/A" },
    {
      header: "Discharge",
      accessor: "dischargeDate",
      cell: (row) => {
        if (!row.dischargeDate || typeof row.dischargeDate === "number")
          return "-";
        return row.dischargeDate;
      },
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
                if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) age--;
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

  const tabActions = [];

  const filters = [
    { key: "status", label: "Status", options: STATIC_DATA.status },
    { key: "department", label: "Department", options: masterData.departments },
  ];

  useEffect(() => {
    if (doctorName && !masterData.loading) fetchAllPatients();
  }, [doctorName, masterData.loading]);

  useEffect(() => {
    const highlightIdFromState = location.state?.highlightId;
    if (highlightIdFromState) setNewPatientId(highlightIdFromState);
  }, [location.state]);

  useEffect(() => {
    setTabActions(tabActions);
  }, [setTabActions]);

  return (
    <>
      <DynamicTable
        columns={columns}
        data={ipdPatients}
        filters={filters}
        loading={loading}
        onViewPatient={handleViewPatient}
        newRowIds={[newPatientId].filter(Boolean)}
        tabActions={tabActions}
        rowClassName={(row) =>
          row.sequentialId === newPatientId ||
          row.sequentialId === location.state?.highlightId
            ? "font-bold bg-yellow-100 hover:bg-yellow-200 transition-colors duration-150"
            : ""
        }
      />
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
    </>
  );
});

export default IpdTab;