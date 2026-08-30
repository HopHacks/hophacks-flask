"use client";

import { useEffect, useRef, useState } from "react";

const SPONSOR_EMAIL = "hophacks.outreach@gmail.com";

// Darker gold than recap-gold so link text stays readable (WCAG AA)
// on the bubble's white background.
const BUBBLE_LINK_CLS = "font-semibold text-amber-700 underline";

const PILL_CLS =
  "group flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-2xl border border-white/40 bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/25 hover:shadow-[0_4px_20px_rgba(255,255,255,0.25)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";

function Caret({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`text-xs text-white/80 transition-transform duration-200 group-hover:text-white ${
        open ? "rotate-180" : ""
      }`}
    >
      ▾
    </span>
  );
}

function Bubble({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div
      id={id}
      className="absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-2xl bg-white/95 px-4 py-3 text-sm font-normal text-slate-800 shadow-lg motion-safe:animate-rise"
    >
      {children}
    </div>
  );
}

export default function GetInvolved() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close the open bubble on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative z-50 mt-4 flex w-full justify-center">
      <button
        type="button"
        className={PILL_CLS}
        aria-expanded={open}
        aria-controls="get-involved-sponsor-bubble"
        onClick={() => setOpen((prev) => !prev)}
      >
        Interested in partnering?
        <Caret open={open} />
      </button>

      {open && (
        <Bubble id="get-involved-sponsor-bubble">
          We&apos;d love to hear from you! Reach out to us at{" "}
          <a href={`mailto:${SPONSOR_EMAIL}`} className={BUBBLE_LINK_CLS}>
            {SPONSOR_EMAIL}
          </a>
          .
        </Bubble>
      )}
    </div>
  );
}
