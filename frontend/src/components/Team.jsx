import React from 'react';
import Team from './team/Team';

export default function TeamPage() {
  return (
    <div className="bg-[url('https://hophacks-recap.s3.us-east-1.amazonaws.com/recap-bg.png')] bg-cover flex flex-col gap-32 py-24 font-montserrat">
      <Team />
    </div>
  );
}
