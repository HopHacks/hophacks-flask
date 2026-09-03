import { FaCalendarDays, FaLocationDot } from "react-icons/fa6";

export default function HeroEventInfo() {
  return (
    <div className="flex flex-col items-center gap-1 text-center sm:gap-1.5">
      <p className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-recap-gold sm:gap-2 sm:text-base">
        <FaCalendarDays
          className="h-3.5 w-3.5 shrink-0 opacity-90 sm:h-4 sm:w-4"
          aria-hidden
        />
        <span>September 18–20, 2026</span>
      </p>
      <p className="flex items-center gap-1.5 text-xs font-normal text-white/90 sm:gap-2 sm:text-sm">
        <FaLocationDot
          className="h-3.5 w-3.5 shrink-0 text-white/75 sm:h-4 sm:w-4"
          aria-hidden
        />
        <span>Johns Hopkins University · Baltimore, MD</span>
      </p>
    </div>
  );
}
