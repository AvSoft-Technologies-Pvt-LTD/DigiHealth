


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
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 text-xs md:text-sm"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 md:p-4">
          <div className="relative bg-white p-3 md:p-6 rounded-xl w-full max-w-md md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="flex justify-between items-center mb-2 md:mb-4">
              <h3 className="text-lg md:text-xl font-semibold">Consultation Recording</h3>
              <p className="text-xs md:text-sm text-gray-600">
                Recorded on: {metadata?.timestamp ? new Date(metadata.timestamp).toLocaleString() : "N/A"}
              </p>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-xl md:text-2xl"
              >
                ×
              </button>
            </div>
            <div className="bg-black rounded-lg overflow-hidden mb-2 md:mb-4">
              {!videoBlob ? (
                <div className="w-full h-48 md:h-64 lg:h-96 flex items-center justify-center text-white text-sm md:text-base">
                  <p>No video recording available.</p>
                </div>
              ) : (
                <video
                  controls
                  className="w-full h-48 md:h-64 lg:h-96 object-contain"
                  src={URL.createObjectURL(videoBlob)}
                  onError={(e) => {
                    console.error("Video playback error:", e);
                    e.target.error = null;
                    e.target.src = "";
                  }}
                >
                  <p className="text-center text-white p-4">Unable to load video recording.</p>
                </video>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-xs md:text-sm"
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

  const handleSecondOpinion = () => {
    const recordToPass = {
      ...selectedRecord,
      medicalDetails: mockData.medicalDetails,
      prescriptionsData: mockData.prescriptionsData,
      labTestsData: mockData.labTestsData,
    };
    navigate("/patientdashboard/second-opinion", { state: { selectedRecord: recordToPass } });
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
        doctorName: video.metadata.doctorName || "Dr. Kavya Patil",
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
    navigate("/patientdashboard/medical-records", {
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
        <div className="space-y-4 md:space-y-6">
         <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 gap-3">
  {/* Left Section */}
  <div className="flex items-center gap-2 md:gap-3">
    <FileText
      size={18}
      className="md:size-[24px] text-[var(--primary-color)]"
    />
    <h3 className="text-base sm:text-lg md:text-xl font-semibold">
      Medical Information
    </h3>
  </div>

  {/* Button Section */}
  <button className="px-3 py-1 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm self-start md:self-auto">
    View Original
  </button>
</div>

          {loading ? (
            <div className="text-center py-6 md:py-8 text-sm md:text-base">Loading clinical notes...</div>
          ) : error ? (
            <div className="text-center text-gray-600 py-6 md:py-8 text-sm md:text-base">{error}</div>
          ) : clinicalNotes ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[
                { label: "Chief Complaint", value: clinicalNotes.chiefComplaint || clinicalNotes.chiefcomplaint || "N/A" },
                { label: "Past History", value: clinicalNotes.pastHistory || clinicalNotes.History || "N/A" },
                { label: "Advice", value: clinicalNotes.treatmentAdvice || clinicalNotes.Advice || "N/A" },
                { label: "Plan", value: clinicalNotes.Plan || "N/A" },
              ].map((item, index) => (
                <div key={index} className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="font-bold text-xs md:text-sm text-gray-600 mb-1.5 md:mb-2">{item.label}</div>
                  <div className="text-gray-800 text-xs md:text-sm">{item.value}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-6 md:py-8 text-sm md:text-base">
              No clinical notes found for this patient and hospital.
            </div>
          )}
          {selectedRecord?.type === "IPD" && (
            <div className="mt-4 md:mt-6">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <FileText size={18} className="md:size-[24px] text-green-600" />
                <h3 className="text-lg md:text-xl font-semibold">Discharge Summary</h3>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100">
                <div className="font-bold text-xs md:text-sm text-gray-600 mb-1.5 md:mb-2">Summary</div>
                <div className="text-gray-800 text-xs md:text-sm">
                  {clinicalNotes?.dischargeSummary || "N/A"}
                </div>
              </div>
            </div>
          )}
        </div>
      ),
      "prescriptions": (
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <Pill size={16} className="md:size-[20px] text-purple-600" />
            <h4 className="text-lg md:text-xl font-semibold">Prescribed Medications</h4>
          </div>
          {loading ? (
            <div className="text-center py-6 md:py-8 text-sm md:text-base">Loading prescriptions...</div>
          ) : prescriptionData.length > 0 ? (
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <DynamicTable
                columns={[
                  { header: "Date", accessor: "date" },
                  { header: "Doctor Name", accessor: "doctorName" },
                  { header: "Medicines", accessor: "medicines" },
                  { header: "Instructions", accessor: "instructions" },
                ]}
                data={prescriptionData}
              />
            </div>
          ) : (
            <div className="text-center text-gray-600 py-6 md:py-8 text-sm md:text-base">
              No prescriptions found for this patient.
            </div>
          )}
        </div>
      ),
      "lab-tests": (
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <TestTube size={18} className="md:size-[24px] text-orange-600" />
            <h4 className="text-lg md:text-xl font-semibold">Test Results History</h4>
          </div>
          {loading ? (
            <div className="text-center py-6 md:py-8 text-sm md:text-base">Loading lab tests...</div>
          ) : error ? (
            <div className="text-center text-gray-600 py-6 md:py-8 text-sm md:text-base">{error}</div>
          ) : labTestsData.length > 0 ? (
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
                      <span className={`text-xs md:text-sm font-semibold px-2 py-1 rounded-full ${
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
                      <button className="px-2 py-1 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition-opacity text-xs flex items-center gap-1" onClick={() => printLabTest(row)}>
                        <Printer size={12} /> Print
                      </button>
                    ),
                  },
                ]}
                data={labTestsData}
              />
            </div>
          ) : (
            <div className="text-center text-gray-600 py-6 md:py-8 text-sm md:text-base">No lab tests found.</div>
          )}
        </div>
      ),
      "billing": (
        <div className="space-y-4 md:space-y-6">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
                        <span className={`text-xs md:text-sm font-semibold px-2 py-1 rounded-full ${
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
                        <span className={`text-xs md:text-sm font-semibold px-2 py-1 rounded-full ${
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
        </div>
      ),
      "video": (
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <Video size={18} className="md:size-[24px] text-indigo-600" />
            <h4 className="text-lg md:text-xl font-semibold">Video Consultation History</h4>
          </div>
          {videoRecordings.length > 0 ? (
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
                        className="px-2 py-1 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition-opacity text-xs flex items-center gap-1"
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
                        <Video size={12} /> View Recording
                      </button>
                    ),
                  },
                ]}
                data={videoRecordings}
              />
            </div>
          ) : (
            <div className="text-center text-gray-600 py-6 md:py-8 text-sm md:text-base">No video recordings found.</div>
          )}
        </div>
      ),
    };
    return tabContentMap[state.detailsActiveTab] || null;
  };

  if (!selectedRecord) {
    return (
      <div className="p-4 md:p-6">
        <div className="text-center text-gray-500 text-sm md:text-base">
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

  const updateState = (updates) => setState((prev) => ({ ...prev, ...updates }));

  return (
    <ErrorBoundary>
      <div className="p-3 md:p-6 space-y-4 md:space-y-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 md:gap-2 hover:text-[var(--accent-color)] transition-colors text-gray-600 text-xs md:text-sm"
        >
          <ArrowLeft size={16} className="md:size-[20px]" />
          <span className="font-medium">Back to Medical Records</span>
        </button>

        {/* Patient Header: Responsive for all devices */}
       <div className="bg-gradient-to-r from-[#01B07A] to-[#1A223F] rounded-xl p-4 sm:p-6 mb-6 text-white">
  {/* Mobile View (iPhone & small phones) */}
  <div className="flex flex-col gap-3 md:hidden">
    {/* Avatar + Name Inline */}
    <div className="flex flex-col items-center mb-2 md:hidden">
    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white text-[#01B07A] text-sm font-bold uppercase shadow-inner ring-2 ring-white">
      {getInitials(displayPatientName)}
    </div>
    <h3 className="text-sm font-bold mt-1 truncate">{displayPatientName}</h3>
  </div>
    {/* Details below name with left margin aligned under name */}
    <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 w-full ps-1 text-[10px] md:hidden">
    <p className="text-left">
      <span className="font-semibold">Age:</span> {calculatedAge}
    </p>
    <p className="text-left">
      <span className="font-semibold">Gender:</span> {displayGender}
    </p>
    <p className="text-left">
      <span className="font-semibold">Hospital:</span> {hospitalName}
    </p>
    <p className="text-left">
      <span className="font-semibold">Visit Date:</span>
      {selectedRecord.dateOfVisit || selectedRecord.dateOfAdmission || selectedRecord.dateOfConsultation || "N/A"}
    </p>
    <p className="col-span-2 text-left break-words">
      <span className="font-semibold">Diagnosis:</span> {displayDiagnosis}
    </p>
    <p className="col-span-2 text-left truncate">
      <span className="font-semibold">K/C/O:</span> {selectedRecord["K/C/O"] ?? "--"}
    </p>
  </div>

  </div>

  {/* Tablet View (iPad) */}
  <div className="hidden md:grid lg:hidden grid-cols-1 gap-2">
    {/* Avatar + Name */}
    <div className="flex items-center gap-3">
      <div className="h-8 w-9 flex items-center justify-center rounded-full bg-white
        text-[#01B07A] text-sm font-bold uppercase shadow-inner ring-4 ring-white ring-offset-2">
        {getInitials(displayPatientName)}
      </div>
      <h3 className="text-lg font-bold truncate">{displayPatientName}</h3>
    </div>
    {/* Details in grid */}
    <div className="grid grid-cols-2 gap-x-6 gap-y-2 ml-12 text-sm">
      <p><span className="font-semibold">Age:</span> {calculatedAge}</p>
      <p><span className="font-semibold">Gender:</span> {displayGender}</p>
      <p><span className="font-semibold">Hospital:</span> {hospitalName}</p>
      <p>
        <span className="font-semibold">Visit Date:</span>
        {selectedRecord.dateOfVisit || selectedRecord.dateOfAdmission || selectedRecord.dateOfConsultation || "N/A"}
      </p>
      <p><span className="font-semibold">Diagnosis:</span> {displayDiagnosis}</p>
      <p><span className="font-semibold">K/C/O:</span> {selectedRecord["K/C/O"] ?? "--"}</p>
    </div>
  </div>

  {/* Desktop View */}
  <div className="hidden lg:flex flex-row sm:items-start gap-6">
    {/* Avatar */}
    <div className="flex-shrink-0 flex justify-start">
      <div className="h-20 w-20 flex items-center justify-center rounded-full bg-white
        text-[#01B07A] text-2xl font-bold uppercase shadow-inner ring-4 ring-white ring-offset-2">
        {getInitials(displayPatientName)}
      </div>
    </div>
    {/* Name + Details */}
    <div className="flex-1">
      <h3 className="text-2xl font-bold mb-3 truncate">{displayPatientName}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6 text-base">
        <div>
          <p><span className="font-semibold">Age:</span> {calculatedAge}</p>
          <p><span className="font-semibold">Gender:</span> {displayGender}</p>
        </div>
        <div>
          <p><span className="font-semibold">Hospital:</span> {hospitalName}</p>
          <p>
            <span className="font-semibold">Visit Date:</span>
            {selectedRecord.dateOfVisit || selectedRecord.dateOfAdmission || selectedRecord.dateOfConsultation || "N/A"}
          </p>
        </div>
        <div>
          <p><span className="font-semibold">Diagnosis:</span> {displayDiagnosis}</p>
          <p><span className="font-semibold">K/C/O:</span> {selectedRecord["K/C/O"] ?? "--"}</p>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Vitals Summary: Responsive Grid */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Activity size={16} className="md:size-[20px] text-green-600" />
              <h3 className="text-lg md:text-xl font-semibold">Vitals Summary</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-3">
            {[
              { key: "bloodPressure", icon: Heart, color: "red", label: "Blood Pressure", value: vitalsData?.bloodPressure || "--" },
              { key: "heartRate", icon: Activity, color: "blue", label: "Heart Rate", value: vitalsData?.heartRate || "--" },
              { key: "temperature", icon: Thermometer, color: "orange", label: "Temperature", value: vitalsData?.temperature || "--" },
              { key: "spO2", icon: null, color: "emerald", label: "SpO2", value: vitalsData?.spO2 || "--" },
              { key: "respiratoryRate", icon: null, color: "violet", label: "Respiratory Rate", value: vitalsData?.respiratoryRate || "--" },
              { key: "height", icon: null, color: "cyan", label: "Height", value: vitalsData?.height || "--" },
              { key: "weight", icon: null, color: "amber", label: "Weight", value: vitalsData?.weight || "--" },
            ].map(({ key, icon: Icon, color, label, value }) => (
              <div key={key} className={`bg-${color}-50 border-l-4 border-${color}-500 p-2 md:p-3 rounded-lg shadow-md`}>
                <div className="flex items-center gap-1 mb-1">
                  {Icon && <Icon size={14} className={`md:size-[16px] text-${color}-500`} />}
                  <span className={`text-xs font-medium text-${color}-700`}>{label}</span>
                </div>
                <div className={`text-sm md:text-base font-semibold text-${color}-800`}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs: Responsive */}
        <div className="flex flex-wrap  mb-3 sm:mb-4">
          {detailsTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => updateState({ detailsActiveTab: tab.id })}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 font-medium transition-colors duration-300 whitespace-nowrap ${
                  state.detailsActiveTab === tab.id
                    ? "border-b-2 text-[var(--primary-color)] border-[var(--primary-color)]"
                    : "text-gray-500 hover:text-[var(--accent-color)]"
                }`}
              >
                <IconComponent size={14} />
                <span className="text-xs sm:text-sm">{tab.label}</span>
              </button>
            );
          })}
          {selectedRecord?.type && !selectedRecord?.isNewlyAdded && (
            <div className="flex-1 flex justify-end">
              <button
                onClick={handleSecondOpinion}
                className="btn btn-primary text-white px-2 sm:px-4 py-1 sm:py-2 text-xs flex items-center gap-1 hover:opacity-90 transition-opacity"
              >
                <Stethoscope size={14} />
                <span className="text-xs sm:text-sm">Second Opinion</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="animate-slide-fade-in overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {selectedRecord.createdBy === "patient" ? (
            <DocsReader />
          ) : (
            renderTabContent()
          )}
        </div>

        {/* Video Modal */}
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