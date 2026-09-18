// Placeholder schedule data. Times, titles, and locations are TBD and should be
// filled in once the 2026 event schedule is finalized.

export type ScheduleEventType = "main" | "food" | "workshop" | "announcement";

export interface ScheduleEvent {
  time: string;
  title: string;
  location?: string;
  description?: string;
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
        time: "8:00–9:00 PM",
        title: "Opening Ceremony and Team Matching",
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
        title: "Fellows X Forge Kickoff by Forge",
        location: "Levering Hall Glass Pavilion",
        description:
          "A fireside chat with Cory Levy of Z Fellows, focused on his experience in the startup ecosystem, his work with emerging founders, and his perspective on supporting early-stage companies. The conversation will include time for audience questions.",
        type: "workshop",
      },
      {
        time: "9:30–10:00 PM",
        title: "Memetics Data Crash Course by Calcifer Computing",
        location: "Hodson 210",
        description:
          "Learn the basics of accessing and analyzing Calcifer's large social media datasets.",
        type: "workshop",
      },
      {
        time: "11:00 PM",
        title: "Sponsor Hall Closes",
        location: "Levering Hall Great Hall",
        type: "announcement",
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
        title: "Sponsor Hall Opens",
        location: "Levering Hall Glass Pavilion",
        type: "announcement",
      },
      {
        time: "10:00–10:30 AM",
        title: "Hack the Agent Stack: MCP, LLMs & Agentic AI by Strategy",
        location: "Hodson 210",
        description:
          "Go under the hood of modern AI agents and see how LLMs, MCP, tools, and backend services work together. We’ll trace how a request moves through an agent architecture, and demo how the same capabilities can connect to Claude, Copilot, and Strategy products.",
        type: "workshop",
      },
      {
        time: "10:30–11:00 AM",
        title: "Designing Agentic Experiences for Teams by Auctor",
        location: "Hodson 210",
        description:
          "Most AI experiences today assume a 1:1 relationship: one user, one agent, one conversation. But real work is multiplayer. Once agents enter teams, the design problem shifts from “Can the AI do this?” to “Who asked it to do this, on whose behalf, using what context, and who needs to know?”",
        type: "workshop",
      },
      {
        time: "11:00–11:30 AM",
        title: "Hacking with GitHub Copilot by MLH",
        location: "Hodson 210",
        description:
          "GitHub Copilot is a fully-agentic AI pair programmer that can help you write, debug, & understand code. We'll fork a README for your personal GitHub profile. We'll then use the GitHub and MLH MCP servers to pull live, personalized data. GitHub Copilot will use the template and data to create a customized profile just for you.",
        type: "workshop",
      },
      {
        time: "11:00 AM–2:00 PM",
        title: "Grok Bot Coffee Cart by SpaceXAI",
        location: "Levering Hall Glass Pavilion",
        type: "announcement",
      },
      {
        time: "11:00 AM–3:00 PM",
        title: "Grok Bot Photo Booth by SpaceXAI",
        location: "Levering Hall Glass Pavilion",
        type: "announcement",
      },
      {
        time: "11:30 AM–12:00 PM",
        title: "Building Web Apps with Marimo by Marimo",
        location: "Hodson 210 (virtual)",
        description:
          "Want to turn your Python notebooks into interactive web apps—without touching JavaScript or complex frameworks? In this workshop, we’ll introduce Marimo, an open-source reactive notebook that makes it easy to build and share powerful data apps, dashboards, and visualizations. You’ll learn how to go from data exploration to a polished, interactive web app in minutes, perfect for hackathon projects and beyond.",
        type: "workshop",
      },
      {
        time: "12:00–12:30 PM",
        title: "Intro to Google Studio AI by MLH",
        location: "Hodson 210",
        description:
          "Google AI Studio allows you to try out Gemini's massive token context window, grab an API key in seconds, and experiment with prebuilt prompts.",
        type: "workshop",
      },
      {
        time: "1:30–2:00 PM",
        title: "TechTogether MeetUp by MLH",
        location: "Levering Hall Glass Pavilion",
        description:
          "TechTogether is an initiative to close gender gaps in tech by supporting equity-focused hackathons and skill-building workshops. Early access to LUNCH and MERCH.",
        type: "workshop",
      },
      {
        time: "2:00–2:30 PM",
        title: "HopHacks Merch Drop",
        location: "Levering Hall Glass Pavilion",
        type: "announcement",
      },
      {
        time: "2:00–3:00 PM",
        title: "Lunch",
        location: "Levering Hall Glass Pavilion",
        type: "food",
      },
      {
        time: "3:30–4:30 PM",
        title:
          "Build Your Entire Internship Application Stack in 30 Minutes by SpaceXAI",
        location: "Hodson 210",
        description:
          "Learn how to use SpaceXAI's tools like Cursor, Grok Imagine, and Grok Bot to build your resume, create a portfolio website, and apply to jobs in 30 minutes.",
        type: "workshop",
      },
      {
        time: "4:30–5:30 PM",
        title: "SWE Day in the Life in the Age of AI Panel by Bloomberg",
        location: "Hodson 210",
        description:
          "Meet Bloomberg software engineers and hear firsthand about their experiences. Learn more about Bloomberg’s technology, company culture, and what it’s like to build impactful products as a SWE in the age of AI.",
        type: "workshop",
      },
      {
        time: "8:00–10:00 PM",
        title: "Dinner",
        location: "Levering Hall Glass Pavilion",
        type: "food",
      },
      {
        time: "10:00–10:30 PM",
        title:
          "Building and Evaluating LLM-as-a-Judge by Johns Hopkins Data Science and AI Institute",
        location: "Hodson 210",
        description:
          "This workshop will teach how to use an LLM as a judge to evaluate the quality of AI generated output. You’ll build a judging prompt, compare its scores with human ratings, and explore common pitfalls like bias and inconsistent judgments. Leave with a practical evaluation workflow you can apply to your hackathon project.",
        type: "workshop",
      },
      {
        time: "11:00 PM",
        title: "Sponsor Hall Closes",
        location: "Levering Hall Glass Pavilion",
        type: "announcement",
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
