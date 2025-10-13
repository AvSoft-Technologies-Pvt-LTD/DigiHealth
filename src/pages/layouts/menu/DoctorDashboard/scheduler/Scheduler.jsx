// File: Scheduler.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
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
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AvailabilityModal from './AvailabilityModal';
import AppointmentDetailModal from './AppointmentDetailModal';
import DayAppointmentsModal from './DayAppointmentsModal';
import "./scheduler.css";

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// sample/mock appointments (replace with real data)
const mockAppointments = [
  {
    id: '1',
    name: 'John Smith',
    phone: '555-0101',
    email: 'john@example.com',
    date: new Date(2025, 9, 15, 9, 0),
    consultationType: 'Physical',
    symptoms: 'Routine Checkup',
    status: 'confirmed',
    color: '#3b82f6',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    phone: '555-0102',
    email: 'sarah@example.com',
    date: new Date(2025, 9, 15, 10, 0),
    consultationType: 'Virtual',
    symptoms: 'Follow-up consultation',
    status: 'confirmed',
    color: '#10b981',
  },
  {
    id: '3',
    name: 'Mike Davis',
    phone: '555-0103',
    email: 'mike@example.com',
    date: new Date(2025, 9, 18, 14, 0),
    consultationType: 'Physical',
    symptoms: 'Annual Physical',
    status: 'confirmed',
    color: '#8b5cf6',
  },
];

