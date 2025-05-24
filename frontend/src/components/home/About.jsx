import SectionHeader from '../../components/ui/SectionHeader';

export default function About() {
  const paragraphs = [
    'HopHacks is a 36-hour annual hackathon hosted at Johns Hopkins University that brings together innovative minds from across the country.',
    'Designed to foster creativity and collaboration, the event invites engineers, designers, and entrepreneurs to team up and turn bold ideas into functional prototypes.',
    'Participants have access to mentorship, workshops, and technical resources as they work around the clock to develop cutting-edge software and hardware solutions.',
    'With prizes, networking opportunities, and industry sponsorships, HopHacks not only challenges students to push the boundaries of technology, but also helps them gain real-world experience and connect with leaders in tech and business.'
  ];

  return (
    <div className="relative min-h-dvh flex items-center w-full">
      {/* Fading gradient (top to bottom: 0,0.7,0.7,0)
          for easier reading
      */}
      <div className="absolute inset-0 z-0"></div>

      <div
        className="
          relative z-10
          w-full 
          px-12 sm:px-12 md:px-16 
          lg:ml-[20%] lg:w-[80%] 
          lg:mr-12
          flex flex-col items-start sm:items-start md:items-end
        "
      >
        <SectionHeader className="text-right">About</SectionHeader>
        <div className="text-2xl w-full">
          {paragraphs.map((text, index) => (
            <p
              key={index}
              style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
              className={`text-white text-left sm:text-left md:text-right pb-5 ${index > 1 ? 'ml-0 lg:ml-30' : ''}`}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
