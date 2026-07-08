import Cover from './home/Cover';
import RegisterSection from './home/Register';
import Footer from './Footer';
import AboutSection from './home/About';
import SponsorsSection from './home/Sponsors';
import HomeSection from './home/HomeSection';
import Stats from './flashback/HackathonStats2024';
import SectionParagraph from './ui/SectionParagraph';
import { ArrowRightAlt } from '@material-ui/icons';
// import PrizesSection from './home/Prizes';
import FaqAccordion from './home/FaqAccordian';
import Schedule from './home/Schedule';
import Tracks from './home/Tracks';

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
        {/* Position the sparkles as an absolute overlay */}
        {/* <Sparkles /> */}
        <div className="flex flex-col space-y-24">
          <HomeSection id={'cover-section'}>
            <Cover />
          </HomeSection>
          <HomeSection id={'register-section'} darkerBg={true} bgOpacity={0.3}>
            <RegisterSection />
          </HomeSection>
          <HomeSection id={'about-section'} darkerBg={true}>
            <AboutSection />
          </HomeSection>
          <HomeSection id={'sponsors-section'} darkerBg={true}>
            <SponsorsSection />
          </HomeSection>
          <HomeSection id={'stats-section'} darkerBg={true}>
            <div className="flex flex-col min-h-dvh justify-center items-center w-full">
              <Stats modifiedTitle={'2024 Stats'} />
              <a href={'/Recap'} className="mt-12">
                <SectionParagraph className="hover:text-blue-600 transition-colors duration-300 underline">
                  {'See More Stats on Our Recap Page'}
                  <ArrowRightAlt />
                </SectionParagraph>
              </a>
            </div>
          </HomeSection>
          <HomeSection id={'schedule-section'} darkerBg={true}>
            <Schedule />
          </HomeSection>
          <HomeSection id={'tracks-section'} darkerBg={true}>
            <Tracks />
          </HomeSection>
          <HomeSection id={'faq-section'}>
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
