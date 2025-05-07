import React from 'react';
import Cover from './home/Cover';
import RegisterSection from './home/Register';
import Footer from './Footer';
import AboutSection from './home/About';
import HomeSection from './home/HomeSection';
// import PrizesSection from './home/Prizes';
// import FAQSection from './home/Faq';

export default function Home() {
  return (
    <div>
      <main
        className="relative w-full bg-no-repeat bg-top bg-cover"
        style={{
          backgroundImage:
            "url('https://hophacks-website.s3.us-east-1.amazonaws.com/whole-bg-splitted/whole-bg-2.png')",
        }}
      >
        <div className="bg-[linear-gradient(to_right,_#1C2151_8%,_rgba(0,29,76,0)_100%)] h-12"></div>

        <div className="flex flex-col space-y-24"> {/* Adds vertical gap between sections */}
          <HomeSection id={"cover-section"}><Cover /></HomeSection>
          <HomeSection id={"register-section"}><RegisterSection /></HomeSection>
          <HomeSection><AboutSection /></HomeSection>
          <HomeSection><h1>Section 4</h1></HomeSection>
          <HomeSection><h1>Section 5</h1></HomeSection>
        </div>
      </main>

    </div>
  );
}
