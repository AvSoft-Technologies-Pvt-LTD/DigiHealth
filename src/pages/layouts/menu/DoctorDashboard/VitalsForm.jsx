


import React, { useState, useEffect, useCallback } from "react";
import {
  Heart,
  Save,
  Printer,
  AlertTriangle,
  X,
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Radar,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useOptimizedVoiceRecognition } from "./useOptimizedVoiceRecognition";
import VoiceButton from "./VoiceButton";
import VitalsChart from "./VitalsChart";

const API_URL = "https://6808fb0f942707d722e09f1d.mockapi.io/health-summary";
const VITALS_POST_API = "https://689887d3ddf05523e55f1e6c.mockapi.io/vitals";
const PATIENT_MR_API = "https://6895d385039a1a2b28907a16.mockapi.io/pt-mr/patient-mrec";

const vitalRanges = {
  heartRate: { min: 60, max: 100, label: "bpm", placeholder: "e.g. 72" },
  temperature: { min: 36.1, max: 37.2, label: "°C", placeholder: "e.g. 36.8" },
  bloodSugar: { min: 70, max: 140, label: "mg/dL", placeholder: "e.g. 90" },
  bloodPressure: {
    min: 90,
    max: 120,
    label: "mmHg",
    placeholder: "e.g. 120/80",
  },
  height: { min: 100, max: 220, label: "cm", placeholder: "e.g. 170" },
  weight: { min: 30, max: 200, label: "kg", placeholder: "e.g. 65" },
  spo2: { min: 90, max: 100, label: "%", placeholder: "e.g. 98" },
  respiratoryRate: { min: 12, max: 20, label: "bpm", placeholder: "e.g. 16" },
};

