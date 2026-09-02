import SponsorLogo from "../sponsors/SponsorLogo";
import { SPONSORS } from "../sponsors/sponsorsData";

export default function SponsorsSection() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-20 sm:px-8">
      <h2 className="mb-10 text-center font-display text-[clamp(2.5rem,7vw,4rem)] font-normal leading-none tracking-wide text-white/95 text-shadow-hero-title">
        Sponsors
      </h2>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
        {SPONSORS.map((sponsor) => (
          <SponsorLogo key={sponsor.name} {...sponsor} />
        ))}
      </div>
      <p className="mt-10 text-center text-sm text-white/90">
        Interested in sponsoring HopHacks?{" "}
        <a
          className="underline transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
          href="mailto:hophacks.sponsors@gmail.com"
        >
          hophacks.sponsors@gmail.com
        </a>
      </p>
    </div>
  );
}
