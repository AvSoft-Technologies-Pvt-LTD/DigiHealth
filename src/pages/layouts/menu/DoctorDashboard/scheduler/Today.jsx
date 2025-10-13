// File: Today.jsx
// Single-doctor day timeline view. Reads `date` query param (YYYY-MM-DD) and falls back to today.
// Renders a single-column day timeline and compact appointment cards (avatars left, PHYSICAL/VIRTUAL badge right).
// Preserves onSelectEvent handler behavior passed as prop.

import React, { useMemo, useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parseISO, parse, startOfDay, endOfDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useLocation } from 'react-router-dom';
import "./scheduler.css";

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => new Date(), getDay: (d) => d.getDay(), locales });

// Minimal fallback demo events (will be used if no real events provided for the selected date)
const demoEventsForDate = (dateObj) => {
  // make demo times on that date (8:00, 10:30, 13:30, 15:00)
  const d = dateObj;
  const mk = (h, m) => {
    const dt = new Date(d);
    dt.setHours(h, m, 0, 0);
    return dt;
  };
  return [
    {
      id: `demo-1-${d.toISOString().slice(0, 10)}`,
      title: 'Medical Checkup',
      start: mk(8, 0),
      end: mk(8, 40),
      resource: { patient: 'John Smith', color: '#10b981', consultationType: 'PHYSICAL', status: 'Upcoming' },
    },
    {
      id: `demo-2-${d.toISOString().slice(0, 10)}`,
      title: 'Operation',
      start: mk(10, 30),
      end: mk(11, 30),
      resource: { patient: 'Peter Chung', color: '#3b82f6', consultationType: 'PHYSICAL', status: 'Upcoming' },
    },
    {
      id: `demo-3-${d.toISOString().slice(0, 10)}`,
      title: 'Medical Checkup',
      start: mk(13, 30),
      end: mk(14, 10),
      resource: { patient: 'Anita R', color: '#f97316', consultationType: 'VIRTUAL', status: 'Upcoming' },
    },
    {
      id: `demo-4-${d.toISOString().slice(0, 10)}`,
      title: 'Follow-up',
      start: mk(15, 0),
      end: mk(15, 30),
      resource: { patient: 'Group Booking', color: '#8b5cf6', consultationType: 'PHYSICAL', status: 'Upcoming', groupCount: 3 },
    },
  ];
};

