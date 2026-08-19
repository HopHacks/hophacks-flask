"use client";

import { useState } from "react";

import {
  EVENT_TYPE_META,
  SCHEDULE_DAYS,
  type ScheduleEventType,
} from "../schedule/scheduleData";

// Subtle accent per event type, layered over the translucent card background so
// it reads against the blue page background in the same spirit as the old
// frontend's color-coded schedule (frontend-old/src/components/home/Schedule.jsx).
const TYPE_ACCENT: Record<ScheduleEventType, string> = {
  announcement: "border-l-yellow-300/80",
  main: "border-l-white/80",
  food: "border-l-green-light/90",
  workshop: "border-l-green-dark/90",
};

export default function ScheduleSection() {
  const [activeDayId, setActiveDayId] = useState(SCHEDULE_DAYS[0].id);
  const activeDay =
    SCHEDULE_DAYS.find((day) => day.id === activeDayId) ?? SCHEDULE_DAYS[0];

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
              className={`flex-1 rounded-xl border px-5 py-3 text-center font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 sm:flex-none ${
                selected
                  ? "border-white/60 bg-white/25 text-white"
                  : "border-white/25 bg-white/10 text-white/85 hover:bg-white/15"
              }`}
            >
              <span className="block text-lg leading-tight">{day.label}</span>
              <span className="block text-sm text-text-primary/70">
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
              className={`flex items-start gap-4 rounded-xl border border-l-4 border-white/25 bg-white/10 px-5 py-4 transition-colors hover:bg-white/15 ${TYPE_ACCENT[event.type]}`}
            >
              <span
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-2xl leading-none"
              >
                {event.emoji ?? meta.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-x-3 gap-y-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {event.title}
                  </h3>
                  <span className="shrink-0 text-sm font-medium text-text-primary/80">
                    {event.time}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-text-primary/80">
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
