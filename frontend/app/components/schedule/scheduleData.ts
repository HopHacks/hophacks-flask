// Placeholder schedule data. Times, titles, and locations are TBD and should be
// filled in once the 2026 event schedule is finalized.

export type ScheduleEventType = "main" | "food" | "workshop" | "announcement";

export interface ScheduleEvent {
  time: string;
  title: string;
  location: string;
  emoji?: string;
  type: ScheduleEventType;
}

export interface ScheduleDay {
  /** Stable key used for tab state and React keys. */
  id: string;
  /** Short label shown on the day tab, e.g. "Day 1". */
  label: string;
  /** Full date shown as the day heading, e.g. "Friday, TBD". */
  date: string;
  events: ScheduleEvent[];
}

/** Human-friendly labels + emoji for each event type (used for the legend/badges). */
export const EVENT_TYPE_META: Record<
  ScheduleEventType,
  { label: string; emoji: string }
> = {
  announcement: { label: "Announcement", emoji: "📣" },
  main: { label: "Main", emoji: "💠" },
  food: { label: "Food", emoji: "🍽️" },
  workshop: { label: "Workshop", emoji: "🛠️" },
};

export const SCHEDULE_DAYS: ScheduleDay[] = [
  {
    id: "day-1",
    label: "Day 1",
    date: "Friday, TBD",
    events: [
      {
        time: "TBD",
        title: "Check-in",
        location: "TBD",
        emoji: "💫",
        type: "main",
      },
      {
        time: "TBD",
        title: "Dinner",
        location: "TBD",
        emoji: "🍕",
        type: "food",
      },
      {
        time: "TBD",
        title: "Opening Ceremony",
        location: "TBD",
        emoji: "🎉",
        type: "main",
      },
      {
        time: "TBD",
        title: "Hacking Begins!",
        location: "TBD",
        type: "announcement",
      },
    ],
  },
  {
    id: "day-2",
    label: "Day 2",
    date: "Saturday, TBD",
    events: [
      {
        time: "TBD",
        title: "Breakfast",
        location: "TBD",
        emoji: "🥞",
        type: "food",
      },
      {
        time: "TBD",
        title: "Workshops TBA",
        location: "TBD",
        emoji: "🛠️",
        type: "workshop",
      },
      {
        time: "TBD",
        title: "Lunch",
        location: "TBD",
        emoji: "🌯",
        type: "food",
      },
      {
        time: "TBD",
        title: "Dinner",
        location: "TBD",
        emoji: "🍕",
        type: "food",
      },
    ],
  },
  {
    id: "day-3",
    label: "Day 3",
    date: "Sunday, TBD",
    events: [
      {
        time: "TBD",
        title: "Submissions Due",
        location: "TBD",
        type: "announcement",
      },
      {
        time: "TBD",
        title: "Science Fair",
        location: "TBD",
        emoji: "🚀",
        type: "main",
      },
      {
        time: "TBD",
        title: "Awards & Closing Ceremony",
        location: "TBD",
        emoji: "🏆",
        type: "main",
      },
    ],
  },
];
