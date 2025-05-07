import React from 'react';
import Cover from './home/Cover';
import RegisterSection from './home/Register';
import Footer from './Footer';
import AboutSection from './home/About';
import HomeSection from './home/HomeSection';
import Stats from './flashback/HackathonStats2024';
import SectionSubtext from './ui/SectionSubtext';
import SectionParagraph from './ui/SectionParagraph';
import { ArrowRightAlt } from '@material-ui/icons';
// import PrizesSection from './home/Prizes';
import FaqAccordion from './home/FaqAccordian';

export default function Home() {
  return (
    <div>
      <main
        className="relative w-full bg-no-repeat bg-top bg-cover"
        style={{
          backgroundImage:
            "url('https://hophacks-website.s3.us-east-1.amazonaws.com/whole-bg-splitted/whole-bg-2.png')"
        }}
      >
        <div className="flex flex-col space-y-24">
          <HomeSection id={'cover-section'}>
            <Cover />
          </HomeSection>
          <HomeSection id={'register-section'}>
            <RegisterSection />
          </HomeSection>
          <HomeSection>
            <AboutSection />
          </HomeSection>
          <HomeSection>
            <div className="flex flex-col min-h-dvh justify-center items-center">
              <Stats modifiedTitle={"2024 Stats"} />
              <a href={"/Recap"} className="mt-12">
                <SectionParagraph className="hover:text-blue-600 transition-colors duration-300">
                  {"See More Stats on Our Recap Page"}<ArrowRightAlt />
                </SectionParagraph>
              </a>
            </div>
            
          </HomeSection>
          <HomeSection>
            <div className="min-h-dvh">
              <FaqAccordion />
            </div>
          </HomeSection>
        </div>
      </main>
      <Footer />
    </div>
  );
}
