import SectionHeader from '../ui/SectionHeader';
import GlowButton from '../ui/GlowButton';
import SectionParagraph from '../ui/SectionParagraph';

export default function Register() {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <SectionHeader>Register</SectionHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 w-full max-w-5xl">
        {[
          {
            img: 'sponsor-bird.png',
            label: 'Sponsor',
            link: 'mailto:hophacks.sponsors@gmail.com'
          },
          {
            img: 'hack-bird.png',
            label: 'Hack',
            link: '/register/login'
          },
          {
            img: 'volunteer-bird.png',
            label: 'Volunteer',
            link: 'https://docs.google.com/forms/d/e/1FAIpQLSeTrXR8Bvlx2-1nAf9ocx6AHPBxKaFTrq2GJZI1bBEwwc0dwQ/viewform'
          }
        ].map(({ img, label, link }) => (
          <div key={label} className="flex flex-col items-center">
            <a href={link} target="_blank" rel="noopener noreferrer">
              <img
                src={`https://hophacks-website.s3.us-east-1.amazonaws.com/home/${img}`}
                alt={`${label} Bird`}
                className="h-[100px] sm:h-[100px] md:h-[200px] lg:h-[350px] w-full object-cover object-center mb-1 transform transition-transform duration-300 hover:scale-110 cursor-pointer hover:drop-shadow-[0_0_10px_white]"
              />
            </a>
            <GlowButton onClick={() => window.open(link ?? '#', '_blank')} className="py-1.5">
              {label}
            </GlowButton>
          </div>
        ))}
      </div>
      <SectionParagraph className="mt-10 text-center text-sm">
        Sign Up for Pre / Post Hackathon Events!
      </SectionParagraph>
      <GlowButton onClick={() => window.open(`https://forms.gle/55JXivSoY17R8xsw9`)} className="inline-flex items-center justify-center px-4 py-2 text-base max-w-[3000px] w-fit lg:whitespace-nowrap">
          HopHacks X PAVA: Hacking 101 & From Hack to Startup
      </GlowButton>
    </div>
  );
}
