// File: Scheduler.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addMonths,
  subMonths,
  startOfDay,
  endOfDay,
  compareAsc,
  setHours,
  setMinutes,
} from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Video,
  Copy,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AvailabilityModal from "./AvailabilityModal";
import AppointmentDetailModal from "./AppointmentDetailModal";
import DayAppointmentsModal from "./DayAppointmentsModal";
import "./scheduler.css";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Generate comprehensive dummy data for September and October 2025
const generateDummyAppointments = () => {
  const patients = [
    {
      name: "John Smith",
      phone: "555-0101",
      email: "john@example.com",
      type: "Physical",
    },
    {
      name: "Sarah Johnson",
      phone: "555-0102",
      email: "sarah@example.com",
      type: "Virtual",
    },
    {
      name: "Mike Davis",
      phone: "555-0103",
      email: "mike@example.com",
      type: "Physical",
    },
    {
      name: "Emily Chen",
      phone: "555-0104",
      email: "emily@example.com",
      type: "Virtual",
    },
    {
      name: "Robert Wilson",
      phone: "555-0105",
      email: "robert@example.com",
      type: "Physical",
    },
    {
      name: "Lisa Anderson",
      phone: "555-0106",
      email: "lisa@example.com",
      type: "Virtual",
    },
    {
      name: "David Brown",
      phone: "555-0107",
      email: "david@example.com",
      type: "Physical",
    },
    {
      name: "Maria Garcia",
      phone: "555-0108",
      email: "maria@example.com",
      type: "Virtual",
    },
    {
      name: "James Taylor",
      phone: "555-0109",
      email: "james@example.com",
      type: "Physical",
    },
    {
      name: "Jennifer Martinez",
      phone: "555-0110",
      email: "jennifer@example.com",
      type: "Virtual",
    },
  ];

  const symptoms = [
    "Routine Checkup",
    "Follow-up consultation",
    "Annual Physical",
    "Medical Consultation",
    "Health Screening",
    "Preventive Care",
    "Wellness Visit",
    "Lab Results Review",
  ];

  const colors = [
    "#3b82f6",
    "#10b981",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
  ];

  const appointments = [];
  let id = 1;

  // Generate appointments for September 2025 (month 8, all days except Sundays)
  for (let day = 1; day <= 30; day++) {
    const date = new Date(2025, 8, day);
    if (date.getDay() === 0) continue; // Skip Sundays

    // Random number of appointments per day (2-6)
    const numAppointments = Math.floor(Math.random() * 5) + 2;

    for (let i = 0; i < numAppointments; i++) {
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const symptom = symptoms[Math.floor(Math.random() * symptoms.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const hour = 9 + Math.floor(Math.random() * 8); // 9 AM to 5 PM
      const minute = Math.random() > 0.5 ? 0 : 30;

      appointments.push({
        id: String(id++),
        name: patient.name,
        phone: patient.phone,
        email: patient.email,
        date: new Date(2025, 8, day, hour, minute),
        consultationType: patient.type,
        symptoms: symptom,
        status: "confirmed",
        color: color,
        meetLink: `https://meet.google.com/${Math.random()
          .toString(36)
          .substring(7)}`,
      });
    }
  }

  // Generate appointments for October 2025 (month 9, days 1-31)
  for (let day = 1; day <= 31; day++) {
    const date = new Date(2025, 9, day);
    if (date.getDay() === 0) continue; // Skip Sundays

    const numAppointments = Math.floor(Math.random() * 5) + 2;

    for (let i = 0; i < numAppointments; i++) {
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const symptom = symptoms[Math.floor(Math.random() * symptoms.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const hour = 9 + Math.floor(Math.random() * 8);
      const minute = Math.random() > 0.5 ? 0 : 30;

      appointments.push({
        id: String(id++),
        name: patient.name,
        phone: patient.phone,
        email: patient.email,
        date: new Date(2025, 9, day, hour, minute),
        consultationType: patient.type,
        symptoms: symptom,
        status: "confirmed",
        color: color,
        meetLink: `https://meet.google.com/${Math.random()
          .toString(36)
          .substring(7)}`,
      });
    }
  }

  return appointments;
};

const mockAppointments = generateDummyAppointments();

const Scheduler = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [monthEvents, setMonthEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 1)); // Start with September 2025
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showAppointmentDetail, setShowAppointmentDetail] = useState(false);
  const [showDayAppointments, setShowDayAppointments] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayEvents, setDayEvents] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(30);

  useEffect(() => {
    loadAppointments();
    const handler = () => {
      setShowMonthPicker(false);
      setShowYearPicker(false);
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  const groupEventsByDate = (individualEvents) => {
    const map = {};
    individualEvents.forEach((e) => {
      const d = startOfDay(new Date(e.start));
      const key = d.toISOString().slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });

    const grouped = Object.keys(map).map((key) => {
      const d = new Date(key + "T00:00:00");
      map[key].sort((a, b) => compareAsc(new Date(a.start), new Date(b.start)));
      return {
        id: `day-${key}`,
        title: "",
        start: startOfDay(d),
        end: endOfDay(d),
        allDay: true,
        resource: {
          events: map[key],
          color: map[key][0]?.resource?.color || "#3b82f6",
        },
      };
    });
    return grouped;
  };

  const loadAppointments = () => {
    setLoading(true);
    setTimeout(() => {
      const calendarEvents = mockAppointments.map((appt) => {
        const endDate = new Date(appt.date);
        endDate.setMinutes(endDate.getMinutes() + 30);
        return {
          id: appt.id,
          title: appt.name,
          start: appt.date,
          end: endDate,
          resource: {
            patient: appt.name,
            phone: appt.phone,
            type: appt.consultationType,
            reason: appt.symptoms,
            email: appt.email,
            color: appt.color,
            meetLink: appt.meetLink,
          },
        };
      });

      setEvents(calendarEvents);
      const groupedReal = groupEventsByDate(calendarEvents);
      groupedReal.sort((a, b) => a.start - b.start);
      setMonthEvents(groupedReal);

      const now = new Date();
      const upcoming = calendarEvents
        .filter((event) => event.start >= now)
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .slice(0, 5);
      setUpcomingAppointments(upcoming);

      setLoading(false);
    }, 600);
  };

  const handleSelectEvent = useCallback(
    (event) => {
      if (event?.resource?.events) {
        const iso = startOfDay(event.start).toISOString().slice(0, 10);
        navigate(`today?date=${iso}`, {
          state: { events: event.resource.events },
        });
      } else {
        setSelectedEvent(event);
        setShowAppointmentDetail(true);
      }
    },
    [navigate]
  );

  const handleSelectSlot = useCallback(
    (slotInfo) => {
      const iso = startOfDay(new Date(slotInfo.start))
        .toISOString()
        .slice(0, 10);
      const dayEvents = events.filter((ev) => {
        const evDate = new Date(ev.start).toISOString().slice(0, 10);
        return evDate === iso;
      });
      navigate(`today?date=${iso}`, { state: { events: dayEvents } });
    },
    [navigate, events]
  );

  const handleUpdateEventColor = (eventId, newColor) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId
          ? { ...event, resource: { ...event.resource, color: newColor } }
          : event
      )
    );
    setMonthEvents((prev) =>
      prev.map((m) =>
        m.resource?.events?.some((ev) => ev.id === eventId)
          ? { ...m, resource: { ...m.resource, color: newColor } }
          : m
      )
    );
    toast.success("Event color updated!");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  const dayCountsMap = useMemo(() => {
    const map = {};
    monthEvents.forEach((m) => {
      const key = m.start.toISOString().slice(0, 10);
      const count = Array.isArray(m.resource?.events)
        ? m.resource.events.length
        : 0;
      map[key] = (map[key] || 0) + count;
    });
    return map;
  }, [monthEvents]);

  const GroupedDayEvent = ({ event }) => {
    const dayEvents = event.resource?.events || [];
    const earliest = dayEvents[0];
    const earliestTime = earliest
      ? format(new Date(earliest.start), "h:mm a")
      : null;

    return (
      <div className="custom-event month-grouped">
        {earliestTime && (
          <div
            className="time-pill"
            style={{
              background: event.resource?.color || "#3b82f6",
              color: "#fff",
            }}
          >
            {earliestTime}
          </div>
        )}
      </div>
    );
  };

  const DateCellWrapper = ({ children, value }) => {
    const key = startOfDay(new Date(value)).toISOString().slice(0, 10);
    const count = dayCountsMap[key] || 0;

    return (
      <div style={{ position: "relative", height: "100%" }}>
        <div style={{ height: "100%" }}>{children}</div>
        {count > 0 && (
          <div
            className="date-count-badge"
            title={`${count} appointment${count > 1 ? "s" : ""}`}
          >
            {count}
          </div>
        )}
      </div>
    );
  };

  const MonthEventRenderer = (props) => {
    if (props.event.resource?.events) {
      return <GroupedDayEvent event={props.event} />;
    }
    return (
      <div className="custom-event single-event">
        <div className="event-time">{format(props.event.start, "h:mm a")}</div>
        <div className="event-title">{props.event.title}</div>
      </div>
    );
  };

  const eventStyleGetter = (event) => {
    if (event.resource?.events) {
      return {
        style: {
          backgroundColor: "transparent",
          border: "0",
          color: "inherit",
          padding: 0,
          height: "auto",
          minHeight: "20px",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          marginTop: "2px",
          position: "relative",
          overflow: "visible",
        },
      };
    }
    return {
      style: {
        backgroundColor: event.resource?.color || "#3b82f6",
        borderRadius: "6px",
        opacity: 0.95,
        color: "white",
        border: "0px",
        display: "block",
        fontSize: "13px",
        fontWeight: "500",
      },
    };
  };

  const CustomToolbar = ({ date, onNavigate }) => {
    const months = [
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
    const years = Array.from(
      { length: 11 },
      (_, i) => date.getFullYear() - 5 + i
    );

    const goToBack = () => {
      const newDate = subMonths(date, 1);
      onNavigate("prev", newDate);
      setCurrentDate(newDate);
    };

    const goToNext = () => {
      const newDate = addMonths(date, 1);
      onNavigate("next", newDate);
      setCurrentDate(newDate);
    };
    const goToCurrent = () => {
      const iso = startOfDay(new Date()).toISOString().slice(0, 10);
      // navigate relative to current path (which is /doctordashboard/scheduler)
      navigate(`today?date=${iso}`, { relative: "path" });
    };

    const handleMonthChange = (monthIndex) => {
      const newDate = new Date(date);
      newDate.setMonth(monthIndex);
      onNavigate("date", newDate);
      setCurrentDate(newDate);
      setShowMonthPicker(false);
    };

    const handleYearChange = (year) => {
      const newDate = new Date(date);
      newDate.setFullYear(year);
      onNavigate("date", newDate);
      setCurrentDate(newDate);
      setShowYearPicker(false);
    };

    const stop = (e) => e.stopPropagation();

    return (
      <div className="scheduler-toolbar" onClick={stop}>
        <div className="toolbar-left">
          <div className="month-year-selector">
            <button
              className="selector-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowMonthPicker(!showMonthPicker);
                setShowYearPicker(false);
              }}
            >
              {months[date.getMonth()]}
              <ChevronDown size={16} />
            </button>
            <button
              className="selector-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowYearPicker(!showYearPicker);
                setShowMonthPicker(false);
              }}
            >
              {date.getFullYear()}
              <ChevronDown size={16} />
            </button>
          </div>

          {showMonthPicker && (
            <div className="picker-dropdown month-picker" onClick={stop}>
              {months.map((month, index) => (
                <button
                  key={month}
                  className={`picker-option ${
                    date.getMonth() === index ? "active" : ""
                  }`}
                  onClick={() => handleMonthChange(index)}
                >
                  {month}
                </button>
              ))}
            </div>
          )}

          {showYearPicker && (
            <div className="picker-dropdown year-picker" onClick={stop}>
              {years.map((year) => (
                <button
                  key={year}
                  className={`picker-option ${
                    date.getFullYear() === year ? "active" : ""
                  }`}
                  onClick={() => handleYearChange(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* <div className="toolbar-center">
          <button
            onClick={goToBack}
            className="nav-btn"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToCurrent}
            className="today-btn"
            aria-label="Today"
          >
            Today
          </button>
          <button
            onClick={goToNext}
            className="nav-btn"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div> */}

        <div className="toolbar-right">
          <button
            onClick={() => setShowAvailabilityModal(true)}
            className="availability-btn"
          >
            Manage Availability
          </button>
        </div>
      </div>
    );
  };

  const getInitial = (name) => {
    if (!name) return "?";
    return name.trim().charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="scheduler-loading">
        <div className="loading-spinner" />
        <p>Loading your schedule...</p>
      </div>
    );
  }

  return (
    <div className="scheduler-container">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="scheduler-layout">
        <div className="calendar-section">
          <Calendar
            localizer={localizer}
            events={monthEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%", overflow: "visible" }}
            eventPropGetter={eventStyleGetter}
            components={{
              toolbar: CustomToolbar,
              event: MonthEventRenderer,
              dateCellWrapper: DateCellWrapper,
            }}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            popup
            views={["month"]}
            defaultView="month"
            date={currentDate}
            onNavigate={(newDate) => setCurrentDate(newDate)}
            className="no-inner-scroll"
          />

          {/* Duration Options */}
          <div className="duration-options">
            <h4>Appointment Duration</h4>
            <div className="duration-buttons">
              {[15, 30, 45, 60, 120].map((mins) => (
                <button
                  key={mins}
                  className={`duration-option-btn ${
                    selectedDuration === mins ? "active" : ""
                  }`}
                  onClick={() => setSelectedDuration(mins)}
                >
                  {mins < 60
                    ? `${mins} min`
                    : mins === 60
                    ? "1 hour"
                    : "2 hour"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          {/* Google Meet Section */}
          <div className="google-meet-card">
            <div className="card-header">
              <Video size={18} color="#10b981" />
              <h3>Connect with upcoming patient</h3>
            </div>
            <div className="meet-link-container">
              <div className="meet-link-wrapper">
                <Video size={16} color="#10b981" />
                <a
                  href="https://meet.google.com/y4x72A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meet-link"
                >
                  https://meet.google.com/y4x72A
                </a>
              </div>
              <button
                className="copy-btn"
                onClick={() =>
                  copyToClipboard("https://meet.google.com/y4x72A")
                }
                title="Copy link"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="upcoming-card">
            <div className="card-header">
              <CalendarIcon size={18} />
              <h3>Upcoming Appointments</h3>
            </div>

            <div className="upcoming-list">
              {upcomingAppointments.length === 0 ? (
                <div className="empty-state">
                  <Clock size={40} className="empty-icon" />
                  <p>No upcoming appointments</p>
                </div>
              ) : (
                upcomingAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="appointment-item"
                    onClick={() => handleSelectEvent(appt)}
                    role="button"
                    tabIndex={0}
                  >
                    <div
                      className="patient-avatar"
                      style={{ background: appt.resource.color || "#3b82f6" }}
                    >
                      {getInitial(appt.title)}
                    </div>

                    <div className="appt-details">
                      <div className="appt-patient">
                        <span className="patient-name">
                          {appt.resource.patient}
                        </span>
                        {appt.resource.type && (
                          <span
                            className={`type-inline ${appt.resource.type?.toLowerCase()}`}
                          >
                            {appt.resource.type}
                          </span>
                        )}
                      </div>

                      <div className="appt-time">
                        <Clock size={14} />
                        {format(appt.start, "h:mm a")}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stats */}
        </div>
      </div>

      {showAvailabilityModal && (
        <AvailabilityModal
          isOpen={showAvailabilityModal}
          onClose={() => setShowAvailabilityModal(false)}
        />
      )}

      {showAppointmentDetail && selectedEvent && (
        <AppointmentDetailModal
          isOpen={showAppointmentDetail}
          onClose={() => setShowAppointmentDetail(false)}
          event={selectedEvent}
          onUpdateColor={handleUpdateEventColor}
        />
      )}

      {showDayAppointments && (
        <DayAppointmentsModal
          isOpen={showDayAppointments}
          onClose={() => setShowDayAppointments(false)}
          date={selectedDate}
          events={dayEvents}
          onSelectEvent={(event) => {
            setShowDayAppointments(false);
            setSelectedEvent(event);
            setShowAppointmentDetail(true);
          }}
        />
      )}
    </div>
  );
};

export default Scheduler;