const VitalsForm = ({
  data,
  onSave,
  onPrint,
  setIsChartOpen,
  setChartVital,
  hospitalName,
  ptemail,
  drEmail,
  diagnosis,
  type,
}) => {
  const emptyVitals = {
    heartRate: "",
    temperature: "",
    bloodSugar: "",
    bloodPressure: "",
    height: "",
    weight: "",
    spo2: "",
    respiratoryRate: "",
    timeOfDay: "morning",
  };

  const [formData, setFormData] = useState({ ...emptyVitals, ...data });
  const [headerRecordIdx, setHeaderRecordIdx] = useState(null);
  const [warnings, setWarnings] = useState({});
  const [loading, setLoading] = useState(false);
  const [vitalsRecords, setVitalsRecords] = useState([]);

  const fetchVitals = async () => {
    if (!ptemail || !hospitalName) return;
    try {
      const response = await axios.get(VITALS_POST_API, {
        params: { ptemail, hospitalName },
      });
      if (response.status === 404) {
        toast.error("No vitals records found for this patient/hospital.");
        return;
      }
      const serverRecords = response.data || [];
      const stored = localStorage.getItem("vitalsRecords");
      const localRecords = stored ? JSON.parse(stored) : [];
      const allRecords = [...serverRecords, ...localRecords];
      const uniqueRecords = allRecords.reduce((acc, rec) => {
        if (!acc.some((r) => r.timestamp === rec.timestamp && r.id === rec.id)) {
          acc.push(rec);
        }
        return acc;
      }, []);
      const sortedRecords = uniqueRecords.sort(
        (a, b) => b.timestamp - a.timestamp
      );
      setVitalsRecords(sortedRecords);
      localStorage.setItem("vitalsRecords", JSON.stringify(sortedRecords));
      onSave("vitals", { ...formData, vitalsRecords: sortedRecords });
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("No vitals records found for this patient/hospital.");
      } else {
        console.error("Error fetching vitals:", error);
        toast.error("Failed to fetch vitals from server");
      }
    }
  };

  useEffect(() => {
    fetchVitals();
  }, [ptemail, hospitalName]);

  useEffect(() => {
    if (headerRecordIdx === null) {
      setFormData({ ...emptyVitals });
    } else if (vitalsRecords[headerRecordIdx]) {
      const rec = vitalsRecords[headerRecordIdx];
      setFormData({
        heartRate: rec.heartRate || "",
        temperature: rec.temperature || "",
        bloodSugar: rec.bloodSugar || "",
        bloodPressure: rec.bloodPressure || "",
        height: rec.height || "",
        weight: rec.weight || "",
        spo2: rec.spo2 || "",
        respiratoryRate: rec.respiratoryRate || "",
        timeOfDay: rec.timeOfDay || "morning",
      });
    }
  }, [headerRecordIdx, vitalsRecords]);

  const validate = (field, value) => {
    const range = vitalRanges[field];
    if (!range) return "";
    if (field === "bloodPressure") {
      const [systolic, diastolic] = value.split("/").map(Number);
      if (!systolic || !diastolic) return "Enter as systolic/diastolic";
      if (
        systolic < 90 ||
        systolic > 180 ||
        diastolic < 60 ||
        diastolic > 120
      )
        return "Out of normal range";
      return "";
    }
    if (value === "") return "";
    const num = +value;
    if (isNaN(num)) return "Enter a number";
    if (num < range.min || num > range.max)
      return `Out of range (${range.min}-${range.max} ${range.label})`;
    return "";
  };

  const postVitals = async (vitalsData) => {
    try {
      const payload = {
        ...vitalsData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        hospitalName: hospitalName || "Unknown Hospital",
        ptemail: ptemail || "unknown@example.com",
        heart_rate: vitalsData.heartRate,
        temperature: vitalsData.temperature,
        blood_sugar: vitalsData.bloodSugar,
        blood_pressure: vitalsData.bloodPressure,
        height: vitalsData.height,
        weight: vitalsData.weight,
        spo2: vitalsData.spo2,
        respiratory_rate: vitalsData.respiratoryRate,
      };
      const response = await axios.post(VITALS_POST_API, payload);
      toast.success("🔧 Vitals saved to server!");
      return response.data;
    } catch (error) {
      console.error("Error saving vitals:", error.response?.data || error.message);
      toast.error(`❌ Failed to save vitals: ${error.response?.data?.message || error.message}`);
      throw error;
    }
  };

  const postPatientMR = async (vitalsData) => {
    const now = new Date();
    const currentTimestamp = now.toISOString();
    const dateFields = {
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const payload = {
      id: Date.now().toString(),
      createdAt: currentTimestamp,
      hospitalName: hospitalName || "Unknown Hospital",
      ptemail: ptemail || "unknown@example.com",
      dremail: drEmail || "unknown@example.com",
      diagnosis: diagnosis || "N/A",
      type: type ? type.toUpperCase() : "OPD",
      ...dateFields,
      status: "Active",
      patientEmail: ptemail || "unknown@example.com",
      patientPhoneNumber: "Not provided",
      createdBy: "doctor",
    };
    try {
      const response = await axios.post(PATIENT_MR_API, payload);
      toast.success("📝 Patient MR saved successfully!");
      return response.data;
    } catch (error) {
      console.error("Error saving Patient MR:", error.response?.data || error.message);
      toast.error(`❌ Failed to save Patient MR: ${error.response?.data?.message || error.message}`);
      throw error;
    }
  };

  const save = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const payload = {
        ...formData,
        id: Date.now().toString(),
        createdAt: now.toISOString(),
        email: "demo@demo.com",
        heart_rate: formData.heartRate,
        temperature: formData.temperature,
        blood_sugar: formData.bloodSugar,
        blood_pressure: formData.bloodPressure,
        height: formData.height,
        weight: formData.weight,
        spo2: formData.spo2,
        respiratory_rate: formData.respiratoryRate,
      };
      console.log("Saving payload to API_URL:", payload);
      const response = await axios.post(API_URL, payload);
      console.log("API response:", response.data);
      const date = now.toISOString().split("T")[0];
      const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const newRecord = {
        ...formData,
        timestamp: now.getTime(),
        date,
        time,
        id: Date.now().toString(),
      };
      console.log("Saving to VITALS_POST_API:", newRecord);
      await postVitals(newRecord);
      console.log("Saving to PATIENT_MR_API:", newRecord);
      await postPatientMR(newRecord);
      setVitalsRecords((prev) => {
        let updated = [...prev, newRecord];
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        updated = updated.filter((r) => new Date(r.date) >= sevenDaysAgo);
        localStorage.setItem("vitalsRecords", JSON.stringify(updated));
        return updated;
      });
      onSave("vitals", {
        ...formData,
        vitalsRecords: [...vitalsRecords, newRecord],
      });
      setHeaderRecordIdx(null);
      setFormData({ ...emptyVitals });
      toast.success("✅ Vitals saved successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      await fetchVitals();
    } catch (error) {
      if (error.response?.data === "Max number of elements reached for this resource!") {
        toast.error("❌ Max entries reached! Please delete old entries or upgrade your MockAPI plan.", {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        console.error("Full error response:", error.response?.data || error.message);
        toast.error(`❌ Failed to save vitals: ${error.response?.data?.message || error.message}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === "timeOfDay") {
      setFormData((p) => ({ ...p, timeOfDay: value }));
      return;
    }
    if (name !== "bloodPressure") {
      processedValue = value.replace(/[^0-9.]/g, "");
    }
    setFormData((p) => ({ ...p, [name]: processedValue }));
    setWarnings((p) => ({ ...p, [name]: validate(name, processedValue) }));
  };

  const parseVitalsFromSpeech = useCallback((text, confidence, type) => {
    const lowerText = text.toLowerCase().trim();
    const hrMatch = lowerText.match(
      /(?:heart rate|pulse|hr)(?:\s+is|\s+of|\s+at)?\s+(\d+)/
    );
    if (hrMatch) {
      const heartRate = hrMatch[1];
      if (heartRate >= 40 && heartRate <= 200) {
        setFormData((prev) => ({ ...prev, heartRate }));
        setWarnings((prev) => ({
          ...prev,
          heartRate: validate("heartRate", heartRate),
        }));
      }
    }
    const tempMatch = lowerText.match(
      /(?:temperature|temp)(?:\s+is|\s+of|\s+at)?\s+(\d+\.?\d*)/
    );
    if (tempMatch) {
      const temperature = tempMatch[1];
      if (temperature >= 30 && temperature <= 45) {
        setFormData((prev) => ({ ...prev, temperature }));
        setWarnings((prev) => ({
          ...prev,
          temperature: validate("temperature", temperature),
        }));
      }
    }
    const bsMatch = lowerText.match(
      /(?:blood sugar|glucose|sugar level)(?:\s+is|\s+of|\s+at)?\s+(\d+)/
    );
    if (bsMatch) {
      const bloodSugar = bsMatch[1];
      if (bloodSugar >= 50 && bloodSugar <= 500) {
        setFormData((prev) => ({ ...prev, bloodSugar }));
        setWarnings((prev) => ({
          ...prev,
          bloodSugar: validate("bloodSugar", bloodSugar),
        }));
      }
    }
    const bpMatch = lowerText.match(
      /(?:blood pressure|bp)(?:\s+is|\s+of|\s+at)?\s+(\d+)\s*(?:over|\/)\s*(\d+)/
    );
    if (bpMatch) {
      const systolic = bpMatch[1];
      const diastolic = bpMatch[2];
      if (
        systolic >= 70 &&
        systolic <= 200 &&
        diastolic >= 40 &&
        diastolic <= 120
      ) {
        const bloodPressure = `${systolic}/${diastolic}`;
        setFormData((prev) => ({ ...prev, bloodPressure }));
        setWarnings((prev) => ({
          ...prev,
          bloodPressure: validate("bloodPressure", bloodPressure),
        }));
      }
    }
    const weightMatch = lowerText.match(
      /(?:weight|weighs)(?:\s+is|\s+of|\s+at)?\s+(\d+\.?\d*)/
    );
    if (weightMatch) {
      const weight = weightMatch[1];
      if (weight >= 20 && weight <= 300) {
        setFormData((prev) => ({ ...prev, weight }));
        setWarnings((prev) => ({
          ...prev,
          weight: validate("weight", weight),
        }));
      }
    }
    const heightMatch = lowerText.match(
      /(?:height|tall)(?:\s+is|\s+of|\s+at)?\s+(\d+\.?\d*)/
    );
    if (heightMatch) {
      const height = heightMatch[1];
      if (height >= 50 && height <= 250) {
        setFormData((prev) => ({ ...prev, height }));
        setWarnings((prev) => ({
          ...prev,
          height: validate("height", height),
        }));
      }
    }
    const spo2Match = lowerText.match(
      /(?:spo2|oxygen|saturation)(?:\s+is|\s+of|\s+at)?\s+(\d+)/
    );
    if (spo2Match) {
      const spo2 = spo2Match[1];
      if (spo2 >= 70 && spo2 <= 100) {
        setFormData((prev) => ({ ...prev, spo2 }));
        setWarnings((prev) => ({
          ...prev,
          spo2: validate("spo2", spo2),
        }));
      }
    }
    const rrMatch = lowerText.match(
      /(?:respiratory rate|rr|breathing)(?:\s+is|\s+of|\s+at)?\s+(\d+)/
    );
    if (rrMatch) {
      const respiratoryRate = rrMatch[1];
      if (respiratoryRate >= 8 && respiratoryRate <= 30) {
        setFormData((prev) => ({ ...prev, respiratoryRate }));
        setWarnings((prev) => ({
          ...prev,
          respiratoryRate: validate("respiratoryRate", respiratoryRate),
        }));
      }
    }
  }, []);

  const { isListening, transcript, isSupported, confidence, toggleListening } =
    useOptimizedVoiceRecognition(parseVitalsFromSpeech, {
      continuous: true,
      interimResults: true,
      lang: "en-US",
      sensitivity: 0.4,
      pauseThreshold: 1000,
      maxAlternatives: 3,
      realTimeProcessing: true,
    });

  const getVitalIcon = (vital) => {
    switch (vital) {
      case "heartRate":
        return <Heart className="w-3 sm:w-4 h-3 sm:h-4" />;
      case "temperature":
        return <Activity className="w-3 sm:w-4 h-3 sm:h-4" />;
      case "bloodSugar":
        return <TrendingUp className="w-3 sm:w-4 h-3 sm:h-4" />;
      case "bloodPressure":
        return <BarChart3 className="w-3 sm:w-4 h-3 sm:h-4" />;
      case "height":
        return <Activity className="w-3 sm:w-4 h-3 sm:h-4" />;
      case "weight":
        return <PieChart className="w-3 sm:w-4 h-3 sm:h-4" />;
      case "spo2":
        return <Radar className="w-3 sm:w-4 h-3 sm:h-4" />;
      case "respiratoryRate":
        return <PieChart className="w-3 sm:w-4 h-3 sm:h-4" />;
      default:
        return <BarChart3 className="w-3 sm:w-4 h-3 sm:h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slideIn">
      {/* Header */}
      <div className="sub-heading px-2 sm:px-3 md:px-4 py-2 flex flex-col gap-1 sm:gap-2">
        {/* FIRST ROW: Heading + Voice Button (Mobile) / Heading + Icons (Desktop) */}
        <div className="flex flex-nowrap items-center justify-between gap-1">
          {/* Heading + Voice Button (Mobile) / Heading Only (Desktop) */}
          <div className="flex items-center gap-1">
            <Heart className="text-base text-white" />
            <h3 className="text-white font-medium text-xs sm:text-sm md:text-base">
              Vital Signs
            </h3>
          </div>
          {/* Voice Button (Mobile + Desktop) + Icons (Mobile) */}
          <div className="flex items-center gap-1">
            {/* Mobile: Save/Print/Chart Buttons */}
            <div className="flex sm:hidden">
              <button
                onClick={save}
                disabled={loading}
                className="hover:bg-[var(--primary-color)] hover:bg-opacity-20 p-1 rounded-lg transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onPrint("vitals")}
                className="hover:bg-[var(--primary-color)] hover:bg-opacity-20 p-1 rounded-lg transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setChartVital("heartRate");
                  setIsChartOpen(true);
                }}
                className="flex items-center gap-0.5 bg-white/10 px-1.5 py-0.5 rounded-lg text-[8px] font-medium hover:bg-[var(--primary-color)] hover:bg-opacity-20"
              >
                <BarChart3 className="w-3 h-3" />
              </button>
            </div>
            {/* Voice Button (Mobile + Desktop) */}
            <VoiceButton
              isListening={isListening}
              onToggle={toggleListening}
              isSupported={isSupported}
              className="!w-6 !h-6 sm:!w-7 sm:!h-7"
              confidence={confidence}
            />
            {isListening && (
              <div className="flex items-center gap-0.5 text-white text-[8px] sm:text-xs">
                <span className="animate-pulse">🎤</span>
                {confidence > 0 && (
                  <span className="opacity-75">({Math.round(confidence * 100)}%)</span>
                )}
              </div>
            )}
            {/* Desktop: Save/Print/Chart Buttons */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={save}
                disabled={loading}
                className="hover:bg-[var(--primary-color)] hover:bg-opacity-20 p-1.5 rounded-lg transition-colors"
              >
                <Save className="w-5 h-5" />
              </button>
              <button
                onClick={() => onPrint("vitals")}
                className="hover:bg-[var(--primary-color)] hover:bg-opacity-20 p-1.5 rounded-lg transition-colors"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setChartVital("heartRate");
                  setIsChartOpen(true);
                }}
                className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[var(--primary-color)] hover:bg-opacity-20"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs">Charts</span>
              </button>
            </div>
          </div>
        </div>
        {/* SECOND ROW: Record Selector + Time of Day */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Record Selector */}
          <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
            <span className="text-[10px] sm:text-xs text-white">Record:</span>
            <div className="relative w-full max-w-[120px] sm:max-w-[150px]">
              <select
                className="rounded px-1 py-0.5 text-[8px] sm:text-[12px] bg-white text-[var(--primary-color)]
                           border border-gray-200 w-full truncate appearance-none
                           pr-6 bg-right bg-no-repeat"
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml;utf8,<svg fill=\"black\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>)",
                  backgroundPosition: "right 0.5rem center",
                  backgroundSize: "1em",
                }}
                value={headerRecordIdx === null ? "" : headerRecordIdx}
                onChange={(e) =>
                  setHeaderRecordIdx(
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
              >
                <option value="" className="text-[8px] sm:text-[12px]">
                  Current
                </option>
                {vitalsRecords.map((rec, idx) => (
                  <option
                    key={`${rec.timestamp}-${rec.id || idx}`}
                    value={idx}
                    className="text-[8px] sm:text-[12px]"
                  >
                    {rec.date} {rec.time}{" "}
                    {rec.timeOfDay === "morning" ? "(Morning)" : "(Evening)"}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Time of Day Radio */}
          <div className="flex items-center gap-x-2 bg-white/10 px-2 py-1 rounded-lg">
            {["morning", "evening"].map((t) => (
              <label
                key={t}
                className="flex items-center gap-1 text-[10px] sm:text-xs text-white"
              >
                <input
                  type="radio"
                  name="timeOfDay"
                  value={t}
                  checked={formData.timeOfDay === t}
                  onChange={handleChange}
                  className="accent-[var(--accent-color)]"
                />
                <span className="hidden sm:inline">
                  {t[0].toUpperCase() + t.slice(1)}
                </span>
                <span className="sm:hidden">{t[0].toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      {/* Vitals Input Grid */}
      <div className="p-3 sm:p-4 md:p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {Object.keys(vitalRanges).map((field) => (
          <div key={field} className="space-y-1">
            <div className="relative floating-input">
              <label className="block text-[12px] sm:text-sm md:text-text-base font-medium text-[var(--primary-color)]">
                {field.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}
              </label>
              <input
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={vitalRanges[field].placeholder}
                className={`w-full rounded-lg border px-2 sm:px-3 py-1 sm:py-1.5 md:py-2 text-[10px] sm:text-xs md:text-sm ${
                  formData[field]
                    ? "bg-green-50 border-green-300 ring-2 ring-green-200"
                    : ""
                }`}
              />
              {formData[field] && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-[10px] sm:text-xs md:text-sm">
                  {vitalRanges[field].label}
                </span>
              )}
            </div>
            {warnings[field] && (
              <span className="flex items-center text-[10px] sm:text-xs md:text-sm text-yellow-700 bg-yellow-100 rounded-lg px-2 sm:px-3 py-1 gap-1 sm:gap-2">
                <AlertTriangle className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-500" />
                {warnings[field]}
              </span>
            )}
          </div>
        ))}
      </div>
      {/* Voice Transcript */}
      {transcript && (
        <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 md:p-4 max-h-24 overflow-y-auto">
            <strong className="text-blue-800 text-[10px] sm:text-xs md:text-sm">Voice Input:</strong>
            <span className="text-blue-700 ml-1 text-[10px] sm:text-xs md:text-sm">{transcript}</span>
            {isListening && (
              <div className="text-[10px] sm:text-xs md:text-sm text-blue-600 mt-1">
                <em>Speaking... Fields will update automatically</em>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalsForm;
