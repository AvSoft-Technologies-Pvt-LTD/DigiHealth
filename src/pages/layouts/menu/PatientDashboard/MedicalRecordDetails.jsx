

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import DynamicTable from "../../../../components/microcomponents/DynamicTable";
import DocsReader from "../../../../components/DocsReader";
import {
  ArrowLeft,
  FileText,
  Pill,
  TestTube,
  CreditCard,
  Activity,
  Heart,
  Thermometer,
  CheckCircle,
  AlertTriangle,
  Printer,
  Stethoscope,
  Video,
  Receipt,
} from "lucide-react";
import { createPortal } from "react-dom";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          <h3 className="font-bold">Something went wrong.</h3>
          <p>{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Helper: Load blob, context, and metadata from localStorage
const loadRecordingFromLocalStorage = (key) => {
  const dataUrl = localStorage.getItem(key);
  const metadataStr = localStorage.getItem(`${key}_metadata`);
  if (!dataUrl) {
    return { blob: null, context: null, metadata: null };
  }
  try {
    if (!dataUrl.startsWith("data:")) {
      console.error("Invalid data URL format in localStorage:", dataUrl);
      return { blob: null, context: null, metadata: null };
    }
    const byteString = atob(dataUrl.split(",")[1]);
    const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return {
      blob: new Blob([ab], { type: mimeString }),
      context: null,
      metadata: metadataStr ? JSON.parse(metadataStr) : null,
    };
  } catch (error) {
    console.error("Failed to decode data URL from localStorage:", error);
    return { blob: null, context: null, metadata: null };
  }
};

const VideoPlaybackModal = ({ show, onClose, videoBlob, metadata }) =>
  show
    ? createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative bg-white p-6 rounded-xl w-[90%] max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Consultation Recording</h3>
              <p className="text-sm text-gray-600">
                Recorded on: {metadata?.timestamp ? new Date(metadata.timestamp).toLocaleString() : "N/A"}
              </p>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="bg-black rounded-lg overflow-hidden mb-4">
              {!videoBlob ? (
                <div className="w-full h-96 flex items-center justify-center text-white">
                  <p>No video recording available.</p>
                </div>
              ) : (
                <video
                  controls
                  className="w-full h-96 object-contain"
                  src={URL.createObjectURL(videoBlob)}
                  onError={(e) => {
                    console.error("Video playback error:", e);
                    e.target.error = null;
                    e.target.src = "";
                  }}
                >
                  <p className="text-center text-white p-8">Unable to load video recording.</p>
                </video>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

const PatientMedicalRecordDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const selectedRecord = location.state?.selectedRecord;
  const patientName = location.state?.patientName || selectedRecord?.patientName || selectedRecord?.name || "";
  const email = location.state?.email || selectedRecord?.email || "";
  const phone = location.state?.phone || selectedRecord?.phone || "";
  const gender = location.state?.gender || selectedRecord?.gender || selectedRecord?.sex || "";
  const dob = location.state?.dob || selectedRecord?.dob || "";
  const diagnosis = location.state?.diagnosis || selectedRecord?.diagnosis || selectedRecord?.chiefComplaint || "";
  const firstName = location.state?.firstName || "";
  const lastName = location.state?.lastName || "";
  const patientDetails = location.state?.patientDetails || null;
  const opdPatientData = location.state?.opdPatientData || {};
  const displayPatientName = opdPatientData?.name || patientName || "Guest Patient";
  const displayEmail = opdPatientData?.email || email || selectedRecord?.ptemail || "";
  const displayPhone = opdPatientData?.phone || phone || "";
  const displayGender = opdPatientData?.gender || gender || "";
  const displayDob = opdPatientData?.dob || dob || "";
  const displayDiagnosis = opdPatientData?.diagnosis || diagnosis || "";
  const displayAge = opdPatientData?.age || "";
  const hospitalName = selectedRecord?.hospitalname || selectedRecord?.hospitalName || "AV Hospital";
  const ptemail = selectedRecord?.ptemail || displayEmail;

  const [state, setState] = useState({
    detailsActiveTab: "medical-records",
    billingActiveTab: "pharmacy",
  });
  const [clinicalNotes, setClinicalNotes] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState([]);
  const [labTestsData, setLabTestsData] = useState([]);
  const [vitalsData, setVitalsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoRecordings, setVideoRecordings] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoBlob, setSelectedVideoBlob] = useState(null);
  const [selectedVideoMetadata, setSelectedVideoMetadata] = useState(null);

  const mockData = {
    medicalDetails: {
      chiefComplaint: "High fever with chills, body ache, and headache for 3 days",
      pastHistory: "No significant past medical or surgical history. No known allergies.",
      diagnosis: "Dengue Fever (Confirmed by NS1 Antigen and IgM positive)",
      treatmentGiven: "IV fluids, Paracetamol for fever, complete bed rest, platelet monitoring",
      doctorsNotes: "Patient responded well to treatment. Platelet count stabilized.",
      initialAssessment: "Patient appears weak, febrile, and dehydrated.",
      systematicExamination: "Mild hepatomegaly, no signs of rash or bleeding.",
      investigations: "CBC, Dengue NS1 Antigen, Dengue IgM/IgG, Platelet Count.",
      treatmentAdvice: "Maintain hydration, avoid NSAIDs, and monitor platelet count daily.",
      dischargeSummary: "Patient admitted with dengue fever, treated with supportive care. Patient is stable and ready for discharge.",
    },
    prescriptionsData: [],
    billingData: {
      pharmacy: [
        {
          id: 1,
          medicineName: "Paracetamol 500mg",
          quantity: 15,
          unitPrice: 2.5,
          totalPrice: 37.5,
          date: "02/07/2025",
        },
      ],
      labs: [
        {
          id: 1,
          testName: "Complete Blood Count (CBC)",
          cost: 350.0,
          date: "01/07/2025",
          paymentStatus: "Paid",
        },
      ],
      hospital: [
        {
          id: 1,
          billType: "Room Charges (5 days)",
          amount: 2500.0,
          paymentMode: "Insurance",
          status: "Paid",
          billDate: "06/07/2025",
        },
      ],
    },
    vitalsData: {
      bloodPressure: "120/80 mmHg",
      heartRate: "80 bpm",
      temperature: "98.6°F",
      spO2: "98%",
      respiratoryRate: "16 bpm",
      height: "170 cm",
      weight: "65 kg",
    },
    videoConsultationData: [],
  };

  const calculateAge = (dob, appointmentDate) => {
    if (!dob || !appointmentDate) return "N/A";
    const dobDate = new Date(dob);
    const appointmentDateObj = new Date(appointmentDate);
    let age = appointmentDateObj.getFullYear() - dobDate.getFullYear();
    const monthDiff = appointmentDateObj.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && appointmentDateObj.getDate() < dobDate.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  const calculatedAge = displayAge || calculateAge(displayDob, selectedRecord?.dateOfVisit || selectedRecord?.dateOfAdmission || selectedRecord?.dateOfConsultation);

  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const fetchClinicalNotes = async () => {
    if (!hospitalName || !ptemail) {
      setClinicalNotes(mockData.medicalDetails);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://68abfd0c7a0bbe92cbb8d633.mockapi.io/clinicalnote?hospitalName=${encodeURIComponent(
          hospitalName
        )}&ptemail=${encodeURIComponent(ptemail)}`
      );
      if (response.data.length > 0) {
        const sortedNotes = [...response.data].sort((a, b) => b.id - a.id);
        setClinicalNotes(sortedNotes[0]);
      } else {
        setError("No clinical notes found for this patient and hospital.");
        setClinicalNotes(mockData.medicalDetails);
      }
    } catch (err) {
      setError("Failed to fetch clinical notes.");
      setClinicalNotes(mockData.medicalDetails);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async () => {
    if (!displayEmail) {
      setPrescriptionData([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://68abfd0c7a0bbe92cbb8d633.mockapi.io/prescription?patientEmail=${encodeURIComponent(displayEmail)}`
      );
      if (response.data.length > 0) {
        const formattedData = response.data.map((prescription) => ({
          id: prescription.id,
          date: prescription.date,
          doctorName: prescription.doctorName || "Dr. Rajesh Kumar",
          medicines: prescription.prescriptions
            .map((med) => `${med.drugName} ${med.strength} - ${med.dosage} ${med.dosageUnit} ${med.frequency} for ${med.duration} days`)
            .join(", "),
          instructions: prescription.prescriptions
            .map((med) => `Take ${med.intake}.`)
            .join(" "),
        }));
        setPrescriptionData(formattedData);
      } else {
        setPrescriptionData([]);
      }
    } catch (err) {
      setPrescriptionData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLabTests = async () => {
    if (!hospitalName || !ptemail) {
      setLabTestsData([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://689887d3ddf05523e55f1e6c.mockapi.io/labtestdr?hospitalName=${encodeURIComponent(
          hospitalName
        )}&ptemail=${encodeURIComponent(ptemail)}`
      );
      if (response.data.length > 0) {
        const formattedData = response.data.map((labTest, index) => ({
          id: index + 1,
          date: new Date().toLocaleDateString(),
          testName: labTest.selectedTests.map((test) => test.name).join(", "),
          result: labTest.result || "Pending",
          normalRange: labTest.normalRange || "N/A",
          status: labTest.status || "Pending",
        }));
        setLabTestsData(formattedData);
      } else {
        setLabTestsData([]);
      }
    } catch (err) {
      setLabTestsData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVitalsData = async () => {
    if (!ptemail || !hospitalName) {
      setVitalsData(mockData.vitalsData);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://689887d3ddf05523e55f1e6c.mockapi.io/vitals?ptemail=${encodeURIComponent(
          ptemail
        )}&hospitalName=${encodeURIComponent(hospitalName)}`
      );
      if (response.data.length > 0) {
        const sortedVitals = [...response.data].sort((a, b) => b.timestamp - a.timestamp);
        setVitalsData(sortedVitals[0]);
      } else {
        setVitalsData(mockData.vitalsData);
      }
    } catch (err) {
      setVitalsData(mockData.vitalsData);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideoRecordings = () => {
    const videoKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith(`consultationVideo_${displayEmail}_${hospitalName}`)
    );
    const videos = videoKeys.map((key) => {
      const result = loadRecordingFromLocalStorage(key);
      return {
        key,
        blob: result.blob,
        metadata: result.metadata,
      };
    });
    return videos
      .filter((video) => video.blob !== null && video.metadata)
      .map((video, index) => ({
        id: index + 1,
        date: new Date(video.metadata.timestamp).toLocaleString(),
        type: video.metadata.type || "N/A",
        doctorName: video.metadata.doctorName || "dr Kavya Patil",
        videoBlob: video.blob,
        metadata: video.metadata,
      }))
      .sort((a, b) => b.metadata.timestamp - a.metadata.timestamp);
  };

  useEffect(() => {
    fetchClinicalNotes();
    fetchLabTests();
    fetchVitalsData();
    setVideoRecordings(fetchVideoRecordings());
  }, [hospitalName, displayEmail]);

  useEffect(() => {
    fetchPrescriptions();
  }, [displayEmail]);

  const handleBack = () => {
    navigate("/patientdashboard/medical-record", {
      state: {
        selectedRecord: selectedRecord,
        patientName: displayPatientName,
        email: displayEmail,
        phone: displayPhone,
        gender: displayGender,
        dob: displayDob,
        diagnosis: displayDiagnosis,
        patientDetails: patientDetails,
        opdPatientData: location.state?.opdPatientData || {},
      },
    });
  };

  const printLabTest = (labTest) => {
    const printContents = `
      <div>
        <h3>Lab Test Report</h3>
        <p><strong>Date:</strong> ${labTest.date}</p>
        <p><strong>Test Name:</strong> ${labTest.testName}</p>
        <p><strong>Result:</strong> ${labTest.result}</p>
        <p><strong>Normal Range:</strong> ${labTest.normalRange}</p>
        <p><strong>Status:</strong> ${labTest.status}</p>
      </div>
    `;
    const WinPrint = window.open("", "", "width=900,height=650");
    WinPrint.document.write(`
      <html>
        <head><title>Lab Test Print</title></head>
        <body>${printContents}</body>
      </html>
    `);
    WinPrint.document.close();
    WinPrint.print();
    WinPrint.close();
  };

  const renderTabContent = () => {
    const tabContentMap = {
      "medical-records": (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <FileText size={24} className="text-[var(--primary-color)]" />
              <h3 className="h4-heading">Medical Information</h3>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-8">Loading clinical notes...</div>
          ) : error ? (
            <div className="text-center text-gray-600 py-8">{error}</div>
          ) : clinicalNotes ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Chief Complaint", value: clinicalNotes.chiefComplaint || clinicalNotes.chiefcomplaint || "N/A" },
                { label: "Past History", value: clinicalNotes.pastHistory || clinicalNotes.History || "N/A" },
                { label: "Advice", value: clinicalNotes.treatmentAdvice || clinicalNotes.Advice || "N/A" },
                { label: "Plan", value: clinicalNotes.Plan || "N/A" },
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="font-bold text-sm text-gray-600 mb-2">{item.label}</div>
                  <div className="text-gray-800 text-sm">{item.value}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-8">
              No clinical notes found for this patient and hospital.
            </div>
          )}
          {selectedRecord?.type === "IPD" && (
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-6">
                <FileText size={24} className="text-green-600" />
                <h3 className="h3-heading">Discharge Summary</h3>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100">
                <div className="font-bold text-sm text-gray-600 mb-2">Summary</div>
                <div className="text-gray-800 text-sm">
                  {clinicalNotes?.dischargeSummary || "N/A"}
                </div>
              </div>
            </div>
          )}
        </div>
      ),
      "prescriptions": (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Pill size={20} className="text-purple-600" />
            <h4 className="h4-heading">Prescribed Medications</h4>
          </div>
          {loading ? (
            <div className="text-center py-8">Loading prescriptions...</div>
          ) : prescriptionData.length > 0 ? (
            <DynamicTable
              columns={[
                { header: "Date", accessor: "date" },
                { header: "Doctor Name", accessor: "doctorName" },
                { header: "Medicines", accessor: "medicines" },
                { header: "Instructions", accessor: "instructions" },
              ]}
              data={prescriptionData}
            />
          ) : (
            <div className="text-center text-gray-600 py-8">
              No prescriptions found for this patient.
            </div>
          )}
        </div>
      ),
      "lab-tests": (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <TestTube size={24} className="text-orange-600" />
            <h4 className="h4-heading">Test Results History</h4>
          </div>
          {loading ? (
            <div className="text-center py-8">Loading lab tests...</div>
          ) : error ? (
            <div className="text-center text-gray-600 py-8">{error}</div>
          ) : labTestsData.length > 0 ? (
            <DynamicTable
              columns={[
                { header: "Date", accessor: "date" },
                { header: "Test Name", accessor: "testName" },
                { header: "Result", accessor: "result" },
                { header: "Normal Range", accessor: "normalRange" },
                {
                  header: "Status",
                  accessor: "status",
                  cell: (row) => (
                    <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      row.status === "Normal" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {row.status === "Normal" ? <CheckCircle size={12} className="inline mr-1" /> : <AlertTriangle size={12} className="inline mr-1" />}
                      {row.status}
                    </span>
                  ),
                },
                {
                  header: "Print",
                  accessor: "print",
                  cell: (row) => (
                    <button className="edit-btn flex items-center gap-1" onClick={() => printLabTest(row)}>
                      <Printer size={14} /> Print
                    </button>
                  ),
                },
              ]}
              data={labTestsData}
            />
          ) : (
            <div className="text-center text-gray-600 py-8">No lab tests found.</div>
          )}
        </div>
      ),
      "billing": (
        <div className="space-y-6">
          <DynamicTable
            columns={(() => {
              const columnMaps = {
                pharmacy: [
                  { header: "Medicine Name", accessor: "medicineName" },
                  { header: "Quantity", accessor: "quantity" },
                  { header: "Unit Price (₹)", accessor: "unitPrice" },
                  { header: "Total Price (₹)", accessor: "totalPrice" },
                  { header: "Date", accessor: "date" },
                ],
                labs: [
                  { header: "Test Name", accessor: "testName" },
                  { header: "Cost (₹)", accessor: "cost" },
                  { header: "Date", accessor: "date" },
                  {
                    header: "Payment Status",
                    accessor: "paymentStatus",
                    cell: (row) => (
                      <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        row.paymentStatus === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {row.paymentStatus}
                      </span>
                    ),
                  },
                ],
                hospital: [
                  { header: "Bill Type", accessor: "billType" },
                  { header: "Amount (₹)", accessor: "amount" },
                  { header: "Payment Mode", accessor: "paymentMode" },
                  {
                    header: "Status",
                    accessor: "status",
                    cell: (row) => (
                      <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        row.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {row.status}
                      </span>
                    ),
                  },
                  { header: "Bill Date", accessor: "billDate" },
                ],
              };
              return columnMaps[state.billingActiveTab];
            })()}
            data={mockData.billingData[state.billingActiveTab]}
            tabs={[
              { value: "pharmacy", label: "Pharmacy" },
              { value: "labs", label: "Labs" },
              { value: "hospital", label: "Hospital Bills" },
            ]}
            activeTab={state.billingActiveTab}
            onTabChange={(tab) => setState((prev) => ({ ...prev, billingActiveTab: tab }))}
            filters={[
              {
                key: "paymentStatus",
                label: "Payment Status",
                options: [
                  { value: "Paid", label: "Paid" },
                  { value: "Unpaid", label: "Unpaid" },
                ],
              },
            ]}
          />
        </div>
      ),
      "video": (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Video size={24} className="text-indigo-600" />
            <h4 className="h4-heading">Video Consultation History</h4>
          </div>
          {videoRecordings.length > 0 ? (
            <DynamicTable
              columns={[
                { header: "ID", accessor: "id" },
                { header: "Date", accessor: "date" },
                { header: "Type", accessor: "type" },
                { header: "Doctor Name", accessor: "doctorName" },
                {
                  header: "Actions",
                  accessor: "actions",
                  cell: (row) => (
                    <button
                      className="edit-btn flex items-center gap-1"
                      onClick={() => {
                        if (row.videoBlob) {
                          setSelectedVideoBlob(row.videoBlob);
                          setSelectedVideoMetadata(row.metadata);
                          setShowVideoModal(true);
                        } else {
                          alert("Video recording is not available.");
                        }
                      }}
                    >
                      <Video size={14} /> View Recording
                    </button>
                  ),
                },
              ]}
              data={videoRecordings}
            />
          ) : (
            <div className="text-center text-gray-600 py-8">
              No video recordings found.
            </div>
          )}
        </div>
      ),
    };
    return tabContentMap[state.detailsActiveTab] || null;
  };

  if (!selectedRecord) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          No record selected. Please go back and select a record.
        </div>
      </div>
    );
  }

  const detailsTabs = [
    { id: "medical-records", label: "Medical Records", icon: FileText },
    { id: "prescriptions", label: "Prescriptions", icon: Pill },
    { id: "lab-tests", label: "Lab/Scan", icon: TestTube },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "video", label: "Video", icon: Video },
  ];

  return (
    <ErrorBoundary>
      <div className="p-6 space-y-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 hover:text-[var(--accent-color)] transition-colors text-gray-600"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Medical Records</span>
        </button>

        <div className="bg-gradient-to-r from-[#01B07A] to-[#1A223F] rounded-xl p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 text-white">
          <div className="flex flex-col md:flex-row md:items-start gap-3 sm:gap-4">
            <div className="relative h-12 w-12 sm:h-16 sm:w-16 shrink-0">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-base sm:text-2xl font-bold uppercase shadow-inner ring-2 ring-white ring-offset-2 text-[#01B07A]">
                {getInitials(`${user?.firstName || ""} ${user?.lastName || ""}`.trim())}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
                {user.firstName} {user.lastName}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-1 gap-x-3 sm:gap-x-4 text-xs sm:text-sm">
                <div className="space-y-1">
                  <div>Age: {selectedRecord.age}</div>
                  <div>Gender: {user.gender}</div>
                </div>
                <div className="space-y-1">
                  <div>Hospital: {selectedRecord.hospitalName}</div>
                  <div>
                    Visit Date:{" "}
                    {selectedRecord.dateOfVisit ||
                      selectedRecord.dateOfAdmission ||
                      selectedRecord.dateOfConsultation}
                  </div>
                </div>
                <div className="space-y-1">
                  <div>Diagnosis: {selectedRecord.diagnosis}</div>
                  <div>K/C/O: {selectedRecord["K/C/O"] ?? "--"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-green-600" />
              <h3 className="h4-heading">Vitals Summary</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { key: "bloodPressure", icon: Heart, color: "red", label: "Blood Pressure", value: vitalsData?.bloodPressure || "--" },
              { key: "heartRate", icon: Activity, color: "blue", label: "Heart Rate", value: vitalsData?.heartRate || "--" },
              { key: "temperature", icon: Thermometer, color: "orange", label: "Temperature", value: vitalsData?.temperature || "--" },
              { key: "spO2", icon: null, color: "emerald", label: "SpO2", value: vitalsData?.spO2 || "--" },
              { key: "respiratoryRate", icon: null, color: "violet", label: "Respiratory Rate", value: vitalsData?.respiratoryRate || "--" },
              { key: "height", icon: null, color: "cyan", label: "Height", value: vitalsData?.height || "--" },
              { key: "weight", icon: null, color: "amber", label: "Weight", value: vitalsData?.weight || "--" },
            ].map(({ key, icon: Icon, color, label, value }) => (
              <div key={key} className={`bg-${color}-50 border-l-4 border-${color}-500 p-3 rounded-lg shadow-md`}>
                <div className="flex items-center gap-1 mb-1">
                  {Icon && <Icon size={16} className={`text-${color}-500`} />}
                  <span className={`text-xs font-medium text-${color}-700`}>{label}</span>
                </div>
                <div className={`text-base font-semibold text-${color}-800`}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex border-gray-200 mb-6">
          {detailsTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setState((prev) => ({ ...prev, detailsActiveTab: tab.id }))}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors duration-300 ${
                  state.detailsActiveTab === tab.id
                    ? "border-b-2 text-[var(--primary-color)] border-[var(--primary-color)]"
                    : "text-gray-500 hover:text-[var(--accent-color)]"
                }`}
              >
                <IconComponent size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="animate-slide-fade-in">{renderTabContent()}</div>

        <VideoPlaybackModal
          show={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          videoBlob={selectedVideoBlob}
          metadata={selectedVideoMetadata}
        />
      </div>
    </ErrorBoundary>
  );
};

export default PatientMedicalRecordDetails;