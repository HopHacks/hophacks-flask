export default function AboutSection() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-20 sm:px-8">
      <h2 className="mb-10 text-center font-display text-[clamp(2.5rem,7vw,4rem)] font-normal leading-none tracking-wide text-white/95 text-shadow-hero-title">
        About HopHacks
      </h2>

      <div className="flex flex-col gap-6 text-base leading-relaxed text-text-primary sm:text-lg">
        <p>
          HopHacks is Johns Hopkins University&apos;s annual hackathon, where
          students come together to spend a weekend building, learning, and
          having fun with technology. We&apos;re open to both undergraduate and
          graduate students, whether you&apos;ve been to a dozen hackathons or
          have never written a line of code before.
        </p>

        <p>
          This September 18&ndash;20, grab some friends, find a team, and build
          something from scratch. You can work on an idea you&apos;ve had for a
          while, try out a new technology, or just see what you can make over a
          weekend. Along the way, there&apos;ll be workshops, mentors, sponsors,
          and plenty of food and opportunities to meet other people.
        </p>

        <p>
          You don&apos;t need to come in with a project or even know exactly
          what you want to build. Just come ready to learn, make something, and
          have a good time.
        </p>

        <p className="font-display text-[clamp(1.5rem,4vw,2rem)] font-normal tracking-wide text-white/95 text-shadow-hero-title">
          Come hack with us.
        </p>
      </div>
    </div>
  );
}
