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
    <main
      className="relative w-full bg-no-repeat bg-top bg-cover"
      style={{
        backgroundImage:
          "url('https://hophacks-website.s3.us-east-1.amazonaws.com/whole-bg-splitted/whole-bg-2.png')",
      }}
    >
      <div className="snap-y snap-mandatory">
        <HomeSection><Cover /></HomeSection>
        <HomeSection><RegisterSection /></HomeSection>
        <HomeSection><h1>Section 3</h1></HomeSection>
        <HomeSection><h1>Section 4</h1></HomeSection>
        <HomeSection><h1>Section 5</h1></HomeSection>
      </div>
    </main>


  );
}
