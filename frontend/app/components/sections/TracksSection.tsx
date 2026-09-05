"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import TrackCard from "../tracks/TrackCard";
import { TRACK_ENTRIES } from "../tracks/tracksData";

const COUNT = TRACK_ENTRIES.length;
const TWO_PI = Math.PI * 2;
const STEP = TWO_PI / COUNT;
// Island i fronts when rotation ≡ i·STEP, so idle spin presents islands in
// dot order (0, 1, 2, ...).
const THETA = TRACK_ENTRIES.map((_, i) => -i * STEP);

const SPEED = 0.25; // rad/s idle — full lap ≈25s, a new island fronts every ~5s
const EASE_K = 4.5; // s⁻¹ exponential approach toward a navigation target
const RAMP_K = 6; // s⁻¹ idle-speed ramp — organic spin-down/up around pauses
const SNAP_EPS = 0.003; // rad — imperceptible snap that ends an ease
const MAX_DT = 0.1; // s — tab-restore clamp so backgrounding never teleports
const DWELL_MS = 3000; // hold at front after user nav (touch has no hover-pause)

// Ellipse radii as CSS lengths resolved against the [container-type:size]
// stage: a = min(33cqw, 380px), b = max(0.38·a, 48px). Container-query units
// keep the geometry SSR-deterministic and resize-reactive with no measuring.
// With the item width capped at 44cqw (side islands scale to 0.775), the side
// edge lands at ≤ 33cqw + 0.775·22cqw ≈ 50cqw — flush with the stage, so the
// ring never spills past the viewport and causes horizontal page scroll.
const RADIUS_X = "min(33cqw,380px)";
const RADIUS_Y = "max(min(12.54cqw,144.4px),48px)";

// Pure turntable placement: front (cos = 1) sits lower, larger, fully opaque;
// rear sits higher, smaller, faded. Billboarded — no rotateY.
function placement(index: number, rotation: number) {
  const ang = THETA[index] + rotation;
  const sin = Math.sin(ang);
  const cos = Math.cos(ang);
  const t = (cos + 1) / 2; // 1 = front, 0 = back
  // Depth-of-field: only the rear arc blurs (t < 0.3) so the side islands stay
  // crisp — ramps continuously to 3px at the very back to avoid a pop.
  const blur = Math.max(0, (0.3 - t) / 0.3) * 3;
  return {
    transform: `translate(-50%, -50%) translate(calc(${RADIUS_X} * ${sin.toFixed(4)}), calc(${RADIUS_Y} * ${cos.toFixed(4)})) scale(${(0.55 + 0.45 * t).toFixed(4)})`,
    opacity: (0.45 + 0.55 * t).toFixed(3),
    zIndex: 10 + Math.round(t * 100),
    filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none",
  };
}

// Stable-identity styles: used for SSR markup and as the permanent style prop,
// so React re-renders never rewrite el.style — the engine (or the static-mode
// effect) stays the only writer of transform/opacity/zIndex after mount.
const INITIAL_STYLES: CSSProperties[] = TRACK_ENTRIES.map((_, i) =>
  placement(i, 0),
);

