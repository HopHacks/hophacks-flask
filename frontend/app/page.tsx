import Section from "./components/Section";
import HeroSection from "./components/sections/HeroSection";
import AboutSection from "./components/sections/AboutSection";
import TracksSection from "./components/sections/TracksSection";
import ScheduleSection from "./components/sections/ScheduleSection";
import SponsorsSection from "./components/sections/SponsorsSection";
import { SPONSORS } from "./components/sponsors/sponsorsData";
import FaqSection from "./components/sections/FaqSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="h-dvh snap-y snap-mandatory overflow-y-auto overscroll-y-contain scroll-smooth motion-reduce:snap-none">
      <Section id="hero" borderless className="overflow-hidden p-0">
        <HeroSection />
      </Section>
      <Section borderless id="about">
        <AboutSection />
      </Section>
      <Section borderless id="tracks">
        <TracksSection />
      </Section>
      <Section borderless id="schedule">
        <ScheduleSection />
      </Section>
      {/* Collapses until SPONSORS has entries, rather than showing an empty
          full-height section. */}
      {SPONSORS.length > 0 && (
        <Section borderless id="sponsors">
          <SponsorsSection />
        </Section>
      )}
      <Section borderless id="faq">
        <FaqSection />
      </Section>
      <Footer />
    </main>
  );
}
