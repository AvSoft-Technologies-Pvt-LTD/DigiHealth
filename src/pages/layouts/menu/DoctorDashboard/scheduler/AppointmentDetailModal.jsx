import React, { useState } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  Clock,
  FileText,
  Edit2,
  Trash2,
  Palette,
} from "lucide-react";
import { format } from "date-fns";

const PRESET_COLORS = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#6366f1",
];

const AppointmentDetailModal = ({ isOpen, onClose, event, onUpdateColor }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    event.resource.color || "#3b82f6"
  );

  if (!isOpen) return null;

  const handleColorChange = (color) => {
    setSelectedColor(color);
    onUpdateColor(event.id, color);
    setShowColorPicker(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg md:max-w-2xl lg:max-w-3xl mx-4 my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="border-l-4 px-4 py-3 flex justify-between items-center"
          style={{ borderLeftColor: selectedColor }}
        >
          <div className="flex items-center space-x-3">
            <div
              className="w-3 h-10 rounded-full"
              style={{ backgroundColor: selectedColor }}
            ></div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                {event.resource.patient}
              </h2>
              <p className="text-sm md:text-base text-gray-500">
                {format(event.start, "EEEE, MMMM d, yyyy")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Time */}
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                <Clock size={18} className="text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Time
                </label>
                <p className="text-base md:text-lg text-gray-800">
                  {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                </p>
              </div>
            </div>

            {/* Patient Name */}
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                <User size={18} className="text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Patient Name
                </label>
                <p className="text-base md:text-lg text-gray-800">
                  {event.resource.patient}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                <Phone size={18} className="text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Phone
                </label>
                <p className="text-base md:text-lg text-gray-800">
                  {event.resource.phone}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                <Mail size={18} className="text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <p className="text-base md:text-lg text-gray-800">
                  {event.resource.email}
                </p>
              </div>
            </div>

            {/* Consultation Type */}
            <div className="sm:col-span-2 flex items-start space-x-3">
              <div className="mt-1">
                <FileText size={18} className="text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Consultation Type
                </label>
                <p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      event.resource.type?.toLowerCase() === "follow-up"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {event.resource.type}
                  </span>
                </p>
              </div>
            </div>

            {/* Reason for Visit */}
            <div className="sm:col-span-2 flex items-start space-x-3">
              <div className="mt-1">
                <FileText size={18} className="text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Reason for Visit
                </label>
                <p className="text-base md:text-lg text-gray-800">
                  {event.resource.reason}
                </p>
              </div>
            </div>

            {/* Event Color */}
            <div className="sm:col-span-2 flex items-start space-x-3">
              <div className="mt-1">
                <Palette size={18} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600">
                  Event Color
                </label>
                <div className="mt-1">
                  <button
                    className="px-3 py-2 rounded-md text-sm font-medium border border-gray-300 focus:outline-none"
                    style={{ backgroundColor: selectedColor }}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  >
                    Change Color
                  </button>
                  {showColorPicker && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          className={`w-6 h-6 rounded-full border-2 ${
                            selectedColor === color
                              ? "border-blue-500"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleColorChange(color)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3 border-t border-gray-200">
          <button
            className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 focus:outline-none"
            onClick={() => {}}
          >
            <Trash2 size={18} className="mr-1" />
            Cancel Appointment
          </button>
          <button
            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
            onClick={() => {}}
          >
            <Edit2 size={18} className="mr-1" />
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailModal;
