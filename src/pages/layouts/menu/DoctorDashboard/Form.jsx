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
  X,
  ArrowLeft,
  Globe,
  Upload,
  ChevronDown,
  ChevronUp
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

const ChartModal = ({ isOpen, onClose, vital, records, selectedIdx }) => {
  const [chartType, setChartType] = useState("bar");
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

const ShareModalContent = ({ onClose, prescriptions, patient }) => (
  <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
    <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-[#01D48C] to-[#0E1630] text-white">
      <h3 className="text-xl font-semibold">Prescription Preview</h3>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <X size={24} />
      </button>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
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
            <img src="/logo.png" alt="AV Swasthya" className="h-10 w-auto" />
          </div>
          <div className="bg-gray-100 rounded px-4 py-2 mb-4 flex flex-wrap gap-4 items-center text-sm">
            <span>
              <b>Name:</b> {patient?.name || "N/A"}
            </span>
            <span>
              <b>Age:</b> {patient?.age || "N/A"}
            </span>
            <span>
              <b>Gender:</b> {patient?.gender || "N/A"}
            </span>
            <span>
              <b>Contact:</b> {patient?.phone || "N/A"}
            </span>
          </div>
          <div className="mb-4">
            <div className="text-[#0E1630] font-semibold mb-2">
              Prescription
            </div>
            <table className="w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1">Medicine</th>
                  <th className="border border-gray-300 px-2 py-1">Dosage</th>
                  <th className="border border-gray-300 px-2 py-1">
                    Frequency
                  </th>
                  <th className="border border-gray-300 px-2 py-1">Intake</th>
                  <th className="border border-gray-300 px-2 py-1">Duration</th>
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
              <img src="/logo.png" alt="AV Swasthya" className="h-10 w-auto" />
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
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-[#0E1630]">Share Options</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Globe size={16} />
            Language
          </label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#01D48C]">
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
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
            <Phone size={16} /> WhatsApp
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
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

const Form = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient ||
    JSON.parse(localStorage.getItem("currentAssessment") || "{}")
      .patientInfo || {
      name: "Unknown Patient",
      email: "unknown@example.com",
      phone: "N/A",
      age: "N/A",
      gender: "N/A",
      diagnosis: "N/A",
      wardType: "N/A",
    };
  const [annotatedImages, setAnnotatedImages] = useState(
    () =>
      location.state?.annotatedImages ||
      JSON.parse(localStorage.getItem("medicalImages") || "[]") ||
      []
  );
  const [activeForm, setActiveForm] = useState("all");
  const [formsData, setFormsData] = useState({});
  const [doctorSignature, setDoctorSignature] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(true);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [chartVital, setChartVital] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMoreForms, setShowMoreForms] = useState(false);
  const signaturePadRef = useRef();
  const printWindowRef = useRef(null);
  const isIPDPatient = patient?.type?.toLowerCase() === "ipd";

  useEffect(() => {
    const storedAssessment = localStorage.getItem("currentAssessment");
    const storedImages = localStorage.getItem("medicalImages");
    const storedSignature = localStorage.getItem("doctorSignature");
    if (storedAssessment)
      console.log("Loaded assessment data:", JSON.parse(storedAssessment));
    if (storedImages) setAnnotatedImages(JSON.parse(storedImages));
    if (storedSignature) setDoctorSignature(storedSignature);
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

  const getCombinedWardInfo = () => {
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

  const handleFormTypeClick = (formType) => {
    if (formType === "template") {
      navigate("/doctordashboard/template", {
        state: { patient, annotatedImages, from: "form" },
      });
    } else {
      setActiveForm(formType);
    }
  };

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
  const [isDualScreen, setIsDualScreen] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(screen-spanning: single-fold-vertical)").matches
    ) {
      setIsDualScreen(true);
    }
  }, []);

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
          <VitalsForm
            data={formsData.vitals}
            {...commonProps}
            hospitalName="AV Hospital"
            ptemail={patient.email || "default@example.com"}
          />
          <PrescriptionForm
            data={formsData.prescription}
            {...commonProps}
            setShowShareModal={setShowShareModal}
            doctorName="Dr. Kavya Patil"
          />
          <ClinicalNotesForm
            data={formsData.clinical}
            onSave={handleSaveForm}
            onPrint={handlePrintForm}
            ptemail={patient.email || "default_patient@example.com"}
            hospitalname="AV Hospital"
            drEmail="dr.sheetal@example.com"
            drname="Dr. Sheetal S. Shelke"
            patientname={getPatientName()}
            diagnosis={patient.diagnosis || "N/A"}
            type={patient.type || "OPD"}
          />
          <LabTestsForm
            data={formsData.lab}
            {...commonProps}
            hospitalName="AV Hospital"
            ptemail={patient.email || "default@example.com"}
          />
          <EyeTestForm data={formsData.eye} {...commonProps} />
          <DentalForm data={formsData.dental} {...commonProps} />
        </div>
      );
    }
    return (
      {
        vitals: (
          <VitalsForm
            data={formsData.vitals}
            {...commonProps}
            hospitalName="AV Hospital"
            ptemail={patient.email || "default@example.com"}
          />
        ),
        prescription: (
          <PrescriptionForm
            data={formsData.prescription}
            {...commonProps}
            setShowShareModal={setShowShareModal}
            doctorName="Dr. Kavya Patil"
          />
        ),
        clinical: (
          <ClinicalNotesForm
            data={formsData.clinical}
            onSave={handleSaveForm}
            onPrint={handlePrintForm}
            ptemail={patient.email || "default_patient@example.com"}
            hospitalname="AV Hospital"
            drEmail="dr.sheetal@example.com"
            drname="Dr. Sheetal S. Shelke"
            patientname={getPatientName()}
            diagnosis={patient.diagnosis || "N/A"}
            type={patient.type || "OPD"}
          />
        ),
        lab: (
          <LabTestsForm
            data={formsData.lab}
            {...commonProps}
            hospitalName="AV Hospital"
            ptemail={patient.email || "default@example.com"}
          />
        ),
        eye: <EyeTestForm data={formsData.eye} {...commonProps} />,
        dental: <DentalForm data={formsData.dental} {...commonProps} />,
      }[activeForm] || null
    );
  };

  return (
    <div className="min-h-screen">
      {/* Sticky Back Button */}
      <div className="sticky top-0 z-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3">
          <button
            onClick={handleBackToPatients}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 text-[10px] sm:text-sm text-[var(--primary-color)] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            Back to Patient List
          </button>
        </div>
      </div>

{/* ==================== MOBILE VIEW ==================== */}
<div className="md:hidden flex  bg-gradient-to-r from-[#01B07A] to-[#1A223F] rounded-b-xl  flex-col items-center gap-2 p-2 xs:p-4 w-full">
  {/* Patient Avatar + Name + Details */}
  <div className="relative flex flex-nowrap xs:flex-wrap items-center xs:items-start gap-4  p-4  w-full text-white">
    
    {/* ✅ Show Quick Links only for IPD patients */}
    {isIPDPatient && (
      <div className="absolute top-6 right-2 z-10">
        <QuickLinksPanel
          isOpen={isMobileMenuOpen}
          setActiveForm={setActiveForm}
          patient={patient}
          onToggle={setIsMobileMenuOpen}
        />
      </div>
    )}

    {/* Avatar */}
    <div className="w-14 h-14 flex mb-18 items-center justify-center rounded-full bg-white text-[#01B07A] text-base font-bold uppercase shadow flex-shrink-0">
      {getPatientName().split(" ").map((n) => n[0]).join("") || "N/A"}
    </div>

    {/* Patient Info */}
    <div className="flex flex-col text-sm space-y-1 min-w-0 break-words max-w-[calc(100%-56px)]">
      <h2 className="text-base font-semibold">
        Name: {getPatientName() || "Unknown Patient"}
      </h2>
      <p>Contact: {patient?.phone || patient?.contact || "N/A"}</p>
      <p>Age: {getPatientAge() || "N/A"}</p>
      <p>Gender: {patient?.gender || "N/A"}</p>
      <p>Diagnosis: {patient?.diagnosis || "N/A"}</p>

      {isIPDPatient && (
        <>
          <p>Ward: {getCombinedWardInfo()}</p>
          <p>
            Status:
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                patient?.status?.toLowerCase() === "admitted"
                  ? "bg-green-200 text-green-900"
                  : patient?.status?.toLowerCase() === "under treatment"
                  ? "bg-yellow-200 text-yellow-900"
                  : patient?.status?.toLowerCase() === "discharged"
                  ? "bg-gray-200 text-gray-900"
                  : "bg-blue-200 text-blue-900"
              }`}
            >
              {patient?.status || "N/A"}
            </span>
          </p>
        </>
      )}
    </div>
  </div>
  <div style={{ backgroundColor: '#F8FAF9' }} className=" w-full rounded-xl mt-2 pt-2 pb-2 ">
    {/* First Row: Scrollable Tabs */}
    <div className="w-full flex justify-center">
      <div className="flex flex-wrap gap-0.5 sm:gap-2 md:gap-4 border-b border-gray-200">
        {["template", "vitals", "prescription", "eye"].map((formId) => {
          const formType = formTypes[formId];
          const Icon = formType.icon;
          const isActive = activeForm === formType.id;
          return (
            <button
              key={formType.id}
              onClick={() => handleFormTypeClick(formType.id)}
              className={`flex items-center gap-0.6 sm:gap-2 md:gap-3 px-1 py-1 text-[11px] sm:text-[14px] font-medium whitespace-nowrap ${
                isActive
                  ? "text-[#01B07A] bg-white font-semibold border-b-2 border-[#01B07A]"
                  : "text-gray-600 hover:text-[#01B07A]"
              }`}
            >
              <Icon className="w-3 h-3" />
              <span className="ps-1">{formType.name}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setShowMoreForms(!showMoreForms)}
        className="flex items-center justify-end rounded-full text-[#01B07A] bg-white font-medium hover:bg-gray-100 whitespace-nowrap ml-2"
      >
        {showMoreForms ?  <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-5 h-5" />}
      </button>
    </div>

    {/* Second Row: More Forms (if toggled) */}
    {showMoreForms && (
      <div className="w-full mt-1">
        <div className="flex justify-center flex-wrap gap-0 border-b border-gray-200">
          {["clinical", "lab", "dental"].map((formId) => {
            const formType = formTypes[formId];
            const Icon = formType.icon;
            const isActive = activeForm === formType.id;
            return (
              <button
                key={formType.id}
                onClick={() => handleFormTypeClick(formType.id)}
                className={`flex items-center px-1 py-1 text-[10px] font-medium whitespace-nowrap ${
                  isActive
                    ? "text-[#01B07A] bg-white font-semibold border-b-2 border-[#01B07A]"
                    : "text-gray-600 hover:text-[#01B07A]"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="ps-1">{formType.name}</span>
              </button>
            );
          })}

          {/* Print All Button */}
          <button
            onClick={printAllForms}
            className="flex items-center gap-0.5 px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap bg-[#1A223F] text-white hover:bg-[#01B07A]"
          >
            <Printer className="w-3 h-3" />
            <span>Print All</span>
          </button>
        </div>
      </div>
    )}
  </div>