const Scheduler = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [monthEvents, setMonthEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showAppointmentDetail, setShowAppointmentDetail] = useState(false);
  const [showDayAppointments, setShowDayAppointments] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayEvents, setDayEvents] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  useEffect(() => {
    loadAppointments();
    const handler = () => {
      setShowMonthPicker(false);
      setShowYearPicker(false);
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Utilities: generate dummy month view events for Sept (all except Sundays) and Oct 1-11
  const generateSeptOctDummyDayGroups = () => {
    const groups = [];
    const septYear = 2025;
    const septMonth = 8;
    const octMonth = 9;

    const makeDayGroup = (year, month, day, color = '#3b82f6') => {
      const dateObj = new Date(year, month, day);
      const isoKey = dateObj.toISOString().slice(0, 10);
      const start1 = setMinutes(setHours(new Date(year, month, day), 9), 0);
      const end1 = new Date(start1);
      end1.setMinutes(end1.getMinutes() + 30);
      const internalEvent = {
        id: `m-${isoKey}-1`,
        title: `Demo ${format(dateObj, 'd MMM')}`,
        start: start1,
        end: end1,
        resource: {
          patient: 'Demo Patient',
          color,
        },
      };
      return {
        id: `day-${isoKey}`,
        title: '',
        start: startOfDay(dateObj),
        end: endOfDay(dateObj),
        allDay: true,
        resource: {
          events: [internalEvent],
          color,
        },
      };
    };

    for (let d = 1; d <= 30; d++) {
      const dt = new Date(septYear, septMonth, d);
      const dow = dt.getDay();
      if (dow === 0) continue;
      groups.push(makeDayGroup(septYear, septMonth, d, '#60a5fa'));
    }

    for (let d = 1; d <= 11; d++) {
      groups.push(makeDayGroup(2025, octMonth, d, '#34d399'));
    }

    return groups;
  };

  const groupEventsByDate = (individualEvents) => {
    const map = {};
    individualEvents.forEach((e) => {
      const d = startOfDay(new Date(e.start));
      const key = d.toISOString().slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });

    const grouped = Object.keys(map).map((key) => {
      const d = new Date(key + 'T00:00:00');
      map[key].sort((a, b) => compareAsc(new Date(a.start), new Date(b.start)));
      return {
        id: `day-${key}`,
        title: '',
        start: startOfDay(d),
        end: endOfDay(d),
        allDay: true,
        resource: {
          events: map[key],
          color: map[key][0]?.resource?.color || '#3b82f6',
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
          },
        };
      });

      setEvents(calendarEvents);

      const seeded = generateSeptOctDummyDayGroups();
      const groupedReal = groupEventsByDate(calendarEvents);
      const merged = [...seeded];

      groupedReal.forEach((g) => {
        const key = g.start.toISOString().slice(0, 10);
        const foundIndex = merged.findIndex((m) => m.start.toISOString().slice(0, 10) === key);
        if (foundIndex >= 0) {
          const combined = {
            ...merged[foundIndex],
            resource: {
              events: [...(merged[foundIndex].resource?.events || []), ...(g.resource?.events || [])],
              color: merged[foundIndex].resource?.color || (g.resource?.color || '#3b82f6'),
            },
          };
          merged[foundIndex] = combined;
        } else {
          merged.push(g);
        }
      });

      merged.sort((a, b) => a.start - b.start);
      setMonthEvents(merged);

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
        navigate(`/doctordashboard/scheduler/today?date=${iso}`);
      } else {
        setSelectedEvent(event);
        setShowAppointmentDetail(true);
      }
    },
    [navigate]
  );

  const handleSelectSlot = useCallback(
    (slotInfo) => {
      try {
        const iso = startOfDay(new Date(slotInfo.start)).toISOString().slice(0, 10);
        navigate(`/doctordashboard/scheduler/today?date=${iso}`);
      } catch (err) {
        const dayStart = startOfDay(new Date(slotInfo.start));
        const dayEnd = endOfDay(new Date(slotInfo.start));
        const eventsOnDay = events.filter((event) => {
          const eventDate = new Date(event.start);
          return eventDate >= dayStart && eventDate <= dayEnd;
        });

        if (eventsOnDay.length > 0) {
          setDayEvents(eventsOnDay);
          setSelectedDate(slotInfo.start);
          setShowDayAppointments(true);
        }
      }
    },
    [events, navigate]
  );

  const handleUpdateEventColor = (eventId, newColor) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, resource: { ...event.resource, color: newColor } } : event
      )
    );
    setMonthEvents((prev) =>
      prev.map((m) =>
        m.resource?.events?.some((ev) => ev.id === eventId)
          ? { ...m, resource: { ...m.resource, color: newColor } }
          : m
      )
    );
    toast.success('Event color updated!');
  };

  // Build quick lookup count map per date for top-right badge
  const dayCountsMap = useMemo(() => {
    const map = {};
    monthEvents.forEach((m) => {
      const key = m.start.toISOString().slice(0, 10);
      const count = Array.isArray(m.resource?.events) ? m.resource.events.length : 0;
      map[key] = (map[key] || 0) + count;
    });
    events.forEach((ev) => {
      const key = startOfDay(new Date(ev.start)).toISOString().slice(0, 10);
      if (!map[key]) map[key] = 0;
      map[key] += 1;
    });
    return map;
  }, [monthEvents, events]);

  // Grouped day rendering: show earliest time pill + optional +N; NO initials
  const GroupedDayEvent = ({ event }) => {
    const dayEvents = event.resource?.events || [];
    const maxVisible = 2;
    const earliest = dayEvents[0];
    const earliestTime = earliest ? format(new Date(earliest.start), 'h:mm a') : null;

    return (
      <div className="custom-event month-grouped">
        {earliestTime && (
          <div
            className="time-pill"
            style={{
              background: event.resource?.color || '#3b82f6',
              color: '#fff',
            }}
          >
            {earliestTime}
          </div>
        )}

        {dayEvents.length > maxVisible && (
          <div className="more-pill" aria-hidden>
            +{dayEvents.length - maxVisible}
          </div>
        )}
      </div>
    );
  };

  const DateCellWrapper = ({ children, value }) => {
    const key = startOfDay(new Date(value)).toISOString().slice(0, 10);
    const count = dayCountsMap[key] || 0;

    return (
      <div style={{ position: 'relative', height: '100%' }}>
        <div style={{ height: '100%' }}>{children}</div>

        {count > 0 && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              minWidth: 24,
              height: 24,
              borderRadius: 12,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              background: '#2563eb',
              color: '#fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              padding: '0 6px',
              zIndex: 5,
            }}
            title={`${count} appointment${count > 1 ? 's' : ''}`}
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
        <div className="event-time">{format(props.event.start, 'h:mm a')}</div>
        <div className="event-title">{props.event.title}</div>
      </div>
    );
  };

  // eventStyleGetter ensures grouped events don't collapse and are top-aligned
  const eventStyleGetter = (event) => {
    if (event.resource?.events) {
      return {
        style: {
          backgroundColor: 'transparent',
          border: '0',
          color: 'inherit',
          padding: 0,
          height: 'auto',
          minHeight: '20px',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          marginTop: '2px',
          position: 'relative',
          overflow: 'visible',
        },
      };
    }
    return {
      style: {
        backgroundColor: event.resource?.color || '#3b82f6',
        borderRadius: '6px',
        opacity: 0.95,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '13px',
        fontWeight: '500',
      },
    };
  };

  const CustomToolbar = ({ date, onNavigate }) => {
    const months = [
      'January','February','March','April','May','June','July','August','September','October','November','December',
    ];
    const years = Array.from({ length: 11 }, (_, i) => date.getFullYear() - 5 + i);

    const goToBack = () => {
      const newDate = subMonths(date, 1);
      onNavigate('prev', newDate);
      setCurrentDate(newDate);
    };

    const goToNext = () => {
      const newDate = addMonths(date, 1);
      onNavigate('next', newDate);
      setCurrentDate(newDate);
    };

    const goToCurrent = () => {
      const iso = startOfDay(new Date()).toISOString().slice(0, 10);
      navigate(`/doctordashboard/scheduler/today?date=${iso}`);
    };

    const handleMonthChange = (monthIndex) => {
      const newDate = new Date(date);
      newDate.setMonth(monthIndex);
      onNavigate('date', newDate);
      setCurrentDate(newDate);
      setShowMonthPicker(false);
    };

    const handleYearChange = (year) => {
      const newDate = new Date(date);
      newDate.setFullYear(year);
      onNavigate('date', newDate);
      setCurrentDate(newDate);
      setShowYearPicker(false);
    };

    const stop = (e) => e.stopPropagation();

    return (
      <div className="scheduler-toolbar" onClick={stop} style={{ zIndex: 2 }}>
        <div className="toolbar-left" style={{ position: 'relative' }}>
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
            <div className="picker-dropdown month-picker" style={{ top: 48, left: 0 }} onClick={(e) => e.stopPropagation()}>
              {months.map((month, index) => (
                <button key={month} className={`picker-option ${date.getMonth() === index ? 'active' : ''}`} onClick={() => handleMonthChange(index)}>{month}</button>
              ))}
            </div>
          )}

          {showYearPicker && (
            <div className="picker-dropdown year-picker" style={{ top: 48, left: 110 }} onClick={(e) => e.stopPropagation()}>
              {years.map((year) => (
                <button key={year} className={`picker-option ${date.getFullYear() === year ? 'active' : ''}`} onClick={() => handleYearChange(year)}>{year}</button>
              ))}
            </div>
          )}
        </div>

        <div className="toolbar-center">
          <button onClick={goToBack} className="nav-btn" aria-label="Previous month"><ChevronLeft size={20} /></button>
          <button onClick={goToCurrent} className="today-btn" aria-label="Today">Today</button>
          <button onClick={goToNext} className="nav-btn" aria-label="Next month"><ChevronRight size={20} /></button>
        </div>

        <div className="toolbar-right">
          <button onClick={() => setShowAvailabilityModal(true)} className="availability-btn">Manage Availability</button>
        </div>
      </div>
    );
  };

  const getInitial = (name) => {
    if (!name) return '?';
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
            style={{ height: '100%', overflow: 'visible' }}
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
            views={['month']}
            defaultView="month"
            dayPropGetter={() => ({})}
            className="no-inner-scroll"
          />
        </div>

        <div className="sidebar-section" aria-hidden={false}>
          <div className="upcoming-card">
            <div className="card-header">
              <CalendarIcon size={18} />
              <h3>Upcoming Appointments</h3>
            </div>

            <div className="upcoming-list" style={{ maxHeight: 'none', overflow: 'visible' }}>
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
                    onClick={() => {
                      const full = events.find((e) => e.id === appt.id) || appt;
                      if (full.resource?.events) {
                        setDayEvents(full.resource.events || []);
                        setSelectedDate(full.start);
                        setShowDayAppointments(true);
                      } else {
                        handleSelectEvent(full);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const full = events.find((ev) => ev.id === appt.id) || appt;
                        handleSelectEvent(full);
                      }
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        color: '#fff',
                        background: appt.resource.color || '#3b82f6',
                        flexShrink: 0,
                        fontSize: 14,
                      }}
                      aria-hidden
                    >
                      {getInitial(appt.title)}
                    </div>

                    <div className="appt-details">
                      <div className="appt-patient">
                        <span className="patient-name">{appt.resource.patient}</span>
                        {appt.resource.type && (
                          <span className={`type-inline ${appt.resource.type?.toLowerCase()}`}>{appt.resource.type}</span>
                        )}
                      </div>

                      <div className="appt-time">
                        <Clock size={14} />
                        {format(appt.start, 'h:mm a')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="stats-card">
            <div className="stat-item">
              <div className="stat-label">Total Appointments</div>
              <div className="stat-value">{events.length}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">This Month</div>
              <div className="stat-value">
                {events.filter(
                  (e) =>
                    e.start.getMonth() === currentDate.getMonth() &&
                    e.start.getFullYear() === currentDate.getFullYear()
                ).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAvailabilityModal && <AvailabilityModal isOpen={showAvailabilityModal} onClose={() => setShowAvailabilityModal(false)} />}

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
