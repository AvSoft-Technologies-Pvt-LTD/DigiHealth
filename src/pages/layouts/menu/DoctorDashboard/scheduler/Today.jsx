import React, { useMemo, useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parseISO, parse, startOfDay, endOfDay } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useLocation, useNavigate } from "react-router-dom";
import "./scheduler.css";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => new Date(),
  getDay: (d) => d.getDay(),
  locales,
});

// Demo events generator for any date
const demoEventsForDate = (dateObj) => {
  const d = dateObj;
  const mk = (h, m, duration = 40) => {
    const start = new Date(d);
    start.setHours(h, m, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + duration);
    return { start, end };
  };
  const patients = [
    "John Smith",
    "Peter Chung",
    "Anita R",
    "Sarah Johnson",
    "Mike Davis",
    "Emily Chen",
    "Robert Wilson",
    "Lisa Anderson",
    "David Brown",
    "Maria Garcia",
    "James Taylor",
    "Jennifer Martinez",
  ];
  const types = ["PHYSICAL", "VIRTUAL"];
  const statuses = ["Upcoming", "Confirmed", "Checked In"];
  const titles = [
    "Medical Checkup",
    "Operation",
    "Follow-up",
    "Consultation",
    "Annual Physical",
  ];
  const colors = [
    "#10b981",
    "#3b82f6",
    "#f97316",
    "#8b5cf6",
    "#06b6d4",
    "#ef4444",
  ];
  const timeSlots = [
    { h: 8, m: 0 },
    { h: 9, m: 0 },
    { h: 10, m: 30 },
    { h: 11, m: 0 },
    { h: 13, m: 30 },
    { h: 14, m: 0 },
    { h: 15, m: 0 },
    { h: 16, m: 0 },
  ];
  return timeSlots.map((slot, idx) => {
    const times = mk(slot.h, slot.m);
    return {
      id: `demo-${idx}-${d.toISOString().slice(0, 10)}`,
      title: titles[idx % titles.length],
      start: times.start,
      end: times.end,
      resource: {
        patient: patients[idx % patients.length],
        color: colors[idx % colors.length],
        consultationType: types[idx % 2],
        status: statuses[idx % statuses.length],
        groupCount: idx === 3 ? 3 : 0,
      },
    };
  });
};

const Today = ({ events = [], onSelectEvent }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const dateParam = query.get("date");
  const [selectedDate, setSelectedDate] = useState(() => {
    if (dateParam) {
      try {
        const parsed = parseISO(dateParam);
        if (!isNaN(parsed.getTime())) {
          return startOfDay(parsed);
        }
      } catch (e) {
        console.error("Date parse error:", e);
      }
    }
    return startOfDay(new Date());
  });

  const dayEvents = useMemo(() => {
    const start = startOfDay(selectedDate).toISOString().slice(0, 10);
    const filtered = events.filter((ev) => {
      if (!ev || !ev.start) return false;
      const evDate = new Date(ev.start).toISOString().slice(0, 10);
      return evDate === start;
    });
    return filtered.length > 0
      ? filtered.map((ev, idx) => ({
          ...ev,
          id: ev.id || `evt-${idx}`,
          resource: ev.resource || {
            patient: ev.title || "Patient",
            color: ev.resource?.color || "#3b82f6",
          },
        }))
      : demoEventsForDate(selectedDate);
  }, [events, selectedDate]);

  const eventStyleGetter = (event) => {
    const color = event.resource?.color || "#3b82f6";
    return {
      style: {
        background: "#fff",
        borderLeft: `6px solid ${color}`,
        boxShadow: "0 2px 6px rgba(15,23,42,0.06)",
        color: "#0b1220",
        padding: "8px 10px",
        borderRadius: 8,
        height: "auto",
      },
    };
  };

  const initials = (name = "") => {
    const t = (name || "").trim();
    return t ? t.charAt(0).toUpperCase() : "?";
  };

  const EventComponent = ({ event }) => {
    const patient = event.resource?.patient || event.title;
    const type = (
      event.resource?.consultationType ||
      event.resource?.type ||
      ""
    ).toUpperCase();
    const status = event.resource?.status || "";
    const groupCount = event.resource?.groupCount || 0;
    return (
      <div
        className="today-event-card"
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: 8,
          boxSizing: "border-box",
        }}
        role="button"
        tabIndex={0}
        onClick={() => onSelectEvent?.(event)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSelectEvent?.(event);
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            minWidth: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                background: event.resource?.color || "#3b82f6",
                border: "2px solid #fff",
                boxSizing: "content-box",
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
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#0b1220",
                  background: "#f3f4f6",
                  border: "1px solid #e6eefc",
                }}
                title={`+${groupCount - 1} more`}
              >
                +{groupCount - 1}
              </div>
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {patient}
              </div>
              <div
                style={{
                  marginLeft: 8,
                  padding: "4px 8px",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  background: type === "PHYSICAL" ? "#dbeafe" : "#d1fae5",
                  color: type === "PHYSICAL" ? "#1e40af" : "#065f46",
                }}
              >
                {type || "—"}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginTop: 6,
              }}
            >
              <div style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>
                {format(new Date(event.start), "hh:mm a")} —{" "}
                {format(new Date(event.end), "hh:mm a")}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                {event.title}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <div
            style={{
              padding: "6px 8px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              background: status === "Done" ? "#e6ffed" : "#fff7ed",
              color: status === "Done" ? "#047857" : "#92400e",
              border: "1px solid rgba(0,0,0,0.04)",
              whiteSpace: "nowrap",
            }}
          >
            {status}
          </div>
        </div>
      </div>
    );
  };

  const CustomToolbar = ({ label, onNavigate }) => {
    const goToPrev = () => {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      setSelectedDate(newDate);
      const iso = newDate.toISOString().slice(0, 10);
      navigate(`?date=${iso}`, { relative: "route" });
    };
    const goToNext = () => {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDate(newDate);
      const iso = newDate.toISOString().slice(0, 10);
      navigate(`?date=${iso}`, { relative: "route" });
    };
    const goToCalendar = () => {
      navigate("..", { relative: "path" });
    };
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          padding: "12px 0",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={goToPrev}
            style={{
              border: "1px solid #e6eefc",
              padding: 8,
              borderRadius: 8,
              background: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Previous day"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goToNext}
            style={{
              border: "1px solid #e6eefc",
              padding: 8,
              borderRadius: 8,
              background: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Next day"
          >
            <ChevronRight size={18} />
          </button>
          <div
            style={{
              fontWeight: 700,
              color: "#0b1220",
              fontSize: 18,
              marginLeft: 8,
            }}
          >
            {format(selectedDate, "MMMM d, yyyy")}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ color: "#64748b", fontSize: 13 }}>
            Total appointments: {dayEvents.length}
          </div>
          <button
            onClick={goToCalendar}
            style={{
              border: "1px solid #e6eefc",
              padding: "8px 16px",
              borderRadius: 8,
              background: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: "#475569",
            }}
          >
            <CalendarIcon size={16} />
            Back to Calendar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        height: "calc(100vh - 40px)",
        padding: 20,
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: "white",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
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
          onSelectEvent={onSelectEvent}
          eventPropGetter={eventStyleGetter}
          style={{
            height: "calc(100vh - 180px)",
            background: "white",
          }}
          min={
            new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              8,
              0,
              0
            )
          }
          max={
            new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              18,
              0,
              0
            )
          }
        />
      </div>
    </div>
  );
};

export default Today;
