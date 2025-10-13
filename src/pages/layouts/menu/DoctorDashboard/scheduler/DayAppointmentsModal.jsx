import React from 'react';
import { X, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import "./scheduler.css";

const DayAppointmentsModal = ({
  isOpen,
  onClose,
  date,
  events,
  onSelectEvent,
}) => {
  if (!isOpen) return null;

  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="day-appointments-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <Calendar size={24} className="header-icon" />
            <div>
              <h2>Appointments</h2>
              <p className="modal-subtitle">
                {format(date, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="day-appointments-list">
            {sortedEvents.map((event) => (
              <div
                key={event.id}
                className="day-appointment-card"
                onClick={() => onSelectEvent(event)}
              >
                <div
                  className="appointment-color-bar"
                  style={{ backgroundColor: event.resource.color || '#3b82f6' }}
                ></div>
                <div className="appointment-content">
                  <div className="appointment-header">
                    <h3>{event.resource.patient}</h3>
                    <span className={`type-badge ${event.resource.type?.toLowerCase()}`}>
                      {event.resource.type}
                    </span>
                  </div>
                  <div className="appointment-time">
                    <Clock size={16} />
                    {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                  </div>
                  <div className="appointment-reason">
                    {event.resource.reason}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="close-modal-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayAppointmentsModal;
