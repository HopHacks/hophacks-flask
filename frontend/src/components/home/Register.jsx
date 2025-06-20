import SectionHeader from '../ui/SectionHeader';
import GlowButton from '../ui/GlowButton';

export default function Register() {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <SectionHeader>Register</SectionHeader>

      <div className="flex gap-12 flex-wrap justify-center">
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
                className="h-[100px] sm:h-[100px] md:h-[200px] lg:h-[350px] w-auto mb-1 transform transition-transform duration-300 hover:scale-110 cursor-pointer hover:drop-shadow-[0_0_10px_white]"
              />
            </a>
            <GlowButton onClick={() => window.open(link ?? '#', '_blank')} className="py-1.5">
              {label}
            </GlowButton>
          </div>
        ))}
      </div>
    </div>
  );
}
