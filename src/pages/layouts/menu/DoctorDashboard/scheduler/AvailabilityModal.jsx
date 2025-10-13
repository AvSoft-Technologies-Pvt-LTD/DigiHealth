import React, { useState } from 'react';
import { X, Clock, Calendar, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import "./scheduler.css";

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AvailabilityModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [duration, setDuration] = useState(30);
  const [generatedSlots, setGeneratedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const generateSlots = () => {
    if (selectedDays.length === 0) {
      toast.error('Please select at least one day');
      return;
    }

    const slots = [];
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);

    selectedDays.forEach(day => {
      let current = new Date(start);
      while (current < end) {
        const timeStr = current.toTimeString().substring(0, 5);
        slots.push({ day, time: timeStr });
        current = new Date(current.getTime() + duration * 60000);
      }
    });

    setGeneratedSlots(slots);
    setCurrentStep(2);
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success('Availability saved successfully!');
      setLoading(false);
      onClose();
      resetForm();
    }, 1000);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedDays([]);
    setStartTime('09:00');
    setEndTime('17:00');
    setDuration(30);
    setGeneratedSlots([]);
  };

  const goBack = () => {
    setCurrentStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="availability-modal">
        <div className="modal-header">
          <div className="header-content">
            <Calendar size={24} className="header-icon" />
            <div>
              <h2>Manage Availability</h2>
              <p className="modal-subtitle">Step {currentStep} of 2</p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="stepper">
          <div className={`stepper-item ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="stepper-circle">1</div>
            <span>Schedule</span>
          </div>
          <div className="stepper-line"></div>
          <div className={`stepper-item ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="stepper-circle">2</div>
            <span>Preview & Save</span>
          </div>
        </div>

        <div className="modal-body">
          {currentStep === 1 ? (
            <div className="step-content">
              <div className="form-section">
                <label className="field-label">Select Working Days</label>
                <div className="days-grid">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`day-btn ${selectedDays.includes(day) ? 'active' : ''}`}
                    >
                      <span className="day-short">{day.substring(0, 3)}</span>
                      <span className="day-full">{day}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label className="field-label">Working Hours</label>
                <div className="time-range">
                  <div className="time-field">
                    <label>Start Time</label>
                    <div className="time-input-wrapper">
                      <Clock size={18} />
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="time-input"
                      />
                    </div>
                  </div>
                  <div className="time-separator">to</div>
                  <div className="time-field">
                    <label>End Time</label>
                    <div className="time-input-wrapper">
                      <Clock size={18} />
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="time-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="step-content">
              <div className="form-section">
                <label className="field-label">Appointment Duration (minutes)</label>
                <div className="duration-selector">
                  {[15, 20, 30, 45, 60].map(mins => (
                    <button
                      key={mins}
                      onClick={() => {
                        setDuration(mins);
                        generateSlots();
                      }}
                      className={`duration-btn ${duration === mins ? 'active' : ''}`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label className="field-label">
                  Generated Slots Preview ({generatedSlots.length} slots)
                </label>
                <div className="slots-preview">
                  {DAYS.filter(day => selectedDays.includes(day)).map(day => (
                    <div key={day} className="day-slots">
                      <h4>{day}</h4>
                      <div className="slots-list">
                        {generatedSlots
                          .filter(slot => slot.day === day)
                          .map((slot, idx) => (
                            <div key={idx} className="slot-chip">
                              {slot.time}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {currentStep === 2 && (
            <button onClick={goBack} className="back-btn">
              <ChevronLeft size={18} />
              Back
            </button>
          )}
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          {currentStep === 1 ? (
            <button
              onClick={generateSlots}
              disabled={selectedDays.length === 0}
              className="next-btn"
            >
              Next
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={loading}
              className="save-btn"
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Confirm & Save
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityModal;
