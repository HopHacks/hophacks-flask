import React from 'react';
import GlowButton from '../ui/GlowButton';

const TeamMatchingPause = ({ onContinue }) => {
  return (
    <div className="flex justify-center items-center bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover min-h-dvh px-4 pt-12">
      <div
        className="min-w-[300px] max-w-[700px] w-[70%] flex flex-col rounded-2xl p-10 m-5"
        style={{ backgroundColor: 'rgba(0, 29, 76, 0.9)' }}
      >
        <h1 className="text-white text-3xl font-bold text-center mb-4">
          Thanks for creating a Team Matching Profile!
        </h1>
        <p className="text-white text-md md:text-lg text-center mb-6">
          We’ll notify you when Team Matching opens so you can start swiping and building your dream
          team.
        </p>
        <div className="flex justify-center">
          <GlowButton onClick={onContinue}>Go Back</GlowButton>
        </div>
      </div>
    </div>
  );
};

export default TeamMatchingPause;
