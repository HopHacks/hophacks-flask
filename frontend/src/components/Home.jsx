import React from 'react';
import Cover from './home/Cover';
import RegisterSection from './home/Register';
import Footer from './Footer';
import AboutSection from './home/About';
// import PrizesSection from './home/Prizes';
// import FAQSection from './home/Faq';

export default function Home() {
  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
      <div id="cover" className="snap-start">
        <Cover />
      </div>
      <div id="register-section" className="snap-start">
        <RegisterSection />
      </div>
      {/* <div id="about" className="snap-start">
        <AboutSection />
      </div> */}
      {/*<div id="prizes" className="snap-start">
        <PrizesSection />
      </div>
      <div id="tracks" className="snap-start">
        <TracksSection />
      </div>
      <div id="faq" className="snap-start">
        <FAQSection />
      </div>*/}
      <div className="snap-start">
        <Footer />
      </div>
    </div>
  );
}
