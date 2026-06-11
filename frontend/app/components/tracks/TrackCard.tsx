import { TrackEntry } from "./tracksData";

interface TrackCardProps {
  entry: TrackEntry;
  index: number;
  isActive: boolean;
}

// Placeholder floating island: grass cap + glass face + rock wedge + detached
// ground shadow. Rendered inside the orbit engine's <button> wrapper.
//
// Layering contract: the engine owns the button's transform/opacity/zIndex;
// the bob wrapper owns its own transform via the island-float keyframe; the
// ground shadow is the bob wrapper's SIBLING so it never bobs — the island
// rising while its shadow shrinks (island-shadow counterphase) is what sells
// "floating". Same 6s duration + same negative delay phase-locks each island
// to its own shadow while desyncing it from its neighbors.
export default function TrackCard({ entry, index, isActive }: TrackCardProps) {
  const phase = { animationDelay: `${index * -1.2}s` };

  return (
    <>
      {/* Bob wrapper — CSS keyframe owns this transform */}
      <div
        className="animate-island-float motion-reduce:animate-none"
        style={phase}
      >
        {/* Glass face (billboarded plateau) */}
        <div
          className={`relative flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border bg-white/15 transition-[border-color,box-shadow] duration-500 ${
            isActive
              ? "border-white/50 shadow-[0_12px_40px_rgba(127,178,231,0.45),inset_0_1px_0_rgba(255,255,255,0.35)]"
              : "border-white/30 shadow-[0_8px_24px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.25)]"
          }`}
        >
          {/* Turf lip — accent grass seen edge-on, drippy bottom edge */}
          <div
            aria-hidden="true"
            className={`absolute inset-x-0 top-0 h-2.5 ${entry.accent} opacity-90 [clip-path:polygon(0_0,100%_0,100%_62%,88%_100%,74%_70%,58%_100%,42%_72%,26%_100%,12%_70%,0_100%)]`}
          />
          <span className="font-sans text-[0.6rem] uppercase tracking-[0.18em] text-white/90 sm:text-[0.65rem]">
            Track {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-display text-[clamp(1.35rem,3.4vw,2rem)] leading-none tracking-wide text-white/95 [text-shadow:0_1px_3px_rgb(15_46_82/0.5)]">
            {entry.title}
          </span>
        </div>

        {/* Rock underside wedge — darkened accent strata */}
        <div
          aria-hidden="true"
          className={`relative mx-auto -mt-px h-[clamp(1.4rem,4vw,2.2rem)] w-[72%] ${entry.accent} [clip-path:polygon(8%_0,92%_0,70%_70%,50%_100%,30%_70%)]`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/30 to-black/50" />
        </div>
      </div>

      {/* Ground shadow — sibling of the bob wrapper: orbits, never bobs */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[calc(100%+0.875rem)] h-2.5 w-[60%] -translate-x-1/2 rounded-full bg-black/30 blur-sm animate-island-shadow motion-reduce:animate-none"
        style={phase}
      />
    </>
  );
}
