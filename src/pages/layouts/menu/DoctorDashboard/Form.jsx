import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  FileText,
  FlaskRound as Flask,
  Pill,
  Stethoscope,
  Eye,
  Save,
  StickyNote,
  Printer,
  User,
  Phone,
  Mail,
  Calendar,
  Menu,
  X,
  ChevronLeft,
  Building,
  Bed,
  Activity,
  ArrowLeft,
Globe,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import VitalsForm from "./VitalsForm";
import ClinicalNotesForm from "./ClinicalNotesForm";
import LabTestsForm from "./LabResultsForm";
import EyeTestForm from "./EyeTestForm";
import DentalForm from "./DentalForm";
import PrescriptionForm from "./PrescriptionForm";
import QuickLinksPanel from "./QuickLinksPanel";
import SignatureCanvas from "react-signature-canvas";
import AVLogo from "../../../../assets/AV.png";
import VitalsChart from "./VitalsChart";

const formTypes = {
  all: {
    id: "all",
    name: "All",
    icon: null,
    color: "from-[var(--primary-color)] to-[var(--accent-color)]",
    description: "Show all forms together",
  },
  template: {
    id: "template",
    name: "Case",
    icon: StickyNote,
    color: "from-[var(--primary-color)] to-[var(--accent-color)]",
    description: "Annotate medical images",
  },
  vitals: {
    id: "vitals",
    name: "Vital Signs",
    icon: Heart,
    color: "from-[var(--primary-color)] to-[var(--accent-color)]",
    description: "Heart rate, temperature, blood pressure",
  },
  prescription: {
    id: "prescription",
    name: "Prescription",
    icon: Pill,
    color: "from-[var(--primary-color)] to-[var(--accent-color)]",
    description: "Medications and dosage instructions",
  },
  clinical: {
    id: "clinical",
    name: "Clinical Notes",
    icon: FileText,
    color: "from-[var(--primary-color)] to-[var(--accent-color)]",
    description: "Chief complaint, history, advice",
  },
  lab: {
    id: "lab",
    name: "Lab Tests",
    icon: Flask,
    color: "from-[var(--primary-color)] to-[var(--accent-color)]",
    description: "Laboratory test orders and results",
  },
  dental: {
    id: "dental",
    name: "Dental Exam",
    icon: Stethoscope,
    color: "from-[var(--primary-color)] to-[var(--accent-color)]",
    description: "Dental examination and treatment",
  },
  eye: {
    id: "eye",
    name: "Eye Test",
    icon: Eye,
    color: "from-[var(--primary-color)] to-[var(--accent-color)]",
    description: "Vision and eye health advice",
  },
};

const thStyle =
  "border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;";
const tdStyle = "border:1px solid #ddd;padding:10px;background:#fff;";
const tableStyle = "width:100%;border-collapse:collapse;margin-top:10px;";

const ChartModal = ({ isOpen, onClose, vital, records, selectedIdx }) => {
  const [chartType, setChartType] = React.useState("bar");
  const vitalRanges = {
    heartRate: {
      min: 60,
      max: 100,
      label: "bpm",
      name: "Heart Rate",
      optimal: 70,
    },
    temperature: {
      min: 36.1,
      max: 37.2,
      label: "°C",
      name: "Temperature",
      optimal: 36.5,
    },
    bloodSugar: {
      min: 70,
      max: 140,
      label: "mg/dL",
      name: "Blood Sugar",
      optimal: 90,
    },
    bloodPressure: {
      min: 90,
      max: 120,
      label: "mmHg",
      name: "Blood Pressure",
      optimal: 110,
    },
    height: { min: 100, max: 220, label: "cm", name: "Height", optimal: 170 },
    weight: { min: 30, max: 200, label: "kg", name: "Weight", optimal: 70 },
  };

  const chartTypes = [
    { id: "bar", name: "Bar Chart", icon: "📊" },
    { id: "line", name: "Line Chart", icon: "📈" },
    { id: "area", name: "Area Chart", icon: "🌄" },
    { id: "pie", name: "Pie Chart", icon: "🥧" },
    { id: "radar", name: "Radar Chart", icon: "🕸️" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="h4-heading mb-4">
          {vital
            ? `${vital
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (c) => c.toUpperCase())} Chart (7 Days)`
            : "Vitals Chart & Records (7 Days)"}
        </h3>
        <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200 pb-3">
          {chartTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setChartType(type.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                chartType === type.id
                  ? "bg-[var(--primary-color)] text-white"
                  : "bg-gray-100 text-[var(--primary-color)] hover:bg-gray-200"
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.name}</span>
            </button>
          ))}
        </div>
        <div className="h-96 flex flex-col w-full">
          <VitalsChart
            vital={vital}
            records={records}
            selectedIdx={selectedIdx}
            range={vitalRanges[vital]}
            chartType={chartType}
          />
        </div>
      </div>
    </div>
  );
};

