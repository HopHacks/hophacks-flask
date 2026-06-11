export interface TrackEntry {
  /** Placeholder label until real track names land. */
  title: string;
  /** One-line placeholder description. */
  blurb: string;
  /** Token-backed accent utility class for per-card variety. */
  accent: string;
}

// Placeholder tracks ("Idea 1" concept from the design slides). Swap copy +
// accents for the real sponsor tracks once finalized; structure stays the same.
export const TRACK_ENTRIES: TrackEntry[] = [
  {
    title: "Idea 1",
    blurb: "Placeholder track — description coming soon.",
    accent: "bg-green-light",
  },
  {
    title: "Idea 2",
    blurb: "Placeholder track — description coming soon.",
    accent: "bg-recap-gold",
  },
  {
    title: "Idea 3",
    blurb: "Placeholder track — description coming soon.",
    accent: "bg-green-dark",
  },
  {
    title: "Idea 4",
    blurb: "Placeholder track — description coming soon.",
    accent: "bg-bg-light",
  },
  {
    title: "Idea 5",
    blurb: "Placeholder track — description coming soon.",
    accent: "bg-green-light",
  },
];
