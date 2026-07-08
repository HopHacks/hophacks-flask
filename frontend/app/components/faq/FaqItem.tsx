"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

import { FaqEntry } from "./faqData";

interface FaqItemProps {
  entry: FaqEntry;
  index: number;
}

export default function FaqItem({ entry, index }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <div className="overflow-hidden rounded-xl border border-white/25 bg-white/10 transition-colors hover:bg-white/15">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-lg font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 sm:text-xl"
        >
          <span>{entry.question}</span>
          <FaChevronDown
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-4 text-base leading-relaxed text-text-primary/90">
            {entry.answer}
          </div>
        </div>
      </div>
    </div>
  );
}
