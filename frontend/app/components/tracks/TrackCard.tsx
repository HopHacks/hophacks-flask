import Image from "next/image";

import { TrackEntry } from "./tracksData";

interface TrackCardProps {
  entry: TrackEntry;
  index: number;
  isActive: boolean;
}

// Floating island artwork (public/tracks/track-island.webp, composed from the
// design export trackIsland.svg) with the track name hovering above it.
//
// Layering contract: the engine owns the button's transform/opacity/zIndex and
// its depth-blur filter; the bob wrapper owns its own transform via the
// island-float keyframe. The negative animation delay desyncs each island's
// bob from its neighbors.
export default function TrackCard({ entry, index, isActive }: TrackCardProps) {
  const phase = { animationDelay: `${index * -1.2}s` };

  return (
    <>
      {/* Bob wrapper — CSS keyframe owns this transform */}
      <div
        className="animate-island-float motion-reduce:animate-none"
        style={phase}
      >
        {/* Track name — hovers over the island and bobs with it; the engine's
            scale on the button keeps the front label the most prominent */}
        <span className="mb-2 block text-center font-display text-[clamp(2.5rem,7vw,4rem)] leading-none tracking-wide text-white/95 text-shadow-hero-title">
          {entry.title}
        </span>

        {/* Island — the active island trades its ambient shadow for a sky glow */}
        <div
          className={`relative transition-[filter] duration-500 ${
            isActive
              ? "drop-shadow-[0_12px_40px_rgba(127,178,231,0.55)]"
              : "drop-shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
          }`}
        >
          <Image
            src="/tracks/track-island.webp"
            alt=""
            width={900}
            height={418}
            sizes="(min-width: 640px) 11rem, 20vw"
            className="h-auto w-full"
          />
        </div>
      </div>
    </>
  );
}
