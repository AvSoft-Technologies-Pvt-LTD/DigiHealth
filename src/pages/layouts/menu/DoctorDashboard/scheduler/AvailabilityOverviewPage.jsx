import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Edit3, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import "./scheduler.css";

const AvailabilityOverviewPage = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = () => {
    setLoading(true);
    const saved = localStorage.getItem("doctorAvailabilitySchedules");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSchedules(Array.isArray(parsed) ? parsed : []);
    } else {
      setSchedules([]);
    }
    setLoading(false);
  };

  const handleEdit = (schedule) => {
    navigate(`/doctordashboard/scheduler/availability/edit/${schedule.id}`);
  };

  const handleDelete = (scheduleId) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      const saved = localStorage.getItem("doctorAvailabilitySchedules");
      if (saved) {
        const schedules = JSON.parse(saved);
        const filtered = schedules.filter((s) => s.id !== scheduleId);
        localStorage.setItem(
          "doctorAvailabilitySchedules",
          JSON.stringify(filtered)
        );
        loadSchedules();
        toast.success("Schedule deleted successfully!");
      }
    }
  };

  const handleCreateNew = () => {
    navigate("/doctordashboard/scheduler/availability/create");
  };

  const formatDateRange = (dates) => {
    if (!dates || dates.length === 0) return "No dates";
    const sorted = [...dates].sort();
    const first = new Date(sorted[0]);
    const last = new Date(sorted[sorted.length - 1]);
    return `${first.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} - ${last.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  const getUnavailableDates = (schedule) => {
    if (!schedule.deselectedDates || schedule.deselectedDates.length === 0)
      return null;
    return schedule.deselectedDates
      .map((d) => {
        const date = new Date(d);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      })
      .join(", ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 p-6 bg-white rounded-2xl shadow-lg">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Availability Overview
            </h1>
            <p className="text-sm text-gray-500">Manage your working schedules</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-6 py-3 px-3 py-2.5 bg-[var(--primary-color)] text-white rounded-lg text-sm"
          >
            <Plus size={18} />
            Create New Schedule
          </button>
        </div>

        {/* Schedules List */}
        {schedules.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Calendar size={64} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No Schedules Found
            </h3>
            <p className="text-slate-600 mb-6">
              Create your first availability schedule to get started
            </p>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-6 py-3 px-3 py-2.5 bg-[var(--primary-color)] text-white rounded-lg text-sm"
            >
              <Plus size={18} />
              Create Schedule
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule) => {
              const unavailableDates = getUnavailableDates(schedule);
              return (
                <div
                  key={schedule.id}
                  className="availability-card bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                >
                

                  {/* Grid for Dates, Working Hours, and Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Dates */}
                    <div className="flex items-start gap-3">
                      <Calendar size={18} className="text-blue-600 mt-1" />
                      <div className="min-w-[150px]">
                        <p className="text-xs font-semibold text-slate-500 uppercase">
                          Dates
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {schedule.selectedDates?.length || 0} day(s) selected
                        </p>
                        {schedule.selectedDates && schedule.selectedDates.length > 0 && (
                          <p className="text-xs text-slate-500 mt-1">
                            {formatDateRange(schedule.selectedDates)}
                          </p>
                        )}
                        {unavailableDates && (
                          <p className="text-xs text-amber-600 mt-1">
                            Unavailable: {unavailableDates}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="text-emerald-600 mt-1" />
                      <div className="min-w-[150px]">
                        <p className="text-xs font-semibold text-slate-500 uppercase">
                          Working Hours
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {schedule.startTime} - {schedule.endTime}
                        </p>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="text-purple-600 mt-1" />
                      <div className="min-w-[150px]">
                        <p className="text-xs font-semibold text-slate-500 uppercase">
                          Duration
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {schedule.duration} minutes
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Edit/Delete Buttons (Above Total Slots) */}
                  {schedule.generatedSlots && (
                    <div className="flex flex-col items-end">
                      <div className="flex gap-2 mb-2">
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                          title="Edit Schedule"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                          title="Delete Schedule"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Total Slots */}
                      <div className="w-full p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs font-semibold text-slate-600">
                          Total Slots:{" "}
                          <span className="text-slate-900">
                            {schedule.generatedSlots.length}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityOverviewPage;
