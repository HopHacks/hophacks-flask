"use client";

import { useState } from "react";

const JUDGING_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSet1xISEHadRU01T-TSoJzi679BcVXe4V248XyKfeu-6fLIqg/viewform";

const SPONSOR_EMAIL = "hophacks.outreach@gmail.com";

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

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-2xl bg-white/95 px-4 py-3 text-sm font-normal text-slate-800 shadow-lg motion-safe:animate-rise">
      {children}
    </div>
  );
}

export default function GetInvolved() {
  const [open, setOpen] = useState<"judge" | "sponsor" | null>(null);

  const toggle = (which: "judge" | "sponsor") =>
    setOpen((prev) => (prev === which ? null : which));

  return (
    <div className="relative z-50 mt-4 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
      <button
        type="button"
        className={`${PILL_CLS} justify-self-center sm:justify-self-end`}
        aria-expanded={open === "judge"}
        onClick={() => toggle("judge")}
      >
        Interested in judging?
        <Caret open={open === "judge"} />
      </button>

      <button
        type="button"
        className={`${PILL_CLS} justify-self-center sm:justify-self-start`}
        aria-expanded={open === "sponsor"}
        onClick={() => toggle("sponsor")}
      >
        Interested in sponsoring?
        <Caret open={open === "sponsor"} />
      </button>

      {open === "judge" && (
        <Bubble>
          Sign up to be a judge through our{" "}
          <a
            href={JUDGING_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-recap-gold underline"
          >
            judging form
          </a>
          .
        </Bubble>
      )}
      {open === "sponsor" && (
        <Bubble>
          We&apos;d love to hear from you! Reach out to us at{" "}
          <a
            href={`mailto:${SPONSOR_EMAIL}`}
            className="font-semibold text-recap-gold underline"
          >
            {SPONSOR_EMAIL}
          </a>
          .
        </Bubble>
      )}
    </div>
  );
}
