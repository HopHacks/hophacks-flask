import React, { useState, useEffect, useRef } from 'react';
import CountUp from 'react-countup';
import SectionHeader from '../ui/SectionHeader';

function StatCircle({ stat, inView }) {
  const isPrize = stat.label === 'Total Prizes';
  const displayValue = inView ? (
    <CountUp
      start={0}
      end={stat.number}
      duration={2.5}
      separator=","
      prefix={isPrize ? '$' : ''}
    />
  ) : isPrize ? (
    '$0'
  ) : (
    '0'
  );

  return (
    <div
      className="bg-recap-gold w-[150px] h-[150px] rounded-full flex flex-col justify-center items-center  
      p-2.5 transition-all duration-300 
      shadow-[0_0_100px_8px_rgba(255,255,148,.5)]
      hover:shadow-[0_0_25px_8px_rgba(255,255,148,.6),0_0_60px_25px_rgba(255,255,148,0.6)]
      hover:-translate-y-2"
    >
      <p className="font-bold text-3xl text-white">{displayValue}</p>
      <p className="text-lg mt-[-3px]">{stat.label}</p>
    </div>
  );
}

function StatRow({ stats, inView }) {
  return (
    <div
      className="flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-36 mb-2"
    >
      {stats.map((stat, index) => (
        <StatCircle key={index} stat={stat} inView={inView} />
      ))}
    </div>
  );
}


function HackathonStats2024({ modifiedTitle }) {
  // Stats data for the hackathon
  // TODO use stats from selectedYear (need API)
  const statsA = [
    { number: '36', label: 'Hours' },
    { number: '16376', label: 'Total Prizes' },
    { number: '202', label: 'Participants' }
  ];

  const statsB = [
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
    <div className="flex flex-col items-center gap-4">
      <SectionHeader>{modifiedTitle ?? "2024 Hackathon Stats"}</SectionHeader>
      <StatRow stats={statsA} inView={inView} />
      <StatRow stats={statsB} inView={inView} />
    </div>
  );
}

export default HackathonStats2024;
