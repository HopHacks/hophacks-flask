import GlowText from '../ui/GlowText';

export default function Register() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-6xl mb-20 font-bold text-white" style={{ fontVariant: 'small-caps' }}>
        Register
      </h2>

      <div className="flex gap-12 flex-wrap justify-center">
        {[
          {
            img: 'sponsor-bird.png',
            label: 'Sponsor',
            link: 'mailto:hophacks.sponsors@gmail.com',
          },
          {
            img: 'hack-bird.png',
            label: 'Hack',
            link: 'https://discord.gg/8V8wmCWUhH',
          },
          {
            img: 'volunteer-bird.png',
            label: 'Volunteer',
            link: 'https://docs.google.com/forms/d/e/1FAIpQLSeTrXR8Bvlx2-1nAf9ocx6AHPBxKaFTrq2GJZI1bBEwwc0dwQ/viewform',
          },
        ].map(({ img, label, link }) => (
          <div key={label} className="flex flex-col items-center">
            <a href={link} target="_blank" rel="noopener noreferrer">
              <img
                src={`https://hophacks-website.s3.us-east-1.amazonaws.com/home/${img}`}
                alt={`${label} Bird`}
                className="h-[300px] w-auto mb-4 transform transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
            </a>
            <a
              href={link ?? '#'}
              className="text-white text-3xl font-bold transition-colors duration-300 hover:text-blue-600"
              style={{ fontVariant: 'small-caps' }}
            >
              {label}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
