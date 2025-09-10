import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaNotesMedical } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import DynamicTable from "../../../../components/microcomponents/DynamicTable";
import ReusableModal from "../../../../components/microcomponents/Modal";
import TeleConsultFlow from "../../../../components/microcomponents/Call";
import { getFamilyMembersByPatient, getPersonalHealthByPatientId } from "../../../../utils/CrudService";

const API = {
  FORM: "https://681f2dfb72e59f922ef5774c.mockapi.io/addpatient",
  VITAL_SIGNS: "https://6808fb0f942707d722e09f1d.mockapi.io/health-summary",
};

const getCurrentDate = () => new Date().toISOString().slice(0, 10);
const getCurrentTime = () => new Date().toTimeString().slice(0, 5);

const PatientViewSections = ({ data, personalHealthDetails, familyHistory, vitalSigns, loading }) => (
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
        title: "Virtual Consultation Details",
        data: {
          "Scheduled Date": data.scheduledDate,
          "Scheduled Time": data.scheduledTime,
          "Consultation Type": data.consultationType,
          Duration: data.duration ? `${data.duration} minutes` : "Not specified",
          Status: data.consultationStatus,
          Notes: data.notes || "No notes",
        },
      },
      {
        title: "Personal Health Details",
        data: personalHealthDetails
          ? {
              Height: `${personalHealthDetails.height || "N/A"} cm`,
              Weight: `${personalHealthDetails.weight || "N/A"} kg`,
              "Blood Group": personalHealthDetails.bloodGroupName || personalHealthDetails.bloodGroup || "N/A",
              Allergies: personalHealthDetails.allergies || "None",
              Surgeries: personalHealthDetails.surgeries || "None",
              Smoking: personalHealthDetails.isSmoker ? "Yes" : "No",
              "Years Smoking": personalHealthDetails.isSmoker ? personalHealthDetails.yearsSmoking || "Not specified" : "N/A",
              Alcohol: personalHealthDetails.isAlcoholic ? "Yes" : "No",
              "Years Alcohol": personalHealthDetails.isAlcoholic ? personalHealthDetails.yearsAlcoholic || "Not specified" : "N/A",
              Tobacco: personalHealthDetails.isTobacco ? "Yes" : "No",
              "Years Tobacco": personalHealthDetails.isTobacco ? personalHealthDetails.yearsTobacco || "Not specified" : "N/A",
            }
          : null,
      },
      {
        title: "Family History",
        isArray: true,
        data: familyHistory,
      },
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
                <p><strong>{member.memberName || member.name}</strong> ({member.relationName || member.relation})</p>
                <p><strong>Phone:</strong> {member.phoneNumber || member.phone || "Not provided"}</p>
                <p><strong>Health Conditions:</strong> {member.healthConditions?.length > 0 ? member.healthConditions.map((c) => c.healthConditionName || c.name).join(", ") : "None reported"}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No data available</p>
          )
        ) : section.data ? (
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(section.data).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value || "N/A"}</p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No data available</p>
        )}
      </div>
    ))}
  </div>
);

