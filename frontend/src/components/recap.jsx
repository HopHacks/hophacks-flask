import { useState } from 'react';
import { ProjectHighlights, HackathonStats2024, ImagesFromPastYears } from './flashback/index.js';

function Recap() {
  const [selectedYear, setSelectedYear] = useState('2023'); // State for the selected year
  return (
    <div className="bg-[url('https://hophacks-recap.s3.us-east-1.amazonaws.com/recap-bg.png')]">
      <ProjectHighlights selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      <ImagesFromPastYears selectedYear={selectedYear} />
      <HackathonStats2024 selectedYear={selectedYear} />
    </div>
  );
}

export default Recap;
