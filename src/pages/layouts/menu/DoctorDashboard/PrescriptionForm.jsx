



import React, { useState, useRef, useEffect } from "react";
import {
  Pill,
  Save,
  Printer,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Camera,
  Share2,
  Phone,
  Mail,
  Globe,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultMedicine = {
  drugName: "",
  form: "",
  strength: "",
  dosage: 1,
  dosageUnit: "Tablet",
  frequency: "",
  intake: "Before Food",
  duration: 1,
};

const frequencyOptions = [
  "once a day",
  "twice a day",
  "three times a day",
  "every 6 hours",
  "every 8 hours",
];

const intakeOptions = ["Before Food", "After Food"];

const localDrugList = [
  { id: 1, name: "Dolo 650", strength: "650mg", form: "Tablet" },
  { id: 2, name: "Paracetamol", strength: "500mg", form: "Tablet" },
  { id: 3, name: "Ibuprofen", strength: "400mg", form: "Tablet" },
];

const PrescriptionForm = ({
  data,
  onSave,
  onPrint,
  patient,
  patientName,
  gender,
  age,
  email: propEmail,
  phone: propPhone,
  address,
  showShareModal,
  setShowShareModal,
  doctorName, // Add doctorName prop
}) => {
  const [prescriptions, setPrescriptions] = useState(
    data?.prescriptions || [{ ...defaultMedicine }]
  );
  const [drugSuggestions, setDrugSuggestions] = useState([]);
  const [activeInputIndex, setActiveInputIndex] = useState(null);
  const [isSaved, setIsSaved] = useState(!!data?.id);
  const [prescriptionId, setPrescriptionId] = useState(data?.id || null);
  const [isEdit, setIsEdit] = useState(!data?.id);
  const [capturedImage, setCapturedImage] = useState(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    setEmail(propEmail || patient?.email || "");
    setPhone(propPhone || patient?.phone || patient?.mobileNo || "");
  }, [propEmail, propPhone, patient]);

  const handleChange = (i, field, val) => {
    setPrescriptions((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, [field]: val } : p))
    );
  };

  const addPrescription = () => {
    setPrescriptions((prev) => [...prev, { ...defaultMedicine }]);
  };

  const removePrescription = (i) => {
    if (prescriptions.length > 1) {
      setPrescriptions((prev) => prev.filter((_, idx) => idx !== i));
    } else {
      toast.warning("At least one prescription is required.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleSave = async () => {
    if (!email || !phone) {
      toast.error("❌ Email and phone are required.", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
      });
      return;
    }
    const prescriptionPayload = {
      prescriptions,
      date: new Date().toLocaleDateString(),
      patientName: patientName || patient?.name || patient?.patientName || "Unknown",
      patientEmail: email,
      patientPhone: phone,
      patientGender: gender,
      patientAge: age,
      doctorName: doctorName || "Dr. Kavya Patil", // Include doctorName
      type: "prescription",
    };
    try {
      const response = await fetch(
        "https://68abfd0c7a0bbe92cbb8d633.mockapi.io/prescription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prescriptionPayload),
        }
      );
      if (!response.ok) {
        throw new Error(`API failed: ${response.status}`);
      }
      const result = await response.json();
      setIsSaved(true);
      setPrescriptionId(result.id);
      setIsEdit(false);
      if (onSave) {
        onSave("prescription", { prescriptions, id: result.id });
      }
      toast.success("✅ Prescription saved successfully!", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
      });
    } catch (error) {
      console.error("API Error:", error);
      toast.error(`❌ ${error.message}`, {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
      });
    }
  };

  const handleUpdate = async () => {
    if (!prescriptionId) {
      toast.error("❌ Prescription ID is missing.", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
      });
      return;
    }
    const prescriptionPayload = {
      prescriptions,
      date: new Date().toLocaleDateString(),
      patientName: patientName || patient?.name || patient?.patientName || "Unknown",
      patientEmail: email,
      patientPhone: phone,
      patientGender: gender,
      patientAge: age,
      doctorName: doctorName || "Dr. Kavya Patil", // Include doctorName
      type: "prescription",
    };
    try {
      const response = await fetch(
        `https://68abfd0c7a0bbe92cbb8d633.mockapi.io/prescription/${prescriptionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prescriptionPayload),
        }
      );
      if (!response.ok) {
        throw new Error(`API failed: ${response.status}`);
      }
      setIsEdit(false);
      if (onSave) {
        onSave("prescription", { prescriptions, id: prescriptionId });
      }
      toast.success("✅ Prescription updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
      });
    } catch (error) {
      console.error("API Error:", error);
      toast.error(`❌ ${error.message}`, {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
      });
    }
  };

  const fetchDrugSuggestions = async (query) => {
    if (query.length < 2) {
      setDrugSuggestions([]);
      return;
    }
    try {
      const response = await fetch("https://mocki.io/v1/efc542df-dc4c-4b06-9e5b-32567facef11");
      const drugs = await response.json();
      const filteredDrugs = drugs.length > 0 ? drugs : localDrugList;
      setDrugSuggestions(
        filteredDrugs.filter((drug) =>
          drug.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    } catch (error) {
      setDrugSuggestions(
        localDrugList.filter((drug) =>
          drug.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const generateWhatsAppMessage = () => {
    let message = `*Prescription from AV Hospital*\n`;
    message += `*Patient:* ${patientName || patient?.name || patient?.patientName || "---"}\n`;
    message += `*Doctor:* ${doctorName || "Dr. Kavya Patil"}\n`; // Include doctorName
    message += `*Date:* ${new Date().toLocaleDateString()}\n\n`;
    message += `*Prescribed Medicines:*\n`;
    prescriptions.forEach((med, index) => {
      message += `${index + 1}. *${med.drugName || "Medicine"}*\n`;
      message += `   - Dosage: ${med.dosage} ${med.dosageUnit || "Tablet"}\n`;
      message += `   - Frequency: ${med.frequency || "As directed"}\n`;
      message += `   - Intake: ${med.intake}\n`;
      message += `   - Duration: ${med.duration} day(s)\n\n`;
    });
    return encodeURIComponent(message);
  };

  const formattedPhone = String(phone).replace(/\D/g, "");
  const whatsappLink = `https://wa.me/${formattedPhone}?text=${generateWhatsAppMessage()}`;

  const openShareModal = () => {
    if (setShowShareModal) {
      setShowShareModal(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slideIn">
        <div className="sub-heading px-6 py-4 flex justify-between items-center bg-[var(--primary-color)]">
          <div className="flex items-center gap-3">
            <Pill className="text-xl text-white" />
            <h3 className="text-white font-semibold">Prescription</h3>
          </div>
          <div className="flex items-center gap-3 text-white">
            <button
              onClick={openShareModal}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              title="Share Prescription"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onPrint && onPrint("prescription")}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              title="Print Prescription"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>
        {capturedImage && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Attached Documents
            </h3>
            <div className="flex gap-4 items-center">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Patient Photo</p>
                <img
                  src={capturedImage}
                  alt="Patient"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                />
                <button
                  onClick={() => setCapturedImage(null)}
                  className="text-xs text-red-500 hover:text-red-700 mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Medicine</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Dosage</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Frequency</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Intake</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Duration (days)</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((med, i) => (
                  <tr key={i} className="border-t border-gray-200">
                    <td className="px-4 py-3 relative">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                        placeholder="Search or enter drug name"
                        value={med.drugName}
                        onChange={(e) => {
                          handleChange(i, "drugName", e.target.value);
                          fetchDrugSuggestions(e.target.value);
                          setActiveInputIndex(i);
                        }}
                        onFocus={() => setActiveInputIndex(i)}
                        onBlur={() => setTimeout(() => setDrugSuggestions([]), 200)}
                        disabled={!isEdit}
                      />
                      {activeInputIndex === i && drugSuggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
                          {drugSuggestions.map((drug) => (
                            <li
                              key={drug.id}
                              onClick={() => {
                                handleChange(i, "drugName", drug.name);
                                handleChange(i, "form", drug.form || "");
                                handleChange(i, "strength", drug.strength || "");
                                setDrugSuggestions([]);
                              }}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                              <strong>{drug.name}</strong> ({drug.strength}, {drug.form})
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          className="w-16 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                          placeholder="Qty"
                          min="1"
                          value={med.dosage}
                          onChange={(e) => handleChange(i, "dosage", +e.target.value)}
                          disabled={!isEdit}
                        />
                        <select
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                          value={med.dosageUnit}
                          onChange={(e) => handleChange(i, "dosageUnit", e.target.value)}
                          disabled={!isEdit}
                        >
                          <option value="Tablet">Tablet</option>
                          <option value="Capsule">Capsule</option>
                          <option value="ml">ml</option>
                          <option value="gm">gm</option>
                          <option value="mg">mg</option>
                          <option value="Drops">Drops</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                        value={med.frequency}
                        onChange={(e) => handleChange(i, "frequency", e.target.value)}
                        disabled={!isEdit}
                      >
                        <option value="">Select frequency</option>
                        {frequencyOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                        value={med.intake}
                        onChange={(e) => handleChange(i, "intake", e.target.value)}
                        disabled={!isEdit}
                      >
                        {intakeOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                        placeholder="Days"
                        min="1"
                        value={med.duration}
                        onChange={(e) => handleChange(i, "duration", +e.target.value)}
                        disabled={!isEdit}
                      />
                    </td>
                    <td className="px-4 py-3">
                      {isEdit && (
                        <button
                          onClick={() => removePrescription(i)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isEdit && (
            <div className="mt-4">
              <button
                onClick={addPrescription}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Medicine
              </button>
            </div>
          )}
          <div className="flex justify-end gap-3 mt-6">
            {!isSaved ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                Save Prescription
              </button>
            ) : isEdit ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm"
                >
                  <Check className="w-4 h-4" />
                  Update
                </button>
                <button
                  onClick={() => {
                    setPrescriptions(data?.prescriptions || [{ ...defaultMedicine }]);
                    setIsEdit(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit Prescription
              </button>
            )}
          </div>
        </div>
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </>
  );
};

export default PrescriptionForm;