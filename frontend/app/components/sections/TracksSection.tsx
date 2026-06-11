"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

import TrackCard from "../tracks/TrackCard";
import { TRACK_ENTRIES } from "../tracks/tracksData";

const COUNT = TRACK_ENTRIES.length;
const AUTO_ROTATE_MS = 4000;

// 3D coverflow placement keyed by a card's signed offset from the active card
// (-2..2 for 5 cards). Center faces forward; neighbors angle back into 3D.
function placement(offset: number) {
  const abs = Math.abs(offset);
  if (abs > 2) {
    // Fully behind the active card — hidden.
    return { x: 0, rotateY: 0, scale: 0.6, z: 0, opacity: 0 };
  }
  const sign = Math.sign(offset);
  const x = offset * 55; // % of card width
  const rotateY = -sign * (abs === 1 ? 35 : 45);
  const scale = abs === 0 ? 1 : abs === 1 ? 0.85 : 0.7;
  const z = 30 - abs * 10;
  const opacity = abs === 0 ? 1 : abs === 1 ? 0.9 : 0.55;
  return { x, rotateY, scale, z, opacity };
}

// Shortest signed distance from active on the 5-card ring → -2..2.
function relativeOffset(index: number, active: number) {
  let rel = (index - active + COUNT) % COUNT;
  if (rel > Math.floor(COUNT / 2)) rel -= COUNT;
  return rel;
}

export default function TracksSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  const goTo = useCallback((index: number) => {
    setActive(((index % COUNT) + COUNT) % COUNT);
  }, []);
  const next = useCallback(() => setActive((a) => (a + 1) % COUNT), []);
  const prev = useCallback(() => setActive((a) => (a - 1 + COUNT) % COUNT), []);

  // Respect prefers-reduced-motion: disable auto-rotation entirely.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      reducedMotion.current = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Auto-rotate, paused on hover/focus or when reduced motion is requested.
  useEffect(() => {
    if (paused || reducedMotion.current) return;
    const id = window.setInterval(next, AUTO_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [paused, next]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-20 sm:px-8">
      <h2 className="mb-12 text-center font-display text-[clamp(2.5rem,7vw,4rem)] font-normal leading-none tracking-wide text-white/95 text-shadow-hero-title">
        Tracks
      </h2>

      {/* Coverflow stage */}
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Hackathon tracks"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="relative mx-auto h-[clamp(20rem,55vh,26rem)] w-full [perspective:1200px] focus:outline-none"
      >
        <div className="absolute inset-0 [transform-style:preserve-3d]">
          {TRACK_ENTRIES.map((entry, i) => {
            const offset = relativeOffset(i, active);
            const { x, rotateY, scale, z, opacity } = placement(offset);
            const isActive = offset === 0;
            const isHidden = Math.abs(offset) > 2;
            return (
              <button
                key={entry.title}
                type="button"
                aria-label={`${entry.title}${isActive ? " (current)" : ""}`}
                aria-current={isActive}
                aria-hidden={isHidden}
                tabIndex={isActive || isHidden ? -1 : 0}
                onClick={() => !isActive && goTo(i)}
                style={{
                  transform: `translate(-50%, -50%) translateX(${x}%) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex: z,
                  opacity,
                  pointerEvents: isActive || isHidden ? "none" : "auto",
                }}
                className="absolute left-1/2 top-1/2 h-full w-[clamp(14rem,60vw,18rem)] cursor-pointer rounded-3xl transition-[transform,opacity] duration-500 ease-out will-change-transform [transform-style:preserve-3d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80 motion-reduce:transition-none"
              >
                <TrackCard entry={entry} index={i} isActive={isActive} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-10 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous track"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
        >
          <FaChevronLeft aria-hidden="true" className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3">
          {TRACK_ENTRIES.map((entry, i) => (
            <button
              key={entry.title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${entry.title}`}
              aria-current={i === active}
              className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 ${
                i === active
                  ? "w-7 bg-white/90"
                  : "w-2.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next track"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
        >
          <FaChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
