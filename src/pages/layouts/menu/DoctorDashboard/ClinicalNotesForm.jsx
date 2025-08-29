


import React, { useState, useEffect, useCallback } from "react";
import { FileText, Save, Printer } from "lucide-react";
import { toast } from "react-toastify";
import VoiceButton from "./VoiceButton";
import { useOptimizedVoiceRecognition } from "./useOptimizedVoiceRecognition";

const ClinicalNotesForm = ({
  data,
  onSave,
  onPrint,
  ptemail,
  hospitalname,
  drEmail,
  drname,
  patientname,
  diagnosis,
  type,
}) => {
  const [formData, setFormData] = useState(
    data || {
      chiefComplaint: "",
      history: "",
      advice: "",
      plan: "",
    }
  );

  useEffect(() => {
    setFormData(
      data || { chiefComplaint: "", history: "", advice: "", plan: "" }
    );
  }, [data]);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!drEmail || !hospitalname || !patientname || !ptemail) {
      toast.error("❌ Required data is missing.", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
      });
      return;
    }
    const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const currentTimestamp = new Date().toISOString(); // Full timestamp
    // Determine which dates to send based on type
    const dateFields = {
      dateOfVisit: currentDate,
      dateOfAdmission: type?.toUpperCase() === "IPD" ? currentDate : null,
      dateOfDischarge: type?.toUpperCase() === "IPD" ? currentDate : null,
      dateOfConsultation: type?.toUpperCase() === "VIRTUAL" ? currentDate : null,
    };
    const clinicalNotePayload = {
      chiefcomplaint: formData.chiefComplaint,
      History: formData.history,
      Advice: formData.advice,
      Plan: formData.plan,
      hospitalName: hospitalname,
      drname: drname,
      dremail: drEmail,
      patientname: patientname,
      ptemail: ptemail,
      type: type ? type.toUpperCase() : "OPD",
      createdAt: currentTimestamp, // Add this
    };
    const patientMRPayload = {
      hospitalName: hospitalname,
      ptemail: ptemail,
      dremail: drEmail,
      diagnosis: diagnosis || "N/A", // Use the diagnosis prop
      type: type ? type.toUpperCase() : "OPD",
      ...dateFields, // Spread the appropriate dates
      status: "Active", // You can set a default or pass as prop
      patientEmail: ptemail, // Use ptemail as patientEmail for consistency
      patientPhoneNumber: "Not provided", // You can pass as prop if available
      createdAt: currentTimestamp,
      createdBy: "doctor",
    };
    try {
      const clinicalNoteResponse = await fetch(
        "https://68abfd0c7a0bbe92cbb8d633.mockapi.io/clinicalnote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clinicalNotePayload),
        }
      );
      if (!clinicalNoteResponse.ok) {
        throw new Error(`Clinical note API failed: ${clinicalNoteResponse.status}`);
      }
      const patientMRResponse = await fetch(
        "https://6895d385039a1a2b28907a16.mockapi.io/pt-mr/patient-mrec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patientMRPayload),
        }
      );
      if (!patientMRResponse.ok) {
        throw new Error(`Patient MR API failed: ${patientMRResponse.status}`);
      }
      toast.success("✅ Clinical notes saved and posted successfully!", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
      });
      onSave("clinical", formData);
    } catch (error) {
      console.error("API Error:", error);
      toast.error(`❌ ${error.message}`, {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
      });
    }
  };

  const parseClinicalNotesFromSpeech = useCallback((text, confidence, type) => {
    const lowerText = text.toLowerCase().trim();
    const ccMatch = lowerText.match(
      /(?:chief complaint|main complaint|primary complaint)[\s:]*([\w\W]+?)(?:\.|$|history|advice|plan)/i
    );
    if (ccMatch && ccMatch[1].trim().length > 2) {
      setFormData((prev) => ({ ...prev, chiefComplaint: ccMatch[1].trim() }));
    }
    const historyMatch = lowerText.match(
      /(?:history|medical history|past history)[\s:]*([\w\W]+?)(?:\.|$|chief|advice|plan)/i
    );
    if (historyMatch && historyMatch[1].trim().length > 2) {
      setFormData((prev) => ({ ...prev, history: historyMatch[1].trim() }));
    }
    const adviceMatch = lowerText.match(
      /(?:advice|diagnosis|clinical advice)[\s:]*([\w\W]+?)(?:\.|$|chief|history|plan)/i
    );
    if (adviceMatch && adviceMatch[1].trim().length > 2) {
      setFormData((prev) => ({ ...prev, advice: adviceMatch[1].trim() }));
    }
    const planMatch = lowerText.match(
      /(?:plan|treatment plan|management plan)[\s:]*([\w\W]+?)(?:\.|$|chief|history|advice)/i
    );
    if (planMatch && planMatch[1].trim().length > 2) {
      setFormData((prev) => ({ ...prev, plan: planMatch[1].trim() }));
    }
  }, []);

  const { isListening, transcript, isSupported, confidence, toggleListening } =
    useOptimizedVoiceRecognition(parseClinicalNotesFromSpeech, {
      continuous: true,
      interimResults: true,
      lang: "en-US",
      sensitivity: 0.4,
      pauseThreshold: 1500,
      maxAlternatives: 3,
      realTimeProcessing: true,
    });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slideIn">
      <div className="sub-heading px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FileText className="text-xl text-white" />
          <h3 className="text-white font-semibold">Clinical Notes</h3>
          <VoiceButton
            isListening={isListening}
            onToggle={toggleListening}
            isSupported={isSupported}
            size="md"
            confidence={confidence}
          />
          {isListening && (
            <div className="flex items-center gap-2 text-white text-sm">
              <span className="animate-pulse">🎤 Listening...</span>
              {confidence > 0 && (
                <span className="text-xs opacity-75">
                  ({Math.round(confidence * 100)}%)
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-white">
          <button
            onClick={handleSave}
            className="hover:bg-[var(--primary-color)] hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
          </button>
          <button
            onClick={() => onPrint("clinical")}
            className="hover:bg-[var(--primary-color)] hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {["chiefComplaint", "history", "advice", "plan"].map((field) => (
          <div key={field} className="space-y-2">
            <label className="block text-sm font-medium text-[var(--primary-color)]">
              {field
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (c) => c.toUpperCase())}
            </label>
            <textarea
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className={`input-field min-h-[80px] resize-none ${
                formData[field]
                  ? "bg-green-50 border-green-300 ring-2 ring-green-200"
                  : ""
              }`}
              placeholder={`Enter ${field
                .replace(/([A-Z])/g, " $1")
                .toLowerCase()}...`}
            />
          </div>
        ))}
      </div>
      {transcript && (
        <div className="px-6 pb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <strong className="text-green-800 text-sm">Voice Input:</strong>
            <span className="text-green-700 text-sm ml-2">{transcript}</span>
            {isListening && (
              <div className="text-sm text-green-600 mt-1">
                <em>Speaking... Fields will update automatically</em>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalNotesForm;
