import React from 'react';

const TeamMatchingWelcome = ({ onContinue }) => {
  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="bg-[#061a40] shadow-2xl rounded-3xl p-8 max-w-xl w-full text-center text-white">
        <h1 className="text-3xl md:text-4xl font-bold italic text-[#29a0e2] mb-4">
          Welcome to Team Matching!
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-[#29a0e2] mb-6">
          Build your team. Find your people.
        </h2>
        <p className="text-sm md:text-base text-white mb-6">
          You&apos;re about to build a profile that helps you match with other hackers based on your skills, interests, and preferred role. Once your profile is created, you&apos;ll be able to swipe on potential teammates and form your dream team.
        </p>
        <button
          className="bg-[#2d99e0] hover:bg-[#061a40] text-white font-bold text-lg md:text-xl py-3 px-6 rounded-xl transition duration-300"
          onClick={onContinue}
        >
          Opt In
        </button>
      </div>
    </div>
  );
};

export default TeamMatchingWelcome ;
