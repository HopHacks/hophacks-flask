import { useState } from 'react';
import { ProjectHighlights, HackathonStats2024, ImagesFromPastYears } from './flashback/index.js';

function Recap() {
  const [selectedYear, setSelectedYear] = useState('2024'); // State for the selected year
  return (
    <div className="bg-[url('https://hophacks-recap.s3.us-east-1.amazonaws.com/recap-bg.png')] flex flex-col gap-32 py-24">
      <ProjectHighlights selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      <ImagesFromPastYears selectedYear={selectedYear} />
      <HackathonStats2024 />
    </div>
  );
}

export default Recap;
