"use client";

import { useEffect, useState } from "react";

import {
  EVENT_TYPE_META,
  SCHEDULE_DAYS,
  type ScheduleEventType,
} from "../schedule/scheduleData";

// Pick the tab to open by default based on today: the day matching today's date,
// the first day if the event hasn't started, or the last day if it has passed.
function defaultDayId(today: string): string {
  const first = SCHEDULE_DAYS[0];
  const last = SCHEDULE_DAYS[SCHEDULE_DAYS.length - 1];
  if (today <= first.isoDate) return first.id;
  if (today >= last.isoDate) return last.id;
  // Somewhere in the middle: the most recent day that has already started.
  for (let i = SCHEDULE_DAYS.length - 1; i >= 0; i--) {
    if (today >= SCHEDULE_DAYS[i].isoDate) return SCHEDULE_DAYS[i].id;
  }
  return first.id;
}

// Small color-coded dot per event type — carries the same color signal as the
// old frontend's schedule (frontend-old/src/components/home/Schedule.jsx) without
// the left-border stripe, so events read as a clean list rather than tagged cards.
const TYPE_DOT: Record<ScheduleEventType, string> = {
  announcement: "bg-yellow-300/90",
  main: "bg-white/90",
  food: "bg-green-light",
  workshop: "bg-green-dark",
};

export default function ScheduleSection() {
  const [activeDayId, setActiveDayId] = useState(SCHEDULE_DAYS[0].id);
  const activeDay =
    SCHEDULE_DAYS.find((day) => day.id === activeDayId) ?? SCHEDULE_DAYS[0];

  // Open the date-appropriate tab on mount. Done in an effect (not initial state)
  // so server and client render the same first paint and avoid a hydration
  // mismatch when their local dates differ.
  useEffect(() => {
    // "en-CA" formats as YYYY-MM-DD, matching each day's isoDate for comparison.
    const today = new Date().toLocaleDateString("en-CA");
    setActiveDayId(defaultDayId(today));
  }, []);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-20 sm:px-8">
      <h2 className="mb-4 text-center font-display text-[clamp(2.5rem,7vw,4rem)] font-normal leading-none tracking-wide text-white/95 text-shadow-hero-title">
        Schedule
      </h2>
      <p className="mb-10 text-center text-base text-text-primary/80">
        Full schedule coming soon — dates and times are TBD.
      </p>

      {/* Day tabs */}
      <div
        role="tablist"
        aria-label="Schedule days"
        className="mb-6 flex flex-col gap-2 sm:flex-row sm:justify-center"
      >
        {SCHEDULE_DAYS.map((day) => {
          const selected = day.id === activeDayId;
          return (
            <button
              key={day.id}
              role="tab"
              type="button"
              id={`schedule-tab-${day.id}`}
              aria-selected={selected}
              aria-controls={`schedule-panel-${day.id}`}
              onClick={() => setActiveDayId(day.id)}
              className={`flex-1 cursor-pointer rounded-xl border px-5 py-3 text-center font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 sm:flex-none ${
                selected
                  ? "border-white bg-white text-blue-900 shadow-lg"
                  : "border-white/20 bg-white/[0.06] text-white/70 hover:bg-white/15 hover:text-white/90"
              }`}
            >
              <span className="block text-lg leading-tight">{day.label}</span>
              <span
                className={`block text-sm ${
                  selected ? "text-blue-900/70" : "text-text-primary/70"
                }`}
              >
                {day.date}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active day panel */}
      <div
        role="tabpanel"
        id={`schedule-panel-${activeDay.id}`}
        aria-labelledby={`schedule-tab-${activeDay.id}`}
        className="flex flex-col gap-3"
      >
        {activeDay.events.map((event, index) => {
          const meta = EVENT_TYPE_META[event.type];
          return (
            <div
              key={`${activeDay.id}-${index}`}
              className="flex items-start gap-3.5 rounded-xl border border-white/20 bg-white/10 px-5 py-4 transition-colors hover:bg-white/15"
            >
              <span
                aria-hidden="true"
                className={`mt-[0.5rem] size-2.5 shrink-0 rounded-full ${TYPE_DOT[event.type]}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-x-3 gap-y-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {event.title}
                  </h3>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-white/95">
                    {event.time}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-white/75">
                  <span className="sr-only">{meta.label} — </span>
                  {event.location}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
