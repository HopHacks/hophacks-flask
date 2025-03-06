import React from 'react';
import { ProjectHighlights, HackathonStats2024, ImagesFromPastYears } from './flashback/index.js';

function Recap() {
  return (
    <div>
      <ProjectHighlights />
      <ImagesFromPastYears />
      <HackathonStats2024 />
    </div>
  );
}

export default Recap;
