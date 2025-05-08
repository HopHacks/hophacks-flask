import React from 'react';
import Team from './team/Team';

export default function TeamPage() {
  return (
      <main
        className="relative w-full bg-no-repeat bg-top bg-cover flex flex-col gap-32 py-24 font-montserrat"
        style={{
          backgroundImage:
            "url('https://hophacks-recap.s3.us-east-1.amazonaws.com/recap-bg.png')"
        }}
      >
      <Team />
      </main>
  );
}
