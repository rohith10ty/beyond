import { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_SHORT = ["M", "T", "W", "T", "F", "S", "S"];

export default function GlassCalendar({ isOpen = true, selectedDate, onSelect, onClose }) {
  if (!isOpen) return null;
  const initialDate = selectedDate ? new Date(selectedDate) : new Date(2026, 9, 15);
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear() || 2026);
  const [currentMonth, setCurrentMonth] = useState(
    isNaN(initialDate.getMonth()) ? 9 : initialDate.getMonth()
  );
  const [viewMode, setViewMode] = useState("monthly"); // "weekly" | "monthly"
  const [flexibleDates, setFlexibleDates] = useState(false);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Days calculations
  const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const handleDayClick = (day) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    onSelect(dateStr);
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    try {
      const [y, m, d] = selectedDate.split("-").map(Number);
      return y === currentYear && m === currentMonth + 1 && d === day;
    } catch {
      return false;
    }
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      today.getFullYear() === currentYear &&
      today.getMonth() === currentMonth &&
      today.getDate() === day
    );
  };

  // Generate calendar grid array
  const calendarCells = [];

  // Previous month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPrev: true,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
    });
  }

  // Next month padding to fill grid
  const remaining = 35 - calendarCells.length;
  for (let n = 1; n <= (remaining > 0 ? remaining : 42 - calendarCells.length); n++) {
    calendarCells.push({
      day: n,
      isCurrentMonth: false,
      isNext: true,
    });
  }

  // Filter for weekly mode if active
  const displayedCells = viewMode === "weekly" ? calendarCells.slice(firstDayIndex, firstDayIndex + 7) : calendarCells;

  const calendarContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-xl">
      <div className="fixed inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onWheel={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-[320px] sm:max-w-[340px] rounded-3xl border border-white/20 bg-[#091524]/95 p-4 shadow-[0_25px_80px_rgba(0,0,0,0.95)] backdrop-blur-3xl"
      >
        {/* TOP VIEW MODE TOGGLE (Weekly / Monthly) */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("weekly")}
              className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold transition-all ${
                viewMode === "weekly"
                  ? "bg-white text-[#091524] shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setViewMode("monthly")}
              className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold transition-all ${
                viewMode === "monthly"
                  ? "bg-white text-[#091524] shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Monthly
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFlexibleDates(!flexibleDates)}
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-medium transition-all ${
                flexibleDates ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40" : "text-white/60 hover:text-white"
              }`}
            >
              <Sparkles size={10} />
              <span>±3 Days</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* MONTH HEADER WITH NAVIGATION */}
        <div className="mt-2.5 flex items-center justify-between px-1">
          <h3 className="text-[14px] font-bold text-white tracking-tight">
            {MONTH_NAMES[currentMonth]} <span className="text-white/60 font-medium">{currentYear}</span>
          </h3>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* DAYS OF WEEK HEADER */}
        <div className="mt-2.5 grid grid-cols-7 text-center text-[9.5px] font-semibold uppercase tracking-wider text-white/45">
          {DAYS_SHORT.map((d, i) => (
            <div key={i} className="py-0.5">
              {d}
            </div>
          ))}
        </div>

        {/* CALENDAR DAYS GRID */}
        <div className="mt-1 grid grid-cols-7 gap-1 text-center">
          {displayedCells.map((cell, idx) => {
            const selected = cell.isCurrentMonth && isSelected(cell.day);
            const today = cell.isCurrentMonth && isToday(cell.day);

            return (
              <button
                type="button"
                key={idx}
                disabled={!cell.isCurrentMonth}
                onClick={() => cell.isCurrentMonth && handleDayClick(cell.day)}
                className={`relative flex h-7.5 w-7.5 items-center justify-center mx-auto rounded-lg text-[11px] font-medium transition-all ${
                  !cell.isCurrentMonth
                    ? "text-white/20 cursor-default"
                    : selected
                    ? "bg-white text-[#091524] font-bold shadow-[0_0_12px_rgba(255,255,255,0.7)] scale-105"
                    : today
                    ? "border border-white/40 text-white bg-white/10 font-bold"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
                }`}
              >
                <span>{cell.day}</span>
                {selected && (
                  <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-[#091524]" />
                )}
              </button>
            );
          })}
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
          <button
            type="button"
            onClick={() => {
              const today = new Date();
              const formattedMonth = String(today.getMonth() + 1).padStart(2, "0");
              const formattedDay = String(today.getDate()).padStart(2, "0");
              onSelect(`${today.getFullYear()}-${formattedMonth}-${formattedDay}`);
            }}
            className="text-[10.5px] font-medium text-white/70 hover:text-white transition-colors"
          >
            Today
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white px-4 py-1.5 text-[11px] font-bold text-[#091524] shadow-md transition-all hover:bg-slate-100"
          >
            Confirm Date
          </button>
        </div>
      </motion.div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(calendarContent, document.body) : null;
}
