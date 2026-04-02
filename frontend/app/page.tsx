import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Tracks from "./components/Tracks";
import Sponsors from "./components/Sponsors";
import FAQ from "./components/FAQ";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans scroll-smooth">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Tracks />
        <Sponsors />
        <FAQ />
      </main>
    </div>
  );
}
