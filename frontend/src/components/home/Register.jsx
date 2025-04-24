import GlowText from '../ui/GlowText';

export default function Register() {
  return (
    <section>
      <div className="bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/whole-bg-splitted/image1x2.png')] bg-no-repeat bg-center bg-cover h-screen flex justify-center items-center">
        <div className="flex flex-col jusitfy-center items-center">
          <h2 className="text-6xl mb-20 font-bold text-white" style={{ fontVariant: 'small-caps' }}>
            Register
          </h2>

          <div className="flex space-between">
            {[
              {
                img: 'sponsor-bird.png',
                label: 'Sponsor',
                link: 'mailto:hophacks.sponsors@gmail.com'
              },
              {
                img: 'participate-bird.png',
                label: 'Hack',
                link: 'https://discord.gg/8V8wmCWUhH'
              },
              {
                img: 'volunteer-bird.png',
                label: 'Volunteer',
                link: 'https://docs.google.com/forms/d/e/1FAIpQLSeTrXR8Bvlx2-1nAf9ocx6AHPBxKaFTrq2GJZI1bBEwwc0dwQ/viewform'
              }
            ].map(({ img, label, link }) => (
              <div key={label} className="flex flex-col items-center">
                <img
                  src={`https://hophacks-website.s3.us-east-1.amazonaws.com/home/${img}`}
                  alt={`${label} Bird`}
                  className="min-h-16 h-[70%] w-auto mb-4"
                />
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
      </div>
    </section>
  );
}