const PatientViewModal = ({ isOpen, onClose, patient, personalHealthDetails, familyHistory, vitalSigns, loading, onEdit }) => {
  if (!isOpen) return null;
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="flex flex-col relative w-full max-w-4xl max-h-[95vh] rounded-xl bg-white shadow-xl overflow-hidden" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="sticky top-0 z-20 bg-gradient-to-r from-[#01B07A] to-[#1A223F] rounded-t-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#01B07A] text-xl font-bold uppercase shadow-inner">
                {(patient?.name || "NA").substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{patient?.name || "-"}</h2>
                <p className="text-white text-lg">Virtual #{patient?.sequentialId || "-"}</p>
              </div>
            </div>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full border border-white text-white hover:bg-white hover:text-[#01B07A] transition-all duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <PatientViewSections data={patient || {}} personalHealthDetails={personalHealthDetails} familyHistory={familyHistory} vitalSigns={vitalSigns} loading={loading} />
        </div>
        <div className="bg-white border-t p-4 flex justify-end">
          <button onClick={() => onEdit(patient)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Edit Consultation</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const VirtualTab = forwardRef(({ doctorName, masterData, location, setTabActions }, ref) => {
  const navigate = useNavigate();
  const [virtualPatients, setVirtualPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPatientId, setNewPatientId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modals, setModals] = useState({ scheduleConsultation: false, viewPatient: false, editPatient: false });
  const [consultationFormData, setConsultationFormData] = useState({ scheduledDate: getCurrentDate(), scheduledTime: getCurrentTime(), duration: 30 });
  const [personalHealthDetails, setPersonalHealthDetails] = useState(null);
  const [familyHistory, setFamilyHistory] = useState([]);
  const [vitalSigns, setVitalSigns] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Expose the openScheduleConsultationModal function to the parent
  useImperativeHandle(ref, () => ({
    openScheduleConsultationModal: () => {
      openModal("scheduleConsultation");
    },
  }));

  const CONSULTATION_FIELDS = [
    { name: "firstName", label: "First Name", type: "text", required: true },
    { name: "lastName", label: "Last Name", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true },
    { name: "phone", label: "Phone Number", type: "text", required: true },
    { name: "consultationType", label: "Consultation Type", type: "select", required: true, options: ["Video Call", "Voice Call", "Chat"].map((t) => ({ value: t, label: t })) },
    { name: "scheduledDate", label: "Scheduled Date", type: "date", required: true },
    { name: "scheduledTime", label: "Scheduled Time", type: "time", required: true },
    { name: "duration", label: "Duration (minutes)", type: "number", required: true },
    { name: "notes", label: "Consultation Notes", type: "textarea", colSpan: 2 },
  ];

  const fetchAllPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch(API.FORM);
      const allPatients = await res.json();
      const processedPatients = allPatients.map((p) => ({
        ...p,
        name: p.name || [p.firstName, p.middleName, p.lastName].filter(Boolean).join(" "),
        fullName: [p.firstName, p.middleName, p.lastName].filter(Boolean).join(" "),
      })).reverse();

      setVirtualPatients(processedPatients.filter((p) => (p.type?.toLowerCase() === "virtual" || p.consultationType) && p.doctorName === doctorName)
        .map((p, i) => ({
          ...p,
          sequentialId: i + 1,
          scheduledDateTime: p.scheduledDateTime || (p.scheduledDate && p.scheduledTime ? `${p.scheduledDate} ${p.scheduledTime}` : "Not scheduled"),
          consultationStatus: p.consultationStatus || "Scheduled",
          duration: p.duration || 30,
          temporaryAddress: p.temporaryAddress || p.addressTemp || p.address || "",
          address: p.address || p.temporaryAddress || p.addressTemp || "",
          addressTemp: p.addressTemp || p.temporaryAddress || p.address || "",
          consultationType: p.consultationType || "Video Call",
        })));
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to fetch patients");
    } finally { setLoading(false); }
  };

  const fetchPatientDetails = async (patientId) => {
    if (!patientId) return;
    setDetailsLoading(true);
    try {
      const [personalRes, familyRes, vitalRes] = await Promise.all([
        getPersonalHealthByPatientId(patientId).catch(() => ({ data: null })),
        getFamilyMembersByPatient(patientId).catch(() => ({ data: [] })),
        fetch(API.VITAL_SIGNS).then((res) => res.json()).catch(() => []),
      ]);
      setPersonalHealthDetails(personalRes.data || null);
      setFamilyHistory(Array.isArray(familyRes.data) ? familyRes.data : []);
      const patientEmail = selectedPatient?.email?.toLowerCase().trim();
      setVitalSigns(Array.isArray(vitalRes) ? vitalRes.find((v) => v.email?.toLowerCase().trim() === patientEmail) || null : null);
      toast.success("Patient details loaded successfully!");
    } catch (error) {
      console.error("Error fetching patient details:", error);
      toast.error("Failed to fetch some patient details");
      setPersonalHealthDetails(null);
      setFamilyHistory([]);
      setVitalSigns(null);
    } finally { setDetailsLoading(false); }
  };

  const openModal = (modalName) => setModals((prev) => ({ ...prev, [modalName]: true }));
  const closeModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
    if (modalName === "scheduleConsultation") setConsultationFormData({ scheduledDate: getCurrentDate(), scheduledTime: getCurrentTime(), duration: 30 });
    if (modalName === "viewPatient" || modalName === "editPatient") {
      setSelectedPatient(null);
      setPersonalHealthDetails(null);
      setFamilyHistory([]);
      setVitalSigns(null);
      setDetailsLoading(false);
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
    setConsultationFormData({
      ...patient,
      scheduledDate: patient.scheduledDate || getCurrentDate(),
      scheduledTime: patient.scheduledTime || getCurrentTime(),
      duration: patient.duration || 30,
    });
    closeModal("viewPatient");
    openModal("editPatient");
  };

  const handleUpdateConsultation = async (formData) => {
    try {
      const payload = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        type: "virtual",
        scheduledDateTime: `${formData.scheduledDate} ${formData.scheduledTime}`,
        consultationStatus: "Scheduled",
        doctorName,
        updatedAt: new Date().toISOString(),
      };
      const response = await fetch(`${API.FORM}/${selectedPatient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update consultation");
      toast.success("Consultation updated successfully!");
      closeModal("editPatient");
      fetchAllPatients();
    } catch (error) {
      console.error("Error updating consultation:", error);
      toast.error("Failed to update consultation");
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
      const response = await fetch(API.FORM, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to schedule consultation");
      const responseData = await response.json();
      toast.success("Virtual consultation scheduled successfully!");
      closeModal("scheduleConsultation");
      setNewPatientId(responseData.id);
      fetchAllPatients();
    } catch (error) {
      console.error("Error scheduling consultation:", error);
      toast.error("Failed to schedule consultation.");
    }
  };

  const handleAddRecord = (patient) => navigate("/doctordashboard/form", { state: { patient } });

  const columns = [
    { header: "ID", accessor: "sequentialId" },
    {
      header: "Name",
      accessor: "name",
      clickable: true,
      cell: (row) => (
        <button className="cursor-pointer text-[var(--primary-color)] hover:text-[var(--accent-color)]" onClick={() => handleViewPatient(row)}>
          {row.name || `${row.firstName || ""} ${row.middleName || ""} ${row.lastName || ""}`.replace(/\s+/g, " ").trim()}
        </button>
      ),
    },
    { header: "Date", accessor: "scheduledDate" },
    { header: "Time", accessor: "scheduledTime" },
    { header: "Type", accessor: "consultationType" },
    { header: "Duration", accessor: "duration" },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleAddRecord(row)} className="text-base p-1"><FaNotesMedical /></button>
          <TeleConsultFlow phone={row.phone} patientName={row.name || `${row.firstName || ""} ${row.middleName || ""} ${row.lastName || ""}`.replace(/\s+/g, " ").trim()} context="Virtual" patientEmail={row.email} hospitalName={row.hospitalName || "AV Hospital"} />
          <button title="View Medical Record" onClick={() => {
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
                temporaryAddress: row.temporaryAddress || row.addressTemp || row.address || "",
                address: row.address || row.temporaryAddress || row.addressTemp || "",
                addressTemp: row.addressTemp || row.temporaryAddress || row.address || "",
                dob: row.dob || "",
                age: age,
                bloodType: row.bloodGroup || row.bloodType || "",
                regNo: row.regNo || "2025/072/0032722",
                mobileNo: row.mobileNo || row.phone || "",
                department: row.department || "Ophthalmology",
              },
            });
          }} className="p-1 text-base text-[var(--primary-color)]" style={{ display: "flex", alignItems: "center" }}><FiExternalLink /></button>
        </div>
      ),
    },
  ];

  const tabActions = [];

  const filters = [
    { key: "consultationStatus", label: "Status", options: ["Scheduled", "Completed", "Cancelled"].map((status) => ({ value: status, label: status })) },
    { key: "consultationType", label: "Type", options: ["Video Call", "Voice Call", "Chat"].map((type) => ({ value: type, label: type })) },
  ];

  useEffect(() => { if (doctorName && !masterData.loading) fetchAllPatients(); }, [doctorName, masterData.loading]);
  useEffect(() => { const highlightIdFromState = location.state?.highlightId; if (highlightIdFromState) setNewPatientId(highlightIdFromState); }, [location.state]);
  useEffect(() => { setTabActions(tabActions); }, [setTabActions]);

  return (
    <>
      <DynamicTable
        columns={columns}
        data={virtualPatients}
        filters={filters}
        loading={loading}
        onViewPatient={handleViewPatient}
        newRowIds={[newPatientId].filter(Boolean)}
        tabActions={tabActions}
        rowClassName={(row) => row.sequentialId === newPatientId || row.sequentialId === location.state?.highlightId ? "font-bold bg-yellow-100 hover:bg-yellow-200 transition-colors duration-150" : ""}
      />

      <PatientViewModal isOpen={modals.viewPatient} onClose={() => closeModal("viewPatient")} patient={selectedPatient} personalHealthDetails={personalHealthDetails} familyHistory={familyHistory} vitalSigns={vitalSigns} loading={detailsLoading} onEdit={handleEditPatient} />

      <ReusableModal isOpen={modals.scheduleConsultation} onClose={() => closeModal("scheduleConsultation")} mode="add" title="Schedule Virtual Consultation" fields={CONSULTATION_FIELDS} data={consultationFormData} onSave={handleScheduleConsultation} onChange={setConsultationFormData} saveLabel="Schedule" cancelLabel="Cancel" size="lg"
        extraContent={<div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200"><h4 className="text-sm font-semibold text-green-800 mb-2">Virtual Consultation Info</h4><p className="text-sm text-green-700">This will create a virtual consultation appointment. The patient will receive notification with joining details.</p></div>}
      />

      <ReusableModal isOpen={modals.editPatient} onClose={() => closeModal("editPatient")} mode="edit" title="Edit Virtual Consultation" fields={CONSULTATION_FIELDS} data={consultationFormData} onSave={handleUpdateConsultation} onChange={setConsultationFormData} saveLabel="Update" cancelLabel="Cancel" size="lg" />
    </>
  );
});

export default VirtualTab;
