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
import "./scheduler.css";

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
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="appointment-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-header"
          style={{ borderLeftColor: selectedColor }}
        >
          <div className="header-content">
            <div
              className="appointment-color-indicator"
              style={{ backgroundColor: selectedColor }}
            ></div>
            <div>
              <h2>{event.resource.patient}</h2>
              <p className="modal-subtitle">
                {format(event.start, "EEEE, MMMM d, yyyy")}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-icon">
                <Clock size={18} />
              </div>
              <div className="detail-content">
                <label>Time</label>
                <p>
                  {format(event.start, "h:mm a")} -{" "}
                  {format(event.end, "h:mm a")}
                </p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <User size={18} />
              </div>
              <div className="detail-content">
                <label>Patient Name</label>
                <p>{event.resource.patient}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Phone size={18} />
              </div>
              <div className="detail-content">
                <label>Phone</label>
                <p>{event.resource.phone}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Mail size={18} />
              </div>
              <div className="detail-content">
                <label>Email</label>
                <p>{event.resource.email}</p>
              </div>
            </div>

            <div className="detail-item full-width">
              <div className="detail-icon">
                <FileText size={18} />
              </div>
              <div className="detail-content">
                <label>Consultation Type</label>
                <p>
                  <span
                    className={`type-badge ${event.resource.type?.toLowerCase()}`}
                  >
                    {event.resource.type}
                  </span>
                </p>
              </div>
            </div>

            <div className="detail-item full-width">
              <div className="detail-icon">
                <FileText size={18} />
              </div>
              <div className="detail-content">
                <label>Reason for Visit</label>
                <p>{event.resource.reason}</p>
              </div>
            </div>

            <div className="detail-item full-width">
              <div className="detail-icon">
                <Palette size={18} />
              </div>
              <div className="detail-content">
                <label>Event Color</label>
                <div className="color-picker-wrapper">
                  <button
                    className="color-preview-btn"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    style={{ backgroundColor: selectedColor }}
                  >
                    Change Color
                  </button>
                  {showColorPicker && (
                    <div className="color-palette">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          className={`color-swatch ${
                            selectedColor === color ? "selected" : ""
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

        <div className="modal-footer">
          <button className="action-btn cancel-action">
            <Trash2 size={18} />
            Cancel Appointment
          </button>
          <button className="action-btn edit-action">
            <Edit2 size={18} />
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailModal;
