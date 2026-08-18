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
    date: "Friday, September 18",
    events: [
      {
        time: "6:00–8:00 PM",
        title: "Check-in",
        location: "TBD",
        emoji: "💫",
        type: "main",
      },
      {
        time: "8:00 PM",
        title: "Opening Ceremony",
        location: "TBD",
        emoji: "🎉",
        type: "main",
      },
      {
        time: "9:00 PM",
        title: "Hacking Begins!",
        location: "TBD",
        type: "announcement",
      },
      {
        time: "9:00 PM",
        title: "Sponsor Hall Opens",
        location: "TBD",
        emoji: "🤝",
        type: "announcement",
      },
    ],
  },
  {
    id: "day-2",
    label: "Day 2",
    date: "Saturday, September 19",
    events: [
      {
        time: "All Day",
        title: "Hacking Continues — more events TBA",
        location: "TBD",
        emoji: "🛠️",
        type: "workshop",
      },
    ],
  },
  {
    id: "day-3",
    label: "Day 3",
    date: "Sunday, September 20",
    events: [
      {
        time: "9:00 AM",
        title: "Submissions Due",
        location: "TBD",
        type: "announcement",
      },
      {
        time: "1:00 PM",
        title: "Top 10 Demos",
        location: "TBD",
        emoji: "🌟",
        type: "main",
      },
      {
        time: "2:30 PM",
        title: "Closing Ceremony",
        location: "TBD",
        emoji: "🏆",
        type: "main",
      },
    ],
  },
];
