import React from 'react';
import { ProjectHighlights, HackathonStats2024, ImagesFromPastYears } from './flashback/index.js';

function Recap() {
  return (
    <div className="bg-[url('https://hophacks-recap.s3.us-east-1.amazonaws.com/recap-bg.png')]">
      <ProjectHighlights />
      <ImagesFromPastYears />
      <HackathonStats2024 />
    </div>
  );
}

export default Recap;
