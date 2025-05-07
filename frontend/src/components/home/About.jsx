export default function About() {
  const paragraphsA = [
    "HopHacks is a 36-hour annual hackathon hosted at Johns Hopkins University that brings together innovative minds from across the country.",
    "Designed to foster creativity and collaboration, the event invites engineers, designers, and entrepreneurs to team up and turn bold ideas into functional prototypes.",
    "Participants have access to mentorship, workshops, and technical resources as they work around the clock to develop cutting-edge software and hardware solutions.", 
    "With prizes, networking opportunities, and industry sponsorships, HopHacks not only challenges students to push the boundaries of technology, but also helps them gain real - world experience and connect with leaders in tech and business."
  ]
  return (
    <div className="flex flex-col w-full justify-center items-end m-12 min-h-dvh">
      <div className="flex justify-end w-full">
        <div className="text-2xl w-[75%]">
          {paragraphsA.map((text, index) => (
            <p
              key={index}
              className={`text-white text-right pb-5 ${index > 1 ? 'ml-32' : ''}`}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
      <h2
        className="text-6xl font-bold text-white"
        style={{ fontVariant: 'small-caps' }}
      >
        About
      </h2>
    </div>
  );


}
