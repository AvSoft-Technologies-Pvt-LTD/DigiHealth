import React, { useState, useEffect } from "react";
import {
  Clock,
  ChevronRight,
  ChevronLeft,
  Save,
  Edit3,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import "./scheduler.css";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const AvailabilityPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDates, setSelectedDates] = useState([]);
  const [deselectedDates, setDeselectedDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [duration, setDuration] = useState(30);
  const [generatedSlots, setGeneratedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedAvailability, setSavedAvailability] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [stepTransitioning, setStepTransitioning] = useState(false);

  // Helper: focus calendar to month of first active date
  const focusCalendarToFirstActive = (datesArr) => {
    if (!datesArr || datesArr.length === 0) return;
    const sorted = [...datesArr].sort((a, b) => new Date(a) - new Date(b));
    const first = new Date(sorted[0]);
    setSelectedMonth(first.getMonth());
    setSelectedYear(first.getFullYear());
  };

  // Load saved availability on mount and populate calendar fields so saved days show immediately
  useEffect(() => {
    const saved = localStorage.getItem("doctorAvailability");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedAvailability(parsed);

      if (parsed.selectedDates && parsed.selectedDates.length > 0) {
        setSelectedDates(parsed.selectedDates);
        const sorted = [...parsed.selectedDates].sort(
          (a, b) => new Date(a) - new Date(b)
        );
        setStartDate(sorted[0]);
        setEndDate(sorted[sorted.length - 1]);
        focusCalendarToFirstActive(parsed.selectedDates);
      }

      setDeselectedDates(parsed.deselectedDates || []);
      setStartTime(parsed.startTime || "09:00");
      setEndTime(parsed.endTime || "17:00");
      setDuration(parsed.duration || 30);
      // Do not auto-enter edit mode; user must click Update to edit
    }
  }, []);

  // When savedAvailability updates (after saving), ensure calendar fields are synced
  useEffect(() => {
    if (savedAvailability) {
      const { selectedDates: savedDates = [], deselectedDates: savedDeselected = [] } =
        savedAvailability;
      if (savedDates.length > 0) {
        setSelectedDates(savedDates);
        const sorted = [...savedDates].sort((a, b) => new Date(a) - new Date(b));
        setStartDate(sorted[0]);
        setEndDate(sorted[sorted.length - 1]);
        focusCalendarToFirstActive(savedDates);
      }
      setDeselectedDates(savedDeselected || []);
      setStartTime(savedAvailability.startTime || "09:00");
      setEndTime(savedAvailability.endTime || "17:00");
      setDuration(savedAvailability.duration || 30);
    }
  }, [savedAvailability]);

  // Auto-regenerate slots in step 2 when duration changes
  useEffect(() => {
    if (currentStep === 2 && selectedDates.length > 0) {
      const slots = generateSlotsArray();
      setGeneratedSlots(slots);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, currentStep]);

  const toggleDate = (date) => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(
      2,
      "0"
    )}-${String(date).padStart(2, "0")}`;

    if (selectedDates.includes(dateStr)) {
      // toggle deselected state for already selected date
      if (deselectedDates.includes(dateStr)) {
        setDeselectedDates((prev) => prev.filter((d) => d !== dateStr));
      } else {
        setDeselectedDates((prev) => [...prev, dateStr]);
      }
      return;
    }

    // start a new selection or finish range
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateStr);
      setEndDate(null);
      setSelectedDates([dateStr]);
      setDeselectedDates([]);
    } else if (startDate && !endDate) {
      setEndDate(dateStr);
      const start = new Date(startDate);
      const current = new Date(dateStr);
      const isBefore = current < start;
      const newStart = isBefore ? dateStr : startDate;
      const newEnd = isBefore ? startDate : dateStr;

      setStartDate(newStart);
      setEndDate(newEnd);

      const allDates = [];
      const startDateObj = new Date(newStart);
      const endDateObj = new Date(newEnd);

      for (
        let d = new Date(startDateObj);
        d <= endDateObj;
        d.setDate(d.getDate() + 1)
      ) {
        const dateInRange = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;
        allDates.push(dateInRange);
      }

      setSelectedDates(allDates);
      setDeselectedDates([]);
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const formatTimeWithAMPM = (hours, minutes) => {
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  const generateSlotsArray = () => {
    const slots = [];
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    const activeDates = selectedDates.filter((d) => !deselectedDates.includes(d));

    activeDates.forEach((dateStr) => {
      const date = new Date(dateStr);
      const dayName = DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
      let currentMinutes = startTotalMinutes;

      while (currentMinutes < endTotalMinutes) {
        const hours = Math.floor(currentMinutes / 60);
        const minutes = currentMinutes % 60;
        const timeStr = formatTimeWithAMPM(hours, minutes);
        slots.push({
          day: dayName,
          time: timeStr,
          date: dateStr,
          sortTime: currentMinutes,
        });
        currentMinutes += duration;
      }
    });
    return slots;
  };

  const generateSlots = () => {
    const activeDates = selectedDates.filter((d) => !deselectedDates.includes(d));

    if (activeDates.length === 0) {
      toast.error("Please select at least one active date");
      return;
    }

    const slots = generateSlotsArray();
    setGeneratedSlots(slots);

    setStepTransitioning(true);
    setTimeout(() => {
      setCurrentStep(2);
      setTimeout(() => setStepTransitioning(false), 100);
    }, 200);
  };

  const handleSave = () => {
    const activeDates = selectedDates.filter((d) => !deselectedDates.includes(d));
    if (activeDates.length === 0) {
      toast.error("No active dates to save");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const availabilityData = {
        selectedDates: activeDates,
        deselectedDates,
        startTime,
        endTime,
        duration,
        generatedSlots,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("doctorAvailability", JSON.stringify(availabilityData));
      setSavedAvailability(availabilityData);

      // Keep calendar view focused on saved dates and maintain selections
      focusCalendarToFirstActive(activeDates);
      const sorted = [...activeDates].sort((a, b) => new Date(a) - new Date(b));
      setStartDate(sorted[0]);
      setEndDate(sorted[sorted.length - 1]);

      toast.success(
        isUpdateMode ? "Availability updated successfully!" : "Availability saved successfully!"
      );
      setLoading(false);
      setIsUpdateMode(false);

      // Return to step 1 but keep selections visible
      setStepTransitioning(true);
      setTimeout(() => {
        setCurrentStep(1);
        setTimeout(() => setStepTransitioning(false), 100);
      }, 200);
    }, 1000);
  };

  const resetForm = () => {
    setStepTransitioning(true);
    setTimeout(() => {
      setCurrentStep(1);
      setSelectedDates([]);
      setDeselectedDates([]);
      setStartDate(null);
      setEndDate(null);
      setStartTime("09:00");
      setEndTime("17:00");
      setDuration(30);
      setGeneratedSlots([]);
      setSelectedMonth(new Date().getMonth());
      setSelectedYear(new Date().getFullYear());
      setTimeout(() => setStepTransitioning(false), 100);
    }, 200);
  };

  const loadSavedAvailability = () => {
    if (savedAvailability) {
      const { selectedDates: savedDates = [] } = savedAvailability;
      setSelectedDates(savedDates || []);

      if (savedDates && savedDates.length > 0) {
        const sortedDates = [...savedDates].sort((a, b) => new Date(a) - new Date(b));
        setStartDate(sortedDates[0]);
        setEndDate(sortedDates[sortedDates.length - 1]);
        focusCalendarToFirstActive(savedDates);
      }

      setDeselectedDates(savedAvailability.deselectedDates || []);
      setStartTime(savedAvailability.startTime || "09:00");
      setEndTime(savedAvailability.endTime || "17:00");
      setDuration(savedAvailability.duration || 30);
      setIsUpdateMode(true);
      setCurrentStep(1);
      toast.info("Loaded saved availability for editing");
    }
  };

  const deleteSavedAvailability = () => {
    if (window.confirm("Are you sure you want to delete saved availability?")) {
      localStorage.removeItem("doctorAvailability");
      setSavedAvailability(null);
      setIsUpdateMode(false);
      resetForm();
      toast.success("Availability deleted successfully!");
    }
  };

  // Cancels the edit session: restores saved data (if present) or clears the form
  const cancelUpdate = () => {
    if (savedAvailability) {
      const { selectedDates: savedDates = [], deselectedDates: savedDeselected = [] } =
        savedAvailability;
      setSelectedDates(savedDates || []);
      if (savedDates && savedDates.length > 0) {
        const sorted = [...savedDates].sort((a, b) => new Date(a) - new Date(b));
        setStartDate(sorted[0]);
        setEndDate(sorted[sorted.length - 1]);
        focusCalendarToFirstActive(savedDates);
      } else {
        setStartDate(null);
        setEndDate(null);
      }
      setDeselectedDates(savedDeselected || []);
      setStartTime(savedAvailability.startTime || "09:00");
      setEndTime(savedAvailability.endTime || "17:00");
      setDuration(savedAvailability.duration || 30);
    } else {
      resetForm();
    }

    setIsUpdateMode(false);
    toast.info("Edit cancelled");
  };

  const goBack = () => {
    setStepTransitioning(true);
    setTimeout(() => {
      setCurrentStep(1);
      setTimeout(() => setStepTransitioning(false), 100);
    }, 200);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    const blanks = Array(adjustedFirstDay).fill(null);
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const allCells = [...blanks, ...daysArray];

    return (
      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-dates">
          {allCells.map((date, index) => {
            if (date === null) {
              return <div key={`blank-${index}`} className="calendar-date blank"></div>;
            }

            const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(
              2,
              "0"
            )}-${String(date).padStart(2, "0")}`;
            const isSelected = selectedDates.includes(dateStr);
            const isDeselected = deselectedDates.includes(dateStr);
            const isStartDate = startDate === dateStr;
            const isEndDate = endDate === dateStr;
            const isInRange =
              startDate &&
              endDate &&
              new Date(dateStr) >= new Date(startDate) &&
              new Date(dateStr) <= new Date(endDate);

            return (
              <button
                key={date}
                onClick={() => toggleDate(date)}
                className={`
                  calendar-date
                  ${isSelected && !isDeselected ? "selected" : ""}
                  ${isDeselected ? "deselected" : ""}
                  ${isStartDate && !isDeselected ? "start-date" : ""}
                  ${isEndDate && !isDeselected ? "end-date" : ""}
                  ${isInRange && !isDeselected ? "in-range" : ""}
                `}
              >
                {date}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const activeDatesCount = selectedDates.filter((d) => !deselectedDates.includes(d)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 p-6 bg-white rounded-2xl shadow-lg">
          <div>
            <h1 className="h4-heading">Manage Availability</h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">
              Configure your working hours and schedule
            </p>
          </div>

          <div className="flex gap-3">
            {savedAvailability && (
              <>
                <button
                  onClick={loadSavedAvailability}
                  className="view-btn flex items-center gap-2 px-6 py-3"
                >
                  <Edit3 size={18} />
                  Update
                </button>

                <button
                  onClick={deleteSavedAvailability}
                  className="delete-btn flex items-center gap-2 px-6 py-3"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </>
            )}

            {/* Show Cancel Update whenever edit mode is active */}
            {isUpdateMode && (
              <button
                onClick={cancelUpdate}
                className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                Cancel Update
              </button>
            )}
          </div>
        </div>

        {savedAvailability && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-sm text-emerald-800">
              <strong>Saved Availability:</strong> {savedAvailability.selectedDates?.length} date(s) |
              {savedAvailability.startTime} - {savedAvailability.endTime} |
              Duration: {savedAvailability.duration} mins
            </p>
          </div>
        )}

        <div
          className={`bg-white rounded-2xl shadow-lg p-8 mt-6 step-transition ${
            stepTransitioning ? "transitioning" : ""
          }`}
        >
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div
                className={`flex flex-col items-center gap-2 ${
                  currentStep >= 1 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep >= 1
                      ? "bg-blue-600 text-white shadow-lg scale-110"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <span className="text-sm font-semibold">Schedule</span>
              </div>
              <div className={`w-24 h-1 rounded transition-all duration-500 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
              <div
                className={`flex flex-col items-center gap-2 ${
                  currentStep >= 2 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep >= 2
                      ? "bg-blue-600 text-white shadow-lg scale-110"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span className="text-sm font-semibold">Preview & Save</span>
              </div>
            </div>
          </div>

          {currentStep === 1 ? (
            <div className="space-y-8 step-content-animate">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 block">
                    Select Specific Dates
                  </label>
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-3 bg-slate-50 p-3 rounded-lg">
                      <button
                        onClick={() => setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1))}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <div className="font-bold text-base text-slate-800">
                        {MONTHS[selectedMonth]} {selectedYear}
                      </div>
                      <button
                        onClick={() => setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1))}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    {renderCalendar()}

                    {activeDatesCount > 0 && (
                      <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-center text-xs animate-fade-in">
                        <span className="text-emerald-800 font-semibold">
                          {activeDatesCount} day(s) selected
                        </span>
                        {deselectedDates.length > 0 && (
                          <span className="text-amber-700 ml-2">({deselectedDates.length} unavailable)</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 block">
                    Working Hours
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-2 block">Start Time</label>
                      <div className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg bg-white hover:border-emerald-400 transition-colors">
                        <Clock size={18} className="text-slate-400" />
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="flex-1 outline-none font-semibold text-slate-800 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-2 block">End Time</label>
                      <div className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg bg-white hover:border-emerald-400 transition-colors">
                        <Clock size={18} className="text-slate-400" />
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="flex-1 outline-none font-semibold text-slate-800 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 step-content-animate">
              <div>
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 block">
                  Appointment Duration (minutes)
                </label>
                <div className="flex gap-3 flex-wrap">
                  {[5, 10, 15, 20, 25, 30, 40].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setDuration(mins)}
                      className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-200 ${
                        duration === mins
                          ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-600 shadow-lg scale-105"
                          : "bg-white border-slate-200 text-slate-600 hover:border-emerald-400 hover:bg-emerald-50"
                      }`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 block">
                  Generated Slots Preview ({generatedSlots.length} slots)
                </label>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 max-h-96 overflow-y-auto slot-preview-container">
                  {[...new Set(generatedSlots.map((s) => s.date))].map((date) => {
                    const dateObj = new Date(date);
                    const dayName = DAYS[dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1];
                    const dateSlots = generatedSlots.filter((s) => s.date === date);
                    return (
                      <div key={date} className="mb-6 last:mb-0 slot-group-animate">
                        <h4 className="font-bold text-slate-800 mb-3">
                          {dayName} -{" "}
                          {dateObj.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {dateSlots
                            .sort((a, b) => a.sortTime - b.sortTime)
                            .map((slot, idx) => (
                              <div
                                key={idx}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 slot-item-animate"
                                style={{ animationDelay: `${idx * 20}ms` }}
                              >
                                {slot.time}
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
            {currentStep === 2 && (
              <button
                onClick={goBack}
                className="flex items-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold"
              >
                <ChevronLeft size={18} />
                Back
              </button>
            )}

            {currentStep === 1 ? (
              <button
                onClick={generateSlots}
                disabled={activeDatesCount === 0}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {isUpdateMode ? "Update & Save" : "Confirm & Save"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;
