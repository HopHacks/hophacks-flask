import LightBulb from './LightBulb';
import { useState } from 'react';

const SectionHeader = ({ children, className }) => (
  <h2 className={`text-4xl font-bold mb-8 ${className}`} style={{ fontFamily: 'Montserrat' }}>
    {children}
  </h2>
);
const Tracks = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const trackData = [
    { short: 'Hardware + AR Track', full: 'Best Use of AI+AR for Maternal Wellness' },
    { short: 'Gaming Track', full: 'Best Use of SpacetimeDB' },
    { short: 'Healthcare Track', full: 'Best Healthcare Hack' },
    { short: 'Defense Track', full: 'Biosecurity Challenge' },
    { short: 'Social Good Track', full: 'Best Application to Support Philanthropic Goals' },
    { short: 'Data Driven Track', full: 'Best Data Visualization' }
  ];

  return (
    <div className="w-full min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <SectionHeader className="text-center text-white">Tracks</SectionHeader>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 justify-items-center">
          {trackData.map((track, index) => (
            <div
              key={index}
              className="cursor-pointer p-4 overflow-visible"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <LightBulb
                text={track.short}
                fullText={track.full}
                isHovered={hoveredIndex === index}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tracks;