const Today = ({ events = [], onSelectEvent }) => {
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const dateParam = query.get('date'); // expected YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(() => {
    if (dateParam) {
      try {
        const parsed = parseISO(dateParam);
        if (!isNaN(parsed)) {
          return startOfDay(parsed);
        }
      } catch (e) {
        // ignore parse error
      }
    }
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // filter events passed in by selectedDate; if none, use demo events
  const dayEvents = useMemo(() => {
    const start = startOfDay(selectedDate).toISOString().slice(0, 10);
    const filtered = (events || []).filter((ev) => {
      if (!ev || !ev.start) return false;
      const evDate = new Date(ev.start).toISOString().slice(0, 10);
      return evDate === start;
    });

    if (filtered.length === 0) {
      return demoEventsForDate(selectedDate);
    }
    // normalize events to expected shape: ensure resource object exists
    return filtered.map((ev, idx) => ({
      ...ev,
      id: ev.id || `evt-${idx}`,
      resource: ev.resource || { patient: ev.title || 'Patient', color: ev.resource?.color || '#3b82f6' },
    }));
  }, [events, selectedDate]);

  useEffect(() => {
    // if user updates query param while on page, update selectedDate
    // (component will re-evaluate because location.search changes)
    // already covered by useMemo above
  }, [location.search]);

  const eventStyleGetter = (event) => {
    const color = event.resource?.color || '#3b82f6';
    return {
      style: {
        background: '#fff',
        borderLeft: `6px solid ${color}`,
        boxShadow: '0 2px 6px rgba(15,23,42,0.06)',
        color: '#0b1220',
        padding: '8px 10px',
        borderRadius: 8,
        height: 'auto',
      },
    };
  };

  const initials = (name = '') => {
    const t = (name || '').trim();
    return t ? t.charAt(0).toUpperCase() : '?';
  };

  // Custom event renderer - compact card, avatars left, PHYSICAL/VIRTUAL badge inline to right of patient name, status pill top-right
  const EventComponent = ({ event }) => {
    const patient = event.resource?.patient || event.title;
    const type = (event.resource?.consultationType || event.resource?.type || '').toUpperCase();
    const status = event.resource?.status || '';
    const groupCount = event.resource?.groupCount || 0;

    return (
      <div
        className="today-event-card"
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: 8,
          boxSizing: 'border-box',
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (typeof onSelectEvent === 'function') onSelectEvent(event);
            else window.alert(`Open details for ${event.title}`);
          }
        }}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
          {/* avatar(s) - left stacked/overlap for group */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* single avatar or overlapping */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                color: '#fff',
                background: event.resource?.color || '#3b82f6',
                border: '2px solid #fff',
                boxSizing: 'content-box',
              }}
            >
              {initials(patient)}
            </div>

            {groupCount > 1 && (
              <div
                style={{
                  marginLeft: -10,
                  zIndex: 1,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#0b1220',
                  background: '#f3f4f6',
                  border: '1px solid #e6eefc',
                }}
                title={`+${groupCount - 1} more`}
              >
                +{groupCount - 1}
              </div>
            )}
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {patient}
              </div>

              {/* inline type badge to the right of patient name */}
              <div
                style={{
                  marginLeft: 8,
                  padding: '4px 8px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: type === 'PHYSICAL' ? '#dbeafe' : '#d1fae5',
                  color: type === 'PHYSICAL' ? '#1e40af' : '#065f46',
                }}
              >
                {type || '—'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
              <div style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>
                {format(new Date(event.start), 'hh:mm a')} — {format(new Date(event.end), 'hh:mm a')}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{event.title}</div>
            </div>
          </div>
        </div>

        {/* Right area: status pill */}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div
            style={{
              padding: '6px 8px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              background: status === 'Done' ? '#e6ffed' : '#fff7ed',
              color: status === 'Done' ? '#047857' : '#92400e',
              border: '1px solid rgba(0,0,0,0.04)',
              whiteSpace: 'nowrap',
            }}
          >
            {status}
          </div>
        </div>
      </div>
    );
  };

  // toolbar: keep minimal left/right and label
  const CustomToolbar = ({ label, onNavigate }) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => onNavigate('PREV')}
            style={{
              border: '1px solid #e6eefc',
              padding: 8,
              borderRadius: 8,
              background: 'white',
              cursor: 'pointer',
            }}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={() => onNavigate('NEXT')}
            style={{
              border: '1px solid #e6eefc',
              padding: 8,
              borderRadius: 8,
              background: 'white',
              cursor: 'pointer',
            }}
            aria-label="Next"
          >
            ›
          </button>

          <div style={{ fontWeight: 700, color: '#0b1220' }}>{label}</div>
        </div>

        <div style={{ color: '#64748b', fontSize: 13 }}>Total appointments: {dayEvents.length}</div>
      </div>
    );
  };

  return (
    <div style={{ height: 'calc(100vh - 40px)', padding: 20, background: '#f8fafc' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Calendar
          localizer={localizer}
          events={dayEvents}
          defaultView={Views.DAY}
          views={{ day: true }}
          step={30}
          timeslots={1}
          date={selectedDate}
          startAccessor="start"
          endAccessor="end"
          components={{
            event: EventComponent,
            toolbar: CustomToolbar,
          }}
          onSelectEvent={(ev) => {
            if (typeof onSelectEvent === 'function') onSelectEvent(ev);
            else window.alert(`Open details for ${ev.title}`);
          }}
          eventPropGetter={eventStyleGetter}
          style={{ height: 'calc(100vh - 140px)', background: 'white', borderRadius: 12, padding: 12 }}
          min={new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 8, 0, 0)}
          max={new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 18, 0, 0)}
        />
      </div>
    </div>
  );
};

export default Today;
