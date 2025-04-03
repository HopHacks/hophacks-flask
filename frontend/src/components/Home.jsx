import React from 'react';
import Cover from './home/Cover';
import Footer from './Footer';
import SpotlightButtons from './home/SpotlightButtons';
// import AboutSection from './home/About';
// import PrizesSection from './home/Prizes';
// import FAQSection from './home/Faq';

export default function Home() {
  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
      <div id="cover" className="snap-start">
        <Cover />
      </div>
      <div id="spotlight-buttons" className="snap-start">
        <SpotlightButtons />
      </div>
      <div id="footer" className="snap-start">
        <Footer />
      </div>

      {/* <div id="about" className="snap-start">
        <AboutSection />
      </div>
      <div id="prizes" className="snap-start">
        <PrizesSection />
      </div>
      <div id="tracks" className="snap-start">
        <TracksSection />
      </div>
      <div id="faq" className="snap-start">
        <FAQSection />
      </div>
      */}
    </div>
  );
}