function Form() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get patient data and assessment data from navigation state or localStorage
  const patient = location.state?.patient || JSON.parse(localStorage.getItem('currentAssessment') || '{}').patientInfo || {
    name: "Unknown Patient",
    email: "unknown@example.com",
    phone: "N/A",
    age: "N/A",
    gender: "N/A",
    diagnosis: "N/A",
    wardType: "N/A",
  };

  // Get annotated images from state or localStorage
  const [annotatedImages, setAnnotatedImages] = useState(() => {
    return location.state?.annotatedImages ||
           JSON.parse(localStorage.getItem('medicalImages') || '[]') ||
           [];
  });

  const [activeForm, setActiveForm] = useState("all");
  const [formsData, setFormsData] = useState({});
  const [doctorSignature, setDoctorSignature] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(true);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [chartVital, setChartVital] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const signaturePadRef = useRef();
  const isIPDPatient = patient?.type?.toLowerCase() === "ipd";
  const printWindowRef = useRef(null);
const ShareModalContent = ({ onClose, prescriptions, patient }) => {
  return (
    <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-[#01D48C] to-[#0E1630] text-white">
        <h3 className="text-xl font-semibold">Prescription Preview</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Left: Preview */}
        <div className="p-4 rounded-lg flex flex-col items-center">
          <div className="bg-white border border-[#222] rounded-lg shadow-lg overflow-hidden p-8">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-xl font-bold text-[#0E1630] mb-1">
                  Dr. Sheetal S. Shelke
                </h2>
                <div className="text-xs text-gray-700 leading-tight">
                  <div>MBBS, MD</div>
                  <div>Neurologist</div>
                </div>
              </div>
              <img
                src="/logo.png"
                alt="AV Swasthya"
                className="h-10 w-auto"
              />
            </div>
            <div className="bg-gray-100 rounded px-4 py-2 mb-4 flex flex-wrap gap-4 items-center text-sm">
              <span>
                <b>Name:</b>{" "}
                {patient?.name || "N/A"}
              </span>
              <span>
                <b>Age:</b> {patient?.age || "N/A"}
              </span>
              <span>
                <b>Gender:</b>{" "}
                {patient?.gender || "N/A"}
              </span>
              <span>
                <b>Contact:</b>{" "}
                {patient?.phone || "N/A"}
              </span>
            </div>
            <div className="mb-4">
              <div className="text-[#0E1630] font-semibold mb-2">
                Prescription
              </div>
              <table className="w-full border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-1">
                      Medicine
                    </th>
                    <th className="border border-gray-300 px-2 py-1">
                      Dosage
                    </th>
                    <th className="border border-gray-300 px-2 py-1">
                      Frequency
                    </th>
                    <th className="border border-gray-300 px-2 py-1">
                      Intake
                    </th>
                    <th className="border border-gray-300 px-2 py-1">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((med, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-2 py-1">
                        {med.drugName || "-"}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {med.dosage || "-"} {med.dosageUnit || ""}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {med.frequency || "-"}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {med.intake || "-"}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {med.duration ? `${med.duration} day(s)` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-end border-t pt-4 mt-6">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="AV Swasthya"
                  className="h-10 w-auto"
                />
                <div className="text-xs text-gray-700">
                  Dharwad, Karnataka, 580001
                  <br />
                  +12-345 678 9012
                </div>
              </div>
              <div
                className="text-xs text-gray-700 text-right"
                style={{ minWidth: 160 }}
              >
                <div className="border-b border-gray-400 mb-1"></div>
                Doctor's Signature
              </div>
            </div>
          </div>
        </div>
        {/* Right: Share Options */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-[#0E1630]">
            Share Options
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Globe size={16} />
              Language
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#01D48C]"
            >
              <option value="English">English</option>
              <option value="Hindi">हिंदी (Hindi)</option>
              <option value="Marathi">मराठी (Marathi)</option>
              <option value="Gujarati">ગુજરાતી (Gujarati)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
              <option value="Bengali">বাংলা (Bengali)</option>
              <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
              <option value="Malayalam">മലയാളം (Malayalam)</option>
              <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter patient's email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#01D48C]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              placeholder="Enter WhatsApp number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#01D48C]"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Phone size={16} /> WhatsApp
            </button>
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Mail size={16} /> Email
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <Printer size={16} /> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

  // Load assessment data on component mount
  useEffect(() => {
    const storedAssessment = localStorage.getItem('currentAssessment');
    const storedImages = localStorage.getItem('medicalImages');
    const storedSignature = localStorage.getItem("doctorSignature");
    
    if (storedAssessment) {
      const assessmentData = JSON.parse(storedAssessment);
      console.log('Loaded assessment data:', assessmentData);
    }
    
    if (storedImages) {
      const images = JSON.parse(storedImages);
      setAnnotatedImages(images);
    }
    
    if (storedSignature) {
      setDoctorSignature(storedSignature);
    }
  }, []);

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    )
      age--;
    return age;
  };

  const getPatientName = () =>
    patient.name ||
    `${patient.firstName || ""} ${patient.middleName || ""} ${
      patient.lastName || ""
    }`.trim() ||
    "Unknown Patient";

  const getPatientAge = () =>
    patient.age && patient.age !== "N/A"
      ? patient.age
      : calculateAge(patient.dob);

  const getCombinedWardInfo = (patient) => {
    if (!isIPDPatient) return "N/A";
    const wardType = patient?.wardType || "";
    const wardNo = patient?.wardNo || patient?.wardNumber || "";
    const bedNo = patient?.bedNo || patient?.bedNumber || "";
    if (wardType && wardNo && bedNo) return `${wardType}-${wardNo}-${bedNo}`;
    else if (wardType) return wardType;
    return "N/A";
  };

  const handleBackToPatients = () => navigate("/doctordashboard/patients");

  const handleSignatureUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ({ target }) => {
        if (target?.result) {
          setDoctorSignature(target.result);
          localStorage.setItem("doctorSignature", target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearSignature = () => {
    if (signaturePadRef.current) signaturePadRef.current.clear();
    setDoctorSignature(null);
  };

  const handleSaveSignature = () => {
    if (signaturePadRef.current) {
      const signatureData = signaturePadRef.current.toDataURL();
      setDoctorSignature(signatureData);
      localStorage.setItem("doctorSignature", signatureData);
    }
  };

  const handleSaveForm = (formType, data) => {
    setFormsData((prev) => ({ ...prev, [formType]: data }));
    localStorage.setItem(
      "medicalForms",
      JSON.stringify({ ...formsData, [formType]: data })
    );
  };

  // Handle form type button clicks - navigate for template, set active for others
  const handleFormTypeClick = (formType) => {
    if (formType === "template") {
      // Navigate to template route with patient and image data
      navigate("/doctordashboard/template", {
        state: {
          patient,
          annotatedImages,
          from: 'form'
        }
      });
    } else {
      setActiveForm(formType);
    }
  };

  const getStyledPrescriptionHTML = (
    doctor,
    patient,
    signature,
    logoUrl,
    formContent
  ) => `
    <div style="width:800px;font-family:'Poppins',sans-serif;padding:40px;box-sizing:border-box;border:2px solid #0e1630;background:#fff;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h1 style="margin:0;font-size:24px;border-bottom:3px solid #01D48C;color:#0e1630;">${
            doctor.name
          }</h1>
          <p style="margin:2px 0;font-size:14px;color:#0e1630;">${
            doctor.qualifications
          }</p>
          <p style="margin:2px 0;font-size:14px;color:#0e1630;">${
            doctor.specialization
          }</p>
        </div>
        <div style="width:80px;height:80px;border-radius:8px;display:flex;align-items:center;justify-content:center;">
          <img src="${AVLogo}" alt="AV Logo" style="width:100%; height:100%; border-radius:8px; object-fit:cover;" />
        </div>
      </div>
      <div style="margin-top:20px;padding:16px 24px;border-radius:8px;background:linear-gradient(to right,#f9f9f9,#f1f1f1);">
        <div style="display:flex;flex-direction:row;justify-content:space-between;align-items:center;font-size:16px;color:#0e1630;gap:32px;">
          <div style="display:flex;flex-direction:row;gap:32px;width:100%;justify-content:space-between;">
            <div><strong style="border-bottom:1px solid #01D48C;">Name:</strong> ${
              patient?.firstName || patient?.lastName
                ? `${patient?.firstName || ""} ${patient?.middleName || ""} ${
                    patient?.lastName || ""
                  }`.trim()
                : patient?.name || "N/A"
            }</div>
            <div><strong style="border-bottom:1px solid #01D48C;">Age:</strong> ${
              patient?.age && patient?.age !== "N/A"
                ? patient.age
                : patient?.dob
                ? (() => {
                    const today = new Date();
                    const birthDate = new Date(patient.dob);
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (
                      m < 0 ||
                      (m === 0 && today.getDate() < birthDate.getDate())
                    )
                      age--;
                    return age;
                  })()
                : "N/A"
            }</div>
            <div><strong style="border-bottom:1px solid #01D48C;">Gender:</strong> ${
              patient?.gender || "N/A"
            }</div>
            <div><strong style="border-bottom:1px solid #01D48C;">Contact:</strong> ${
              patient?.phone || "N/A"
            }</div>
          </div>
        </div>
      </div>
      <div style="position:relative;margin:20px 0;">
        <div style="position:relative;z-index:1;">${
          formContent || "<p>No content available.</p>"
        }</div>
      </div>
      <div style="margin-top:40px;width:100%;height:100px;background:linear-gradient(to right,#f9f9f9,#f1f1f1);border-top:3px solid #0e1630;display:flex;align-items:center;justify-content:space-between;padding:0 40px;box-sizing:border-box;box-shadow:0 -2px 6px rgba(0,0,0,0.05);">
        <div style="display:flex;align-items:center;">
          <div style="width:80px;height:80px;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-right:30px;">
            <img src="${AVLogo}" alt="AV Logo" style="width:100%; height:100%; border-radius:8px; object-fit:cover;" />
          </div>
          <div style="color:#1696c9;font-size:14px;line-height:1.5;">
            <div style="display:inline">
              <span style="display:inline-flex;align-items:center;gap:6px;color:#0e1630;font-size:16px;">
                <svg width="18" height="18" fill="#01D48C" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                Dharwad, Karnataka, 580001
              </span>
              <br/>
              <span style="display:inline-flex;align-items:center;gap:6px;color:#0e1630;font-size:16px;">
                <svg width="18" height="18" fill="#01D48C" viewBox="0 0 24 24"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z"/></svg>
                +12-345 678 9012
              </span>
            </div>
          </div>
        </div>
        <div style="text-align:right;">
          ${
            signature
              ? `<img src="${signature}" alt="Signature" style="height:48px;margin-bottom:2px;" />`
              : '<div style="height:48px;"></div>'
          }
          <div style="width:160px;margin-left:auto;font-size:16px;color:#444;padding-top:4px;border-top:2px solid #0e1630;">Doctor's Signature</div>
        </div>
      </div>
    </div>
  `;

  const handlePrintForm = (formType) => {
    const data = formsData[formType];
    if (!data) return;

    const doctor = {
      name: "Dr. Sheetal S. Shelke",
      specialization: "Neurologist",
      regNo: "MH123456",
      qualifications: "MBBS, MD",
    };

    let formContent = "";
    switch (formType) {
      case "vitals":
        formContent = getVitalsTemplate(data);
        break;
      case "clinical":
        formContent = getClinicalNotesTemplate(data);
        break;
      case "lab":
        formContent = getLabResultsTemplate(data);
        break;
      case "prescription":
        formContent = getPrescriptionTemplate(data.prescriptions || []);
        break;
      case "dental":
        formContent = getDentalTemplate(data);
        break;
      case "eye":
        formContent = getEyeTestTemplate(data);
        break;
      default:
        formContent = "<p>No content available for this form.</p>";
    }

    const header = getStyledPrescriptionHTML(
      doctor,
      patient,
      doctorSignature,
      AVLogo,
      formContent
    );

    if (printWindowRef.current && !printWindowRef.current.closed)
      printWindowRef.current.close();

    printWindowRef.current = window.open("", "", "width=800,height=600");
    if (printWindowRef.current) {
      printWindowRef.current.document.write(header);
      printWindowRef.current.document.close();
      printWindowRef.current.print();
    }
  };

  const printAllForms = () => {
    const doctor = {
      name: "Dr. Sheetal S. Shelke",
      specialization: "Neurologist",
      regNo: "MH123456",
      qualifications: "MBBS, MD",
    };

    const formsHtml = Object.keys(formsData)
      .filter(
        (formType) =>
          formsData[formType] && Object.keys(formsData[formType]).length > 0
      )
      .map((formType) => {
        const data = formsData[formType];
        switch (formType) {
          case "vitals":
            return getVitalsTemplate(data);
          case "clinical":
            return getClinicalNotesTemplate(data);
          case "lab":
            return getLabResultsTemplate(data);
          case "dental":
            return getDentalTemplate(data);
          case "eye":
            return getEyeTestTemplate(data);
          case "prescription":
            return getPrescriptionTemplate(data.prescriptions || []);
          default:
            return "";
        }
      })
      .join("");

    if (!formsHtml) return;

    const header = getStyledPrescriptionHTML(
      doctor,
      patient,
      doctorSignature,
      AVLogo,
      formsHtml
    );

    if (printWindowRef.current && !printWindowRef.current.closed)
      printWindowRef.current.close();

    printWindowRef.current = window.open("", "", "width=1000,height=800");
    if (printWindowRef.current) {
      printWindowRef.current.document.write(`
        <html>
          <head>
            <title>Print All Forms</title>
            <style>
              body { font-family: 'Poppins', sans-serif; margin: 0; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin: 10px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background: #f8f9fa; font-weight: bold; }
              .form-section { margin-bottom: 20px; }
            </style>
          </head>
          <body>${header}</body>
        </html>
      `);
      printWindowRef.current.document.close();
      printWindowRef.current.focus();
      setTimeout(() => {
        printWindowRef.current.print();
      }, 500);
    }
  };

  const commonProps = {
    onSave: handleSaveForm,
    onPrint: handlePrintForm,
    patient,
    setIsChartOpen,
    setChartVital,
  };

  const renderActiveForm = () => {
    if (activeForm === "all") {
      return (
        <div className="space-y-8 animate-slideIn">
          <VitalsForm data={formsData.vitals} {...commonProps} />
          <PrescriptionForm data={formsData.prescription} {...commonProps} setShowShareModal={setShowShareModal}/>
          <ClinicalNotesForm data={formsData.clinical} {...commonProps} />
          <LabTestsForm data={formsData.lab} {...commonProps} />
          <EyeTestForm data={formsData.eye} {...commonProps} />
          <DentalForm data={formsData.dental} {...commonProps} />
        </div>
      );
    }

    return (
      {
        vitals: <VitalsForm data={formsData.vitals} {...commonProps} />,
        prescription: (
          <PrescriptionForm data={formsData.prescription} {...commonProps} setShowShareModal={setShowShareModal} />
        ),
        clinical: (
          <ClinicalNotesForm data={formsData.clinical} {...commonProps} />
        ),
        lab: <LabTestsForm data={formsData.lab} {...commonProps} />,
        eye: <EyeTestForm data={formsData.eye} {...commonProps} />,
        dental: <DentalForm data={formsData.dental} {...commonProps} />,
      }[activeForm] || null
    );
  };

  return (
    <div className="min-h-screen">
      {/* Back to Patient List Button */}
      <div className=" sticky top-0 z-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <button
            onClick={handleBackToPatients}
            className="flex items-center gap-2 px-4 text-[var(--primary-color)] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Patient List
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-[#01B07A] to-[#1A223F] min-w-5xl m-6 mt-1 text-white rounded-b-xl shadow-md fixed top-35 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 ">
          {/* Patient Info Section */}
          {showPatientDetails && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Patient Avatar and Details */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-lg font-bold text-[#01B07A] shadow-md uppercase">
                  {getPatientName()
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "N/A"}
                </div>
                {/* Patient Details */}
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    {getPatientName() || "Unknown Patient"}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm">
                    <div>
                      <span className="font-medium">Contact:</span>{" "}
                      {patient?.phone || patient?.contact || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Age:</span>{" "}
                      {getPatientAge() || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Gender:</span>{" "}
                      {patient?.gender || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Diagnosis:</span>{" "}
                      {patient?.diagnosis || "N/A"}
                    </div>
                    {isIPDPatient && (
                      <>
                        <div>
                          <span className="font-medium">Ward:</span>{" "}
                          {getCombinedWardInfo(patient)}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ml-1 ${
                              patient?.status?.toLowerCase() === "admitted"
                                ? "bg-green-200 text-green-900"
                                : patient?.status?.toLowerCase() ===
                                  "under treatment"
                                ? "bg-yellow-200 text-yellow-900"
                                : patient?.status?.toLowerCase() ===
                                  "discharged"
                                ? "bg-gray-200 text-gray-900"
                                : "bg-blue-200 text-blue-900"
                            }`}
                          >
                            {patient?.status || "N/A"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Links (Right Side) - Only for IPD */}
              {isIPDPatient && (
                <div className="flex-shrink-0 mt-4 md:mt-0">
                  <QuickLinksPanel
                    isOpen={isMobileMenuOpen}
                    setActiveForm={setActiveForm}
                    patient={patient}
                    onToggle={setIsMobileMenuOpen}
                  />
                </div>
              )}
            </div>
          )}

          {/* Forms Navigation (Tabs) */}
         <div className="flex items-center justify-between gap-4 mt-6">
              {/* Form Type Buttons */}
              <div className="flex flex-wrap gap-2">
                {Object.values(formTypes).map((formType) => {
                  const Icon = formType.icon;
                  const isActive = activeForm === formType.id;
                  return (
                    <button
                      key={formType.id}
                      onClick={() => handleFormTypeClick(formType.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        isActive
                          ? "bg-white text-[#01B07A] shadow-md"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      {Icon && <Icon className="w-3.5 h-3.5" />}
                      {formType.name}
                    </button>
                  );
                })}
              </div>
              {/* Print All Button */}
              <button
                onClick={printAllForms}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-[#01B07A] text-xs font-medium hover:shadow-lg transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                Print All
              </button>
            </div>
        </div>
      </header>

      {/* Main content with dynamic margin */}
      <div
        className={`max-w-7xl mx-auto px-6 py-8 mt-40 ${
          isMobileMenuOpen ? "mr-72" : ""
        } relative z-0`}
      >
        <div className="mb-8">{renderActiveForm()}</div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 animate-fadeIn">
          <h3 className="h3-heading mb-6">Digital Signature</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--primary-color)] mb-2">
                  Upload Signature:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUpload}
                  className="input-field"
                />
              </div>
              {doctorSignature && (
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-blue-800">
                    Preview:
                  </span>
                  <img
                    src={doctorSignature}
                    alt="Doctor's Signature"
                    className="h-12 border border-blue-300 rounded shadow-sm"
                  />
                </div>
              )}
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-[var(--primary-color)]">
                Or Draw Signature:
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <SignatureCanvas
                  ref={signaturePadRef}
                  canvasProps={{
                    width: 400,
                    height: 100,
                    className:
                      "border border-gray-300 rounded-lg shadow-sm w-full bg-white",
                  }}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveSignature}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--accent-color)] transition-colors font-medium"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleClearSignature}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

{showShareModal && (
  <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/40">
    <ShareModalContent
      onClose={() => setShowShareModal(false)}
      prescriptions={formsData.prescription?.prescriptions || []}
      patient={patient}
    />
  </div>
)}
      <ChartModal
        isOpen={isChartOpen}
        onClose={() => setIsChartOpen(false)}
        vital={chartVital}
        records={formsData.vitals?.vitalsRecords || []}
        selectedIdx={null}
      />
    </div>
    
  );
}

const getVitalsTemplate = (d) => `
  <h4 style="color:#16a085;">Vitals Report</h4>
  <table style="${tableStyle}">
    <thead>
      <tr>
        <th style="${thStyle}">Heart Rate</th>
        <th style="${thStyle}">Temperature</th>
        <th style="${thStyle}">Blood Sugar</th>
        <th style="${thStyle}">Blood Pressure</th>
        <th style="${thStyle}">Height</th>
        <th style="${thStyle}">Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="${tdStyle}">${d.heartRate || "-"}</td>
        <td style="${tdStyle}">${d.temperature || "-"}</td>
        <td style="${tdStyle}">${d.bloodSugar || "-"}</td>
        <td style="${tdStyle}">${d.bloodPressure || "-"}</td>
        <td style="${tdStyle}">${d.height || "-"}</td>
        <td style="${tdStyle}">${d.weight || "-"}</td>
      </tr>
    </tbody>
  </table>
`;

const getClinicalNotesTemplate = (d) => `
  <h4 style="color:#2980b9;">Clinical Notes</h4>
  <table style="${tableStyle}">
    <thead>
      <tr>
        <th style="${thStyle}">Chief Complaint</th>
        <th style="${thStyle}">History</th>
        <th style="${thStyle}">Advice</th>
        <th style="${thStyle}">Plan</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="${tdStyle}">${d.chiefComplaint || "-"}</td>
        <td style="${tdStyle}">${d.history || "-"}</td>
        <td style="${tdStyle}">${d.advice || "-"}</td>
        <td style="${tdStyle}">${d.plan || "-"}</td>
      </tr>
    </tbody>
  </table>
`;

const getLabResultsTemplate = (d) => `
  <h4 style="color:#8e44ad;">Lab Results</h4>
  <table style="${tableStyle}">
    <thead>
      <tr>
        <th style="${thStyle}">Test Name</th>
        <th style="${thStyle}">Code</th>
        <th style="${thStyle}">Instructions</th>
      </tr>
    </thead>
    <tbody>
      ${(d.selectedTests || [])
        .map(
          (t) => `
            <tr>
              <td style="${tdStyle}">${t.name || "-"}</td>
              <td style="${tdStyle}">${t.code || "-"}</td>
              <td style="${tdStyle}">${t.instructions || "-"}</td>
            </tr>
          `
        )
        .join("")}
    </tbody>
  </table>
`;

const getDentalTemplate = (d) => `
  <h4 style="color:#e67e22;">Dental Problem Action Plan</h4>
  <table style="${tableStyle}">
    <thead>
      <tr>
        <th style="${thStyle}">Teeth Numbers</th>
        <th style="${thStyle}">Problems</th>
        <th style="${thStyle}">Action Plans</th>
        <th style="${thStyle}">Positions</th>
      </tr>
    </thead>
    <tbody>
      ${(d.plans || [])
        .map(
          (p) => `
            <tr>
              <td style="${tdStyle}">${(p.teeth || []).join(", ") || "-"}</td>
              <td style="${tdStyle}">${
            (p.problems || []).join(", ") || "-"
          }</td>
              <td style="${tdStyle}">${(p.actions || []).join(", ") || "-"}</td>
              <td style="${tdStyle}">${
            (p.positions || []).join(", ") || "-"
          }</td>
            </tr>
          `
        )
        .join("")}
    </tbody>
  </table>
`;

const getEyeTestTemplate = (d) => `
  <h4 style="color:#1976d2;background:#e3f2fd;padding:10px 16px;border-radius:8px;">Eye Test Report</h4>
  <table style="${tableStyle}">
    <thead>
      <tr>
        <th style="${thStyle}">Test Date</th>
        <th style="${thStyle}">Vision Type</th>
        <th style="${thStyle}">Eye</th>
        <th style="${thStyle}">SPH</th>
        <th style="${thStyle}">CYL</th>
        <th style="${thStyle}">V/A</th>
        <th style="${thStyle}">AXIS</th>
        <th style="${thStyle}">Prev.VA</th>
        <th style="${thStyle}">Remarks</th>
        <th style="${thStyle}">Product</th>
      </tr>
    </thead>
    <tbody>
      ${(d.rows || [])
        .map(
          (r) => `
            <tr>
              <td style="${tdStyle}">${r.testDate || "-"}</td>
              <td style="${tdStyle}">${r.visionType || "-"}</td>
              <td style="${tdStyle}">Right Eye</td>
              <td style="${tdStyle}">${r.od_sph || "-"}</td>
              <td style="${tdStyle}">${r.od_cyl || "-"}</td>
              <td style="${tdStyle}">${r.od_va || "-"}</td>
              <td style="${tdStyle}">${r.od_axis || "-"}</td>
              <td style="${tdStyle}">${r.od_prev_va || "-"}</td>
              <td style="${tdStyle}">${r.remarks || "-"}</td>
              <td style="${tdStyle}">${r.product || "-"}</td>
            </tr>
            <tr>
              <td style="${tdStyle}">${r.testDate || "-"}</td>
              <td style="${tdStyle}">${r.visionType || "-"}</td>
              <td style="${tdStyle}">Left Eye</td>
              <td style="${tdStyle}">${r.os_sph || "-"}</td>
              <td style="${tdStyle}">${r.os_cyl || "-"}</td>
              <td style="${tdStyle}">${r.os_va || "-"}</td>
              <td style="${tdStyle}">${r.os_axis || "-"}</td>
              <td style="${tdStyle}">${r.os_prev_va || "-"}</td>
              <td style="${tdStyle}">${r.remarks || "-"}</td>
              <td style="${tdStyle}">${r.product || "-"}</td>
            </tr>
          `
        )
        .join("")}
    </tbody>
  </table>
`;

const getPrescriptionTemplate = (prescriptions = []) => {
  const rows = prescriptions.map((m) => ({
    ...m,
    eye: /left eye/i.test(m.drugName)
      ? "Left Eye"
      : /right eye/i.test(m.drugName)
      ? "Right Eye"
      : "",
  }));

  return `
    <h4 style="color:#2980b9;">Prescription</h4>
    <table style="${tableStyle}">
      <thead>
        <tr>
          <th style="${thStyle}">Medicine</th>
          <th style="${thStyle}">Dosage</th>
          <th style="${thStyle}">Frequency</th>
          <th style="${thStyle}">Intake</th>
          <th style="${thStyle}">Duration</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (m) => `
              <tr>
                <td style="${tdStyle}">${m.drugName || "-"}</td>
                <td style="${tdStyle}">${m.dosage || "-"}</td>
                <td style="${tdStyle}">${m.frequency || "-"}</td>
                <td style="${tdStyle}">${m.intake || "-"}</td>
                <td style="${tdStyle}">${m.duration || "-"} day(s)</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
};

export default Form;