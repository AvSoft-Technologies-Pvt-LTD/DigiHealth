// File: DrForm/Form.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import VitalsForm from "./VitalsForm";
import ClinicalNotesForm from "./ClinicalNotesForm";
import LabTestsForm from "./LabResultsForm";
import EyeTestForm from "./EyeTestForm";
import DentalForm from "./DentalForm";
import PrescriptionForm from "./PrescriptionForm";
import SignatureArea from "./SignatureArea";
import ShareModalContent from "./ShareModalContent";
import { ChartModal } from "./VitalsChart";
import Header from "./Header"; // NEW: extracted header component
import {
  getVitalsTemplate,
  getClinicalNotesTemplate,
  getLabResultsTemplate,
  getDentalTemplate,
  getEyeTestTemplate,
  getPrescriptionTemplate,
  getStyledPrescriptionHTML,
} from "./templates";

// formTypes kept here to be reused by header/tabs components
export const formTypes = {
  all: { id: "all", name: "All", icon: null, color: "", description: "Show all forms together" },
  template: { id: "template", name: "Case", icon: null, color: "" },
  vitals: { id: "vitals", name: "Vital Signs", icon: null },
  prescription: { id: "prescription", name: "Prescription", icon: null },
  clinical: { id: "clinical", name: "Clinical Notes", icon: null },
  lab: { id: "lab", name: "Lab Tests", icon: null },
  dental: { id: "dental", name: "Dental Exam", icon: null },
  eye: { id: "eye", name: "Eye Test", icon: null },
};

const AVLogo = "/logo.png"; // keep asset path relative — user said assets are outside

