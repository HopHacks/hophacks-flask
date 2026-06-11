import FaqItem from "../faq/FaqItem";
import { FAQ_ENTRIES } from "../faq/faqData";

export default function FaqSection() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-20 sm:px-8">
      <h2 className="mb-10 text-center font-display text-[clamp(2.5rem,7vw,4rem)] font-normal leading-none tracking-wide text-white/95 text-shadow-hero-title">
        FAQ
      </h2>
      <div className="flex flex-col gap-3">
        {FAQ_ENTRIES.map((entry, index) => (
          <FaqItem key={entry.question} entry={entry} index={index} />
        ))}
      </div>
    </div>
  );
}
