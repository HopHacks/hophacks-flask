// Placeholder schedule data. Times, titles, and locations are TBD and should be
// filled in once the 2026 event schedule is finalized.

export type ScheduleEventType = "main" | "food" | "workshop" | "announcement";

export interface ScheduleEvent {
  time: string;
  title: string;
  location: string;
  type: ScheduleEventType;
}

export interface ScheduleDay {
  /** Stable key used for tab state and React keys. */
  id: string;
  /** Short label shown on the day tab, e.g. "Day 1". */
  label: string;
  /** Full date shown as the day heading, e.g. "Friday, TBD". */
  date: string;
  /** Machine-readable date (YYYY-MM-DD) used to pick the default open tab. */
  isoDate: string;
  events: ScheduleEvent[];
}

/** Human-friendly label for each event type (used for the screen-reader prefix). */
export const EVENT_TYPE_META: Record<ScheduleEventType, { label: string }> = {
  announcement: { label: "Announcement" },
  main: { label: "Main" },
  food: { label: "Food" },
  workshop: { label: "Workshop" },
};

export const SCHEDULE_DAYS: ScheduleDay[] = [
  {
    id: "day-1",
    label: "Day 1",
    date: "Friday, September 18",
    isoDate: "2026-09-18",
    events: [
      {
        time: "6:00–8:00 PM",
        title: "Check-in",
        location: "3400 N Charles St, Levering Hall Glass Pavilion, Baltimore, MD 21218",
        type: "main",
      },
      {
        time: "6:30–8:00 PM",
        title: "Dinner",
        location:
          "3400 N Charles St, Levering Hall Glass Pavilion, Baltimore, MD 21218",
        type: "food",
      },
      {
        time: "8:00 PM",
        title: "Opening Ceremony",
        location:
          "3400 N Charles St, Levering Hall Glass Pavilion, Baltimore, MD 21218",
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
        location: "3400 N Charles St, Levering Hall Great Hall, Baltimore, MD 21218",
        type: "announcement",
      },
      {
        time: "9:30 PM",
        title: "Memetic Data Crash Course",
        location: "TBD",
        type: "workshop",
      },
    ],
  },
  {
    id: "day-2",
    label: "Day 2",
    date: "Saturday, September 19",
    isoDate: "2026-09-19",
    events: [
      {
        time: "9:00–10:00 AM",
        title: "Breakfast",
        location:
          "3400 N Charles St, Levering Hall Glass Pavilion, Baltimore, MD 21218",
        type: "food",
      },
      {
        time: "10:00 AM",
        title: "Hack the Agent Stack: MCP, LLMs & Agentic AI",
        location: "TBD",
        type: "workshop",
      },
      {
        time: "All Day",
        title: "Hacking Continues — more events TBA",
        location: "TBD",
        type: "workshop",
      },
      {
        time: "1:00–2:30 PM",
        title: "Lunch",
        location:
          "3400 N Charles St, Levering Hall Glass Pavilion, Baltimore, MD 21218",
        type: "food",
      },
      {
        time: "8:00–10:00 PM",
        title: "Dinner",
        location:
          "3400 N Charles St, Levering Hall Glass Pavilion, Baltimore, MD 21218",
        type: "food",
      },
    ],
  },
  {
    id: "day-3",
    label: "Day 3",
    date: "Sunday, September 20",
    isoDate: "2026-09-20",
    events: [
      {
        time: "9:00–10:00 AM",
        title: "Breakfast",
        location:
          "3400 N Charles St, Levering Hall Glass Pavilion, Baltimore, MD 21218",
        type: "food",
      },
      {
        time: "9:00 AM",
        title: "Submissions Due",
        location: "TBD",
        type: "announcement",
      },
      {
        time: "12:00–1:00 PM",
        title: "Lunch",
        location:
          "3400 N Charles St, Levering Hall Glass Pavilion, Baltimore, MD 21218",
        type: "food",
      },
      {
        time: "1:00 PM",
        title: "Top 10 Demos",
        location: "TBD",
        type: "main",
      },
      {
        time: "2:30 PM",
        title: "Closing Ceremony",
        location:
          "3400 N Charles St, Hodson Hall Room 110, Baltimore, MD 21218",
        type: "main",
      },
    ],
  },
];