const Form = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient =
    location.state?.patient ||
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
  const [showMoreForms, setShowMoreForms] = useState(false); // still used by some flows if needed
  const signaturePadRef = useRef();
  const printWindowRef = useRef(null);
  const isIPDPatient = (patient?.type || "").toLowerCase() === "ipd";

  useEffect(() => {
    const storedImages = localStorage.getItem("medicalImages");
    const storedSignature = localStorage.getItem("doctorSignature");
    if (storedImages) setAnnotatedImages(JSON.parse(storedImages));
    if (storedSignature) setDoctorSignature(storedSignature);
  }, []);

  // reuseable helpers that were in original file
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const getPatientName = () =>
    patient.name || `${patient.firstName || ""} ${patient.middleName || ""} ${patient.lastName || ""}`.trim() ||
    "Unknown Patient";

  const getPatientAge = () =>
    patient.age && patient.age !== "N/A" ? patient.age : calculateAge(patient.dob);

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

  const handleSaveForm = (formType, data) => {
    setFormsData((prev) => {
      const next = { ...prev, [formType]: data };
      localStorage.setItem("medicalForms", JSON.stringify(next));
      return next;
    });
  };

  const handleFormTypeClick = (formType) => {
    if (formType === "template") {
      navigate("/doctordashboard/template", { state: { patient, annotatedImages, from: "form" } });
    } else setActiveForm(formType);
  };

  const handlePrintForm = (formType) => {
    const data = formsData[formType];
    if (!data) return;
    const doctor = { name: "Dr. Sheetal S. Shelke", specialization: "Neurologist", regNo: "MH123456", qualifications: "MBBS, MD" };
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
    const header = getStyledPrescriptionHTML(doctor, patient, doctorSignature, AVLogo, formContent);
    if (printWindowRef.current && !printWindowRef.current.closed) printWindowRef.current.close();
    printWindowRef.current = window.open("", "", "width=800,height=600");
    if (printWindowRef.current) {
      printWindowRef.current.document.write(header);
      printWindowRef.current.document.close();
      printWindowRef.current.print();
    }
  };

  const printAllForms = () => {
    const doctor = { name: "Dr. Sheetal S. Shelke", specialization: "Neurologist", regNo: "MH123456", qualifications: "MBBS, MD" };
    const formsHtml = Object.keys(formsData)
      .filter((formType) => formsData[formType] && Object.keys(formsData[formType]).length > 0)
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
    const header = getStyledPrescriptionHTML(doctor, patient, doctorSignature, AVLogo, formsHtml);
    if (printWindowRef.current && !printWindowRef.current.closed) printWindowRef.current.close();
    printWindowRef.current = window.open("", "", "width=1000,height=800");
    if (printWindowRef.current) {
      printWindowRef.current.document.write(`<!doctype html><html><head><title>Print All Forms</title></head><body>${header}</body></html>`);
      printWindowRef.current.document.close();
      printWindowRef.current.focus();
      setTimeout(() => { printWindowRef.current.print(); }, 500);
    }
  };

  const commonProps = { onSave: handleSaveForm, onPrint: handlePrintForm, patient, setIsChartOpen, setChartVital };

  const renderActiveForm = () => {
    if (activeForm === "all") {
      return (
        <div className="space-y-8 animate-slideIn">
          <VitalsForm data={formsData.vitals} {...commonProps} hospitalName="AV Hospital" ptemail={patient.email}  doctorId={patient.doctorId || 1} // Ensure doctorId is passed
  patientId={patient.id || 1} />
          <PrescriptionForm data={formsData.prescription} {...commonProps} setShowShareModal={setShowShareModal} doctorName="Dr. Kavya Patil" />
          <ClinicalNotesForm data={formsData.clinical} {...commonProps} ptemail={patient.email} hospitalname="AV Hospital" drEmail="dr.sheetal@example.com" drname="Dr. Sheetal S. Shelke" patientname={getPatientName()} diagnosis={patient.diagnosis} type={patient.type} />
          <LabTestsForm data={formsData.lab} {...commonProps} hospitalName="AV Hospital" ptemail={patient.email} />
          <EyeTestForm data={formsData.eye} {...commonProps} />
          <DentalForm data={formsData.dental} {...commonProps} />
        </div>
      );
    }

    return ({
      vitals: <VitalsForm data={formsData.vitals} {...commonProps} hospitalName="AV Hospital" ptemail={patient.email} />,
      prescription: <PrescriptionForm data={formsData.prescription} {...commonProps} setShowShareModal={setShowShareModal} doctorName="Dr. Kavya Patil" />,
      clinical: <ClinicalNotesForm data={formsData.clinical} {...commonProps} ptemail={patient.email} hospitalname="AV Hospital" drEmail="dr.sheetal@example.com" drname="Dr. Sheetal S. Shelke" patientname={getPatientName()} diagnosis={patient.diagnosis} type={patient.type} />,
      lab: <LabTestsForm data={formsData.lab} {...commonProps} hospitalName="AV Hospital" ptemail={patient.email} />,
      eye: <EyeTestForm data={formsData.eye} {...commonProps} />,
      dental: <DentalForm data={formsData.dental} {...commonProps} />,
    }[activeForm] || null);
  };

  return (
    <div className="flex min-h-screen">
  <div className="flex-1 flex flex-col">

     
        {/* Header + tabs moved to separate component */}
        <Header
          patient={patient}
          activeForm={activeForm}
          setActiveForm={handleFormTypeClick}
          printAllForms={printAllForms}
          getPatientName={getPatientName}
          getPatientAge={getPatientAge}
          getCombinedWardInfo={getCombinedWardInfo}
          isIPDPatient={isIPDPatient}
          showPatientDetails={showPatientDetails}
          setShowPatientDetails={setShowPatientDetails}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

<div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-[96px] py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">{renderActiveForm()}</div>

          <SignatureArea
            signaturePadRef={signaturePadRef}
            doctorSignature={doctorSignature}
            setDoctorSignature={setDoctorSignature}
          />

        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <ShareModalContent onClose={()=>setShowShareModal(false)} prescriptions={formsData.prescription?.prescriptions||[]} patient={patient} />
        </div>
      )}

      <ChartModal isOpen={isChartOpen} onClose={()=>setIsChartOpen(false)} vital={chartVital} records={formsData.vitals?.vitalsRecords || []} selectedIdx={null} />
    </div>
  );
};

export default Form;
