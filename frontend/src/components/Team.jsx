import React from 'react';
import Team from './home/Team';

export default function TeamPage() {
  return (
    <div
      style={{
        // backgroundImage: `url("https://hophacks-website.s3.amazonaws.com/images/cover.png")`,
        backgroundSize: 'cover',
        minHeight: '100vh'
      }}
    >
      <Team />
    </div>
  );
}
