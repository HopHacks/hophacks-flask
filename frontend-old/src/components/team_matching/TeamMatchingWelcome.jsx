import React from 'react';
import GlowButton from '../ui/GlowButton';

const TeamMatchingWelcome = ({ onContinue }) => {
  return (
    <div className="flex justify-center items-center bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover min-h-dvh px-4 pt-12">
      <div
        className="min-w-[300px] max-w-[700px] w-[70%] flex flex-col rounded-2xl p-10 m-5"
        style={{ backgroundColor: 'rgba(0, 29, 76, 0.9)' }}
      >
        <h1 className="text-white text-3xl font-bold text-center mb-4">
          Welcome to Team Matching!
        </h1>
        <p className="text-white text-md md:text-lg text-center mb-6">
          You&apos;re about to build a profile that helps you match with other hackers based on your
          skills, interests, and preferred role. Once your profile is created, you&apos;ll be able
          to swipe on potential teammates and form your dream team.
        </p>
        <div className="flex justify-center">
          <GlowButton onClick={onContinue}>Opt In</GlowButton>
        </div>
      </div>
    </div>
  );
};

export default TeamMatchingWelcome;
