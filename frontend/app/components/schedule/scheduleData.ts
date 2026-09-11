// Placeholder schedule data. Times, titles, and locations are TBD and should be
// filled in once the 2026 event schedule is finalized.

export type ScheduleEventType = "main" | "food" | "workshop" | "announcement";

export interface ScheduleEvent {
  time: string;
  title: string;
  location?: string;
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
        location:
          "3400 N Charles St, Levering Hall Glass Pavilion, Baltimore, MD 21218",
        type: "main",
      },
      {
        time: "6:30–8:00 PM",
        title: "Dinner",
        location: "Levering Hall Glass Pavilion",
        type: "food",
      },
      {
        time: "8:00 PM",
        title: "Opening Ceremony",
        location: "Levering Hall Glass Pavilion",
        type: "main",
      },
      {
        time: "9:00 PM",
        title: "Hacking Begins!",
        location: "Hodson Hall",
        type: "announcement",
      },
      {
        time: "9:00 PM",
        title: "Sponsor Hall Opens",
        location: "Levering Hall Great Hall",
        type: "announcement",
      },
      {
        time: "9:00–9:30 PM",
        title: "Fellows X Forge Kickoff",
        location: "Levering Hall Glass Pavilion",
        type: "workshop",
      },
      {
        time: "9:30 PM",
        title: "Memetic Data Crash Course by Calcifer Computing",
        location: "Hodson 210",
        type: "workshop",
      },
      {
        time: "10:00–10:30 PM",
        title: "Building Web Apps with Marimo",
        location: "Hodson 210 (virtual)",
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
        location: "Levering Hall Glass Pavilion",
        type: "food",
      },
      {
        time: "10:00 AM",
        title: "Hack the Agent Stack: MCP, LLMs & Agentic AI by Strategy",
        location: "Hodson 210",
        type: "workshop",
      },
      {
        time: "10:30–11:00 AM",
        title: "Designing Agentic Experiences for Teams by Auctor",
        location: "Hodson 210",
        type: "workshop",
      },
      {
        time: "11:00–11:30 AM",
        title: "Hacking with GitHub Copilot by MLH",
        location: "Hodson 210",
        type: "workshop",
      },
      {
        time: "11:00 AM–2:00 PM",
        title: "Grok Bot Coffee Cart by SpaceXAI",
        type: "announcement",
      },
      {
        time: "11:00 AM–3:00 PM",
        title: "Grok Bot Photo Booth by SpaceXAI",
        type: "announcement",
      },
      {
        time: "1:00–2:30 PM",
        title: "Lunch",
        location: "Levering Hall Glass Pavilion",
        type: "food",
      },
      {
        time: "3:30–4:00 PM",
        title: "TechTogether MeetUp by MLH",
        location: "Levering Hall Glass Pavilion",
        type: "workshop",
      },
      {
        time: "4:00–4:30 PM",
        title:
          "Build Your Entire Internship Application Stack in 30 Minutes by SpaceXAI",
        location: "Hodson 210",
        type: "workshop",
      },
      {
        time: "4:30–5:00 PM",
        title: "Intro to Google Studio AI by MLH",
        location: "Hodson 210",
        type: "workshop",
      },
      {
        time: "8:00–10:00 PM",
        title: "Dinner",
        location: "Levering Hall Glass Pavilion",
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
        time: "8:30 AM",
        title: "Soft Submission Deadline",
        type: "announcement",
      },
      {
        time: "9:00 AM",
        title: "Hard Submission Deadline",
        type: "announcement",
      },
      {
        time: "9:00–9:45 AM",
        title: "Breakfast",
        location: "Levering Hall Glass Pavilion",
        type: "food",
      },
      {
        time: "10:00 AM–12:00 PM",
        title: "Science Fair and Judging",
        location: "Hodson Hall rooms (TBA)",
        type: "main",
      },
      {
        time: "12:00–1:00 PM",
        title: "Lunch",
        location: "Levering Hall Glass Pavilion",
        type: "food",
      },
      {
        time: "1:00 PM",
        title: "Top 10 Demos and Judging",
        location: "Hodson 110",
        type: "main",
      },
      {
        time: "2:30 PM",
        title: "Closing Ceremony",
        location: "Hodson Hall Room 110",
        type: "main",
      },
    ],
  },
];
