import { TrackEntry } from "./tracksData";

interface TrackCardProps {
  entry: TrackEntry;
  index: number;
  isActive: boolean;
}

// Presentational track card. Matches the existing glassy FAQ-card language
// (bg-white/10, white/25 border, rounded) against the sky-blue background.
export default function TrackCard({ entry, index, isActive }: TrackCardProps) {
  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-3xl border bg-white/10 backdrop-blur-sm transition-[box-shadow,border-color] duration-500 ${
        isActive
          ? "border-white/50 shadow-[0_12px_48px_rgba(127,178,231,0.45)]"
          : "border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
      }`}
    >
      {/* Accent band with track number */}
      <div
        className={`flex items-center justify-between px-6 py-4 ${entry.accent}`}
      >
        <span className="font-display text-2xl leading-none text-white/95">
          Track
        </span>
        <span className="font-display text-3xl leading-none text-white/95">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-center gap-4 px-6 py-8 text-center">
        <h3 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-normal leading-none tracking-wide text-white/95 text-shadow-hero-title">
          {entry.title}
        </h3>
        <p className="text-sm leading-relaxed text-text-primary/85 sm:text-base">
          {entry.blurb}
        </p>
      </div>
    </div>
  );
}