</div>



{/* ==================== TABLET VIEW ==================== */}
<div className="hidden md:flex lg:hidden flex-col items-center bg-gradient-to-r from-[#01B07A] to-[#1A223F] rounded-b-xl shadow-md gap-4 p-4 w-[95%] mx-auto">
  {/* Patient Avatar + Name + Details */}
  <div className="relative flex flex-wrap items-start gap-6 p-4 w-full text-white">
    
    {/* ✅ Show Quick Links only if IPD */}
    {isIPDPatient && (
      <div className="absolute top-4 right-4 z-10">
        <QuickLinksPanel
          isOpen={isMobileMenuOpen}
          setActiveForm={setActiveForm}
          patient={patient}
          onToggle={setIsMobileMenuOpen}
        />
      </div>
    )}

    {/* Avatar */}
    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white text-[#01B07A] text-xl font-bold uppercase shadow">
      {getPatientName().split(" ").map((n) => n[0]).join("") || "N/A"}
    </div>

    {/* Patient Info */}
  <div className="flex flex-col text-sm space-y-1 min-w-0 break-words">
  <h2 className="text-2xl font-semibold">
    Name: {getPatientName() || "Unknown Patient"}
  </h2>

  <div className="grid grid-cols-2 gap-2">
    <div className="flex flex-col">
      <p className="text-base">Age: {getPatientAge() || "N/A"}</p>
      <p className="text-base">Gender: {patient?.gender || "N/A"}</p>
      {isIPDPatient && (
        <p className="text-base">Ward: {getCombinedWardInfo()}</p>
      )}
    </div>

    <div className="flex flex-col">
      <p className="text-base">Contact: {patient?.phone || patient?.contact || "N/A"}</p>
      <p className="text-base">Diagnosis: {patient?.diagnosis || "N/A"}</p>
      {isIPDPatient && (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-base font-medium">Status:</span>
          <span
            className={`px-2 py-0.5 rounded-full text-sm font-medium ${
              patient?.status?.toLowerCase() === "admitted"
                ? "bg-green-200 text-green-900"
                : patient?.status?.toLowerCase() === "under treatment"
                ? "bg-yellow-200 text-yellow-900"
                : patient?.status?.toLowerCase() === "discharged"
                ? "bg-gray-200 text-gray-900"
                : "bg-blue-200 text-blue-900"
            }`}
          >
            {patient?.status || "N/A"}
          </span>
        </div>
      )}
    </div>
  </div>
</div>

  </div>

  {/* Tab Panel */}
<div style={{ backgroundColor: '#F8FAF9' }} className="w-full rounded-2xl mt-4 pt-2 pb-3">
  {/* First Row: Scrollable Tabs */}
  <div className="w-full flex justify-center">
    <div className="flex flex-wrap gap-5 border-b-3 border-gray-200">
      {["template", "vitals", "prescription", "eye"].map((formId) => {
        const formType = formTypes[formId];
        const Icon = formType.icon;
        const isActive = activeForm === formType.id;
        return (
          <button
            key={formType.id}
            onClick={() => handleFormTypeClick(formType.id)}
            className={`flex items-center gap-2 px-1 py-1 text-[20px] md:text-[22px] lg:text-[20px] whitespace-nowrap ${
              isActive
                ? "text-[#01B07A]  border-b-2 border-[#01B07A]"
                : "text-gray-600 hover:text-[#01B07A]"
            }`}
          >
            <Icon className="w-5 h-5 md:w-6 md:h-6" />
            <span>{formType.name}</span>
          </button>
        );
      })}
    </div>
    <button
      onClick={() => setShowMoreForms(!showMoreForms)}
      className="flex items-center justify-end rounded-full text-[#01B07A]  font-medium hover:bg-gray-100 whitespace-nowrap ml-3"
    >
      {showMoreForms ? <ChevronUp className="w-8 h-8" /> : <ChevronDown className="w-8 h-8" />}
    </button>
  </div>

  {/* Second Row: More Forms (if toggled) */}
  {showMoreForms && (
    <div className="w-full mt-2">
      <div className="flex justify-center flex-wrap gap-2 border-b border-gray-200">
        {["clinical", "lab", "dental"].map((formId) => {
          const formType = formTypes[formId];
          const Icon = formType.icon;
          const isActive = activeForm === formType.id;
          return (
            <button
              key={formType.id}
              onClick={() => handleFormTypeClick(formType.id)}
              className={`flex items-center gap-3 text-[20px] md:text-[22px] lg:text-[20px] whitespace-nowrap ${
                isActive
                  ? "text-[#01B07A] border-b-2 border-[#01B07A]"
                  : "text-gray-600 hover:text-[#01B07A]"
              }`}
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6" />
              <span>{formType.name}</span>
            </button>
          );
        })}
        {/* Print All Button */}
        <button
          onClick={printAllForms}
          className="flex items-center gap-2 px-4 py-1 rounded-xl text-[18px] md:text-[18px] lg:text-[18px] font-semibold whitespace-nowrap bg-[#1A223F] text-white hover:bg-[#01B07A]"
        >
          <Printer className="w-5 h-5 md:w-6 md:h-6" />
          <span>Print All</span>
        </button>
      </div>
    </div>
  )}
</div>

</div>


      {/* Desktop Header Section */}
    <header className="hidden lg:block sticky top-0 z-50 bg-gradient-to-r from-[#01B07A] to-[#1A223F] w-full mx-auto mt-1 text-white rounded-b-xl shadow-md">
  <div className="w-full px-3 py-2 sm:px-4 md:px-6 sm:py-3">
    {showPatientDetails && (
      <div className="flex flex-col gap-2 md:gap-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
          <div className="flex flex-row items-center md:items-start gap-2 md:gap-4 w-full">
            <div className="w-10 h-10 sm:w-12 md:w-12 md:h-12 flex md:px-4 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white text-xs sm:text-sm md:text-lg font-bold text-[#01B07A] shadow-md uppercase mb-10 sm:mb-0">
              {getPatientName().split(" ").map((n) => n[0]).join("") || "N/A"}
            </div>
            <div className="flex flex-col text-left w-full md:w-auto">
              <h2 className="text-sm sm:text-base md:text-xl font-medium md:font-semibold mb-0.5 truncate max-w-[200px] sm:max-w-[300px] md:max-w-none">
                {getPatientName() || "Unknown Patient"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-2 sm:gap-x-3 md:gap-x-4 gap-y-1 text-[10px] sm:text-xs md:text-sm">
                <div className="flex items-center gap-1 truncate">
                  <span className="font-medium">Contact:</span>
                  <span className="break-all truncate max-w-[120px]">{patient?.phone || patient?.contact || "N/A"}</span>
                </div>
                <div className="truncate">
                  <span className="font-medium">Age:</span>
                  <span> {getPatientAge() || "N/A"}</span>
                </div>
                <div className="truncate">
                  <span className="font-medium">Gender:</span>
                  <span> {patient?.gender || "N/A"}</span>
                </div>
                <div className="col-span-2 sm:col-span-1 md:col-span-1 truncate">
                  <span className="font-medium">Diagnosis:</span>
                  <span> {patient?.diagnosis || "N/A"}</span>
                </div>
                {isIPDPatient && (
                  <>
                    <div className="col-span-2 sm:col-span-1 truncate">
                      <span className="font-medium">Ward:</span>
                      <span> {getCombinedWardInfo()}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1 md:col-span-2 flex">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Status:</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                            patient?.status?.toLowerCase() === "admitted"
                              ? "bg-green-200 text-green-900"
                              : patient?.status?.toLowerCase() === "under treatment"
                              ? "bg-yellow-200 text-yellow-900"
                              : patient?.status?.toLowerCase() === "discharged"
                              ? "bg-gray-200 text-gray-900"
                              : "bg-blue-200 text-blue-900"
                          }`}
                        >
                          {patient?.status || "N/A"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            {isIPDPatient && (
              <div className="w-full md:w-auto md:ml-auto mt-2 md:mt-0">
                <QuickLinksPanel
                  isOpen={isMobileMenuOpen}
                  setActiveForm={setActiveForm}
                  patient={patient}
                  onToggle={setIsMobileMenuOpen}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 md:gap-2 justify-start mt-3 md:mt-4">
          {Object.values(formTypes).map((formType) => {
            const Icon = formType.icon;
            const isActive = activeForm === formType.id;
            return (
              <button
                key={formType.id}
                onClick={() => handleFormTypeClick(formType.id)}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
                  isActive ? "bg-white text-[#01B07A] shadow-md" : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {formType.name}
              </button>
            );
          })}
          <button
            onClick={printAllForms}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-white text-[#01B07A] text-xs md:text-sm font-medium hover:shadow-lg transition-all"
          >
            <Printer className="w-4 h-4" />
            Print All
          </button>
        </div>
      </div>
    )}
  </div>
</header>

      {/* ---------------- CONTENT ---------------- */}
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 ${
          isMobileMenuOpen ? "mr-0 sm:mr-72" : ""
        } relative z-0`}
      >
        <div className="mb-6 sm:mb-8">{renderActiveForm()}</div>

        {/* Digital Signature */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-8 animate-fadeIn">
          <h3 className="text-base sm:text-lg font-medium sm:font-semibold mb-4 sm:mb-6">
            Digital Signature
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Upload */}
            <div className="space-y-3 sm:space-y-4">
              <label className="block text-[10px] sm:text-sm font-medium text-[var(--primary-color)] mb-2">
                Upload Signature:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleSignatureUpload}
                className="input-field text-[10px] sm:text-sm"
              />
              {doctorSignature && (
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-[10px] sm:text-sm font-medium text-blue-800">
                    Preview:
                  </span>
                  <img
                    src={doctorSignature}
                    alt="Doctor's Signature"
                    className="h-8 sm:h-12 border border-blue-300 rounded shadow-sm"
                  />
                </div>
              )}
            </div>
            {/* Draw */}
            <div className="space-y-3 sm:space-y-4">
              <label className="block text-[10px] sm:text-sm font-medium text-[var(--primary-color)]">
                Or Draw Signature:
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-4">
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
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={handleSaveSignature}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--accent-color)] transition-colors text-[10px] sm:text-sm"
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                  Save
                </button>
                <button
                  onClick={handleClearSignature}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-[10px] sm:text-sm"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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
};

