import React, { useState, useEffect, useRef } from 'react';
import CountUp from 'react-countup';

function HackathonStats2024() {
  // Stats data for the hackathon
  // TODO use stats from selectedYear (need API)
  const stats = [
    { number: '36', label: 'Hours' },
    { number: '16376', label: 'Total Prizes' },
    { number: '202', label: 'Participants' },
    { number: '10', label: 'Sponsors' },
    { number: '68', label: 'Projects' }
  ];

  const [inView, setInView] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          // observer.disconnect();
        } else {
          setInView(false);
        }
      },
      { threshold: 0.4 } // Trigger when 30% of component is visible
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full font-sans" ref={statsRef}>
      <h2 className="aftext-center text-white text-6xl tracking-wide font-bold text-center mb-12">{`2024 HACKATHON STATS`}</h2>
      <div className="flex flex-wrap justify-center items-center gap-8 max-w-2xl">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-recap-gold w-[150px] h-[150px] rounded-full flex flex-col justify-center items-center 
             shadow-md shadow-lg 
             p-2.5 transition-all duration-300 
             hover:-translate-y-2 shadow-[0_0_100px_rgba(255,255,148,0.3)] hover:shadow-[0_0_120px_rgba(255,255,148,0.9)]"
          >
            <p className="font-bold text-3xl text-white">
              {inView ? (
                <CountUp
                  start={0}
                  end={stat.number}
                  duration={2.5}
                  separator=","
                  prefix={stat.label === 'Total Prizes' ? '$' : ''}
                />
              ) : stat.label === 'Total Prizes' ? (
                '$0'
              ) : (
                '0'
              )}
            </p>
            <p className="text-lg mt-[-3px]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HackathonStats2024;