export default function TracksSection() {
  const [frontIndex, setFrontIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  const stageRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // rotation is unbounded forever — only deltas are normalized (shortest arc).
  const rotationRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const rampRef = useRef(1);
  const hoverRef = useRef(false);
  const focusRef = useRef(false);
  const resumeAtRef = useRef(0);
  const frontIndexMirrorRef = useRef(0);

  const applyLayout = useCallback((rotation: number) => {
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const p = placement(i, rotation);
      el.style.transform = p.transform;
      el.style.opacity = p.opacity;
      el.style.zIndex = String(p.zIndex);
      el.style.filter = p.filter;
    });
  }, []);

  const announce = useCallback((i: number) => {
    setLiveMessage(`${TRACK_ENTRIES[i].title}, track ${i + 1} of ${COUNT}`);
  }, []);

  const goToIsland = useCallback(
    (i: number) => {
      // Clicking the island that is already front is a no-op.
      if (i === frontIndexMirrorRef.current && targetRef.current === null) {
        return;
      }
      if (reducedMotion) {
        frontIndexMirrorRef.current = i;
        setFrontIndex(i);
        announce(i);
        return;
      }
      const desired = i * STEP;
      // Shortest signed arc in (-π, π], applied to the unbounded rotation.
      let delta =
        (((desired - rotationRef.current) % TWO_PI) + TWO_PI) % TWO_PI;
      if (delta > Math.PI) delta -= TWO_PI;
      targetRef.current = rotationRef.current + delta;
      resumeAtRef.current = performance.now() + DWELL_MS;
      announce(i);
    },
    [reducedMotion, announce],
  );

  const stepBy = useCallback(
    (dir: 1 | -1) => {
      if (reducedMotion) {
        goToIsland(
          (((frontIndexMirrorRef.current + dir) % COUNT) + COUNT) % COUNT,
        );
        return;
      }
      // Snap-and-step from the pending target so rapid presses accumulate.
      const base = targetRef.current ?? rotationRef.current;
      const target = Math.round(base / STEP) * STEP + dir * STEP;
      targetRef.current = target;
      resumeAtRef.current = performance.now() + DWELL_MS;
      announce(((Math.round(target / STEP) % COUNT) + COUNT) % COUNT);
    },
    [reducedMotion, goToIsland, announce],
  );

  // prefers-reduced-motion as STATE so a mid-session change re-gates the engine.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Static mode: position the oval imperatively from frontIndex; nav is an
  // instant snap (an animated arc sweep is the vestibular trigger).
  useEffect(() => {
    if (!reducedMotion) return;
    applyLayout(frontIndex * STEP);
  }, [reducedMotion, frontIndex, applyLayout]);

  // Orbit engine.
  useEffect(() => {
    if (reducedMotion) return;
    const stage = stageRef.current;
    if (!stage) return;

    // Resume from the visible pose (also correct on first mount: 0 · STEP).
    rotationRef.current = frontIndexMirrorRef.current * STEP;
    targetRef.current = null;

    let rafId: number | null = null;
    let lastTs: number | null = null;
    let lastState = "";

    const tick = (now: number) => {
      const dt = lastTs === null ? 0 : Math.min((now - lastTs) / 1000, MAX_DT);
      lastTs = now;

      const held =
        hoverRef.current || focusRef.current || now < resumeAtRef.current;
      rampRef.current +=
        ((held ? 0 : 1) - rampRef.current) * (1 - Math.exp(-RAMP_K * dt));
      // The exponential never reaches zero — clamp so a hold truly freezes
      // (WCAG 2.2.2: paused means stopped, not imperceptibly creeping).
      if (held && rampRef.current < 0.001) rampRef.current = 0;

      let state: string;
      if (targetRef.current !== null) {
        // The target advances at idle speed, so arrival is velocity-matched
        // and the resume has zero jerk by construction.
        targetRef.current += SPEED * rampRef.current * dt;
        const diff = targetRef.current - rotationRef.current;
        rotationRef.current += diff * (1 - Math.exp(-EASE_K * dt));
        if (Math.abs(diff) < SNAP_EPS) {
          rotationRef.current = targetRef.current;
          targetRef.current = null;
        }
        state = "easing";
      } else {
        rotationRef.current += SPEED * rampRef.current * dt;
        state = held ? "held" : "idle";
      }

      applyLayout(rotationRef.current);

      if (state !== lastState) {
        lastState = state;
        stage.dataset.state = state;
      }

      const fi =
        ((Math.round(rotationRef.current / STEP) % COUNT) + COUNT) % COUNT;
      if (fi !== frontIndexMirrorRef.current) {
        frontIndexMirrorRef.current = fi;
        setFrontIndex(fi);
      }

      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (rafId === null) {
        lastTs = null; // dt restarts clean — no teleport after re-entry
        rafId = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    // No 60fps loop while the section is offscreen.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    io.observe(stage);

    return () => {
      stop();
      io.disconnect();
    };
  }, [reducedMotion, applyLayout]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        stepBy(-1);
        break;
      case "ArrowRight":
        e.preventDefault();
        stepBy(1);
        break;
      case "Home":
        e.preventDefault();
        goToIsland(0);
        break;
      case "End":
        e.preventDefault();
        goToIsland(COUNT - 1);
        break;
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-20 sm:px-8">
      {/* Heading flanked by rock clusters cropped from the hero's floating-rocks layer */}
      <div className="mb-4 flex items-center justify-center gap-4 sm:mb-8 sm:gap-8">
        <Image
          src="/tracks/rocks-left.webp"
          alt=""
          width={270}
          height={270}
          className="h-auto w-[clamp(3.5rem,9vw,5.5rem)] min-w-0 animate-island-float motion-reduce:animate-none"
        />
        <h2 className="text-center font-display text-[clamp(3rem,9vw,5.5rem)] font-normal leading-none tracking-wide text-white/95 text-shadow-hero-title">
          Tracks
        </h2>
        <Image
          src="/tracks/rocks-right.webp"
          alt=""
          width={265}
          height={358}
          className="h-auto w-[clamp(3.5rem,9vw,5.5rem)] min-w-0 animate-island-float motion-reduce:animate-none"
          style={{ animationDelay: "-2.4s" }}
        />
      </div>

      {/* Narrow screens: the orbit has no room, so the islands stack vertically
          instead (pure CSS toggle — the hidden stage never intersects, so the
          orbit engine's rAF loop stays off while stacked). */}
      <div className="flex flex-col items-center gap-10 sm:hidden">
        {TRACK_ENTRIES.map((entry, i) => (
          <div key={entry.title} className="w-[min(18rem,80vw)]">
            <TrackCard entry={entry} index={i} isActive={false} />
          </div>
        ))}
      </div>

      {/* Hover/focus anywhere in stage + controls holds the spin */}
      <div
        className="hidden sm:block"
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") hoverRef.current = true;
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") hoverRef.current = false;
        }}
        onFocus={() => {
          focusRef.current = true;
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            focusRef.current = false;
          }
        }}
      >
        <p id="tracks-hint" className="sr-only">
          Use the left and right arrow keys to rotate the tracks. Press Home or
          End to jump to the first or last track.
        </p>

        {/* Turntable stage */}
        <div
          ref={stageRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Hackathon tracks"
          aria-describedby="tracks-hint"
          tabIndex={0}
          onKeyDown={onKeyDown}
          data-testid="tracks-stage"
          data-front-index={frontIndex}
          data-state={reducedMotion ? "static" : undefined}
          className="relative isolate mx-auto h-[clamp(24rem,60vh,32rem)] w-full rounded-3xl [container-type:size] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
        >
          {/* Air pocket — the one piece of atmosphere behind the orbit */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[44%] -z-10 h-[calc(max(min(12.54cqw,144.4px),48px)*2_+_9rem)] w-[min(calc(min(33cqw,380px)*2_+_14rem),100cqw)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_255_255/0.14),rgb(255_255_255/0.05)_58%,transparent_80%)]"
          />

          {TRACK_ENTRIES.map((entry, i) => (
            <button
              key={entry.title}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              type="button"
              tabIndex={-1}
              data-track-index={i}
              aria-label={`${entry.title}, track ${i + 1} of ${COUNT}`}
              aria-current={i === frontIndex ? true : undefined}
              onClick={() => goToIsland(i)}
              style={INITIAL_STYLES[i]}
              className="absolute left-1/2 top-[44%] w-[min(clamp(16rem,48vw,28rem),44cqw)] cursor-pointer will-change-transform"
            >
              <TrackCard entry={entry} index={i} isActive={i === frontIndex} />
            </button>
          ))}
        </div>

        {/* Controls — dots only; arrow keys still step, hover/focus still holds */}
        <div className="mt-2 flex items-center justify-center gap-4 sm:mt-4">
          <div className="flex items-center gap-1">
            {TRACK_ENTRIES.map((entry, i) => (
              <button
                key={entry.title}
                type="button"
                onClick={() => goToIsland(i)}
                aria-label={`Go to ${entry.title}`}
                aria-current={i === frontIndex ? true : undefined}
                className="group flex h-6 min-w-6 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
              >
                <span
                  className={`rotate-45 rounded-[2px] transition-all duration-300 ${
                    i === frontIndex
                      ? "h-3.5 w-3.5 bg-white/90"
                      : "h-2.5 w-2.5 bg-white/40 group-hover:bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Announces user-initiated navigation only — ambient spin stays silent */}
        <p data-testid="tracks-status" role="status" className="sr-only">
          {liveMessage}
        </p>
      </div>
    </div>
  );
}