// Template functions remain the same as in your original code
const getVitalsTemplate = (d) => `
  <h4 style="color:#16a085;">Vitals Report</h4>
  <table style="width:100%;border-collapse:collapse;margin-top:10px;">
    <thead>
      <tr>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Heart Rate</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Temperature</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Blood Sugar</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Blood Pressure</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Height</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
          d.heartRate || "-"
        }</td>
        <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
          d.temperature || "-"
        }</td>
        <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
          d.bloodSugar || "-"
        }</td>
        <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
          d.bloodPressure || "-"
        }</td>
        <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
          d.height || "-"
        }</td>
        <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
          d.weight || "-"
        }</td>
      </tr>
    </tbody>
  </table>
`;
const getClinicalNotesTemplate = (d) => `
  <h4 style="color:#2980b9;">Clinical Notes</h4>
  <table style="width:100%;border-collapse:collapse;margin-top:10px;">
    <thead>
      <tr>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Chief Complaint</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">History</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Advice</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Plan</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
          d.chiefComplaint || "-"
        }</td>
        <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
          d.history || "-"
        }</td>
        <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
          d.advice || "-"
        }</td>
        <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
          d.plan || "-"
        }</td>
      </tr>
    </tbody>
  </table>
`;
const getLabResultsTemplate = (d) => `
  <h4 style="color:#8e44ad;">Lab Results</h4>
  <table style="width:100%;border-collapse:collapse;margin-top:10px;">
    <thead>
      <tr>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Test Name</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Code</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Instructions</th>
      </tr>
    </thead>
    <tbody>
      ${(d.selectedTests || [])
        .map(
          (t) => `
        <tr>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            t.name || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            t.code || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            t.instructions || "-"
          }</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
