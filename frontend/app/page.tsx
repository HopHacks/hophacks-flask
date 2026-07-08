import Section from "./components/Section";
import HeroSection from "./components/sections/HeroSection";
import AboutSection from "./components/sections/AboutSection";
import TracksSection from "./components/sections/TracksSection";
import ScheduleSection from "./components/sections/ScheduleSection";
import FaqSection from "./components/sections/FaqSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Section id="hero" borderless className="overflow-hidden p-0">
        <HeroSection />
      </Section>
      <Section id="about">
        <AboutSection />
      </Section>
      <Section id="tracks">
        <TracksSection />
      </Section>
      <Section id="schedule">
        <ScheduleSection />
      </Section>
      <Section id="faq">
        <FaqSection />
      </Section>
      <Footer />
    </main>
  );
}
