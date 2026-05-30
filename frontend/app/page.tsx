import Section from "./components/Section";
import HeroSection from "./components/sections/HeroSection";
import AboutSection from "./components/sections/AboutSection";
import TracksSection from "./components/sections/TracksSection";

export default function Home() {
  return (
    <main>
      <Section id="hero">
        <HeroSection />
      </Section>
      <Section id="about">
        <AboutSection />
      </Section>
      <Section id="tracks">
        <TracksSection />
      </Section>
    </main>
  );
}