`;
const getDentalTemplate = (d) => `
  <h4 style="color:#e67e22;">Dental Problem Action Plan</h4>
  <table style="width:100%;border-collapse:collapse;margin-top:10px;">
    <thead>
      <tr>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Teeth Numbers</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Problems</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Action Plans</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Positions</th>
      </tr>
    </thead>
    <tbody>
      ${(d.plans || [])
        .map(
          (p) => `
        <tr>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            (p.teeth || []).join(", ") || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            (p.problems || []).join(", ") || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            (p.actions || []).join(", ") || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
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
  <table style="width:100%;border-collapse:collapse;margin-top:10px;">
    <thead>
      <tr>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Test Date</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Vision Type</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Eye</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">SPH</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">CYL</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">V/A</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">AXIS</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Prev.VA</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Remarks</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Product</th>
      </tr>
    </thead>
    <tbody>
      ${(d.rows || [])
        .map(
          (r) => `
        <tr>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            r.testDate || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            r.visionType || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">Right Eye</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            r.od_sph || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            r.od_cyl || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            r.od_va || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            r.od_axis || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            r.od_prev_va || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            r.remarks || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            r.product || "-"
          }</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            r.testDate || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            r.visionType || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">Left Eye</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            r.os_sph || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            r.os_cyl || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            r.os_va || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            r.os_axis || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            r.os_prev_va || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            r.remarks || "-"
          }</td>
          <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
            r.product || "-"
          }</td>
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
    <table style="width:100%;border-collapse:collapse;margin-top:10px;">
      <thead>
        <tr>
          <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Medicine</th>
          <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Dosage</th>
          <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Frequency</th>
          <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Intake</th>
          <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Duration</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (m) => `
          <tr>
            <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
              m.drugName || "-"
            }</td>
            <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
              m.dosage || "-"
            }</td>
            <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
              m.frequency || "-"
            }</td>
            <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
              m.intake || "-"
            }</td>
            <td style="border:1px solid #ddd;padding:10px;background:#fff;">${
              m.duration || "-"
            } day(s)</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
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
        <img src="${logoUrl}" alt="AV Logo" style="width:100%; height:100%; border-radius:8px; object-fit:cover;" />
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
          <img src="${logoUrl}" alt="AV Logo" style="width:100%; height:100%; border-radius:8px; object-fit:cover;" />
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

export default Form;



