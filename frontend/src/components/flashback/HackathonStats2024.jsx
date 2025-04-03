import React from 'react';

function HackathonStats2024() {
  // Stats data for the hackathon
  // TODO use stats from selectedYear (need API)
  const stats = [
    { number: '36', label: 'Hours' },
    { number: '$16,376', label: 'Total Prizes' },
    { number: '202', label: 'Participants' },
    { number: '10', label: 'Sponsors' },
    { number: '68', label: 'Projects' }
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full font-sans">
      <h2 className="font-anton-sc text-center text-white text-[60px] mb-5">{`2024 Hackathon Stats`}</h2>
      <div className="flex flex-wrap justify-center items-center gap-8 max-w-2xl">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-recap-gold w-[200px] h-[200px] rounded-full flex flex-col justify-center items-center 
             shadow-md shadow-lg 
             p-2.5 transition-all duration-300 
             hover:-translate-y-2 shadow-[0_0_100px_rgba(255,255,148,0.3)] hover:shadow-[0_0_120px_rgba(255,255,148,0.9)]"
          >
            <p style={styles.number}>{stat.number}</p>
            <p style={styles.label}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Styles for the component
const styles = {
  statsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap', // Allows wrapping of circles if screen is too small
    marginBottom: '100px' // Reduced margin between stats and page bottom
  },
  statCard: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '10px'
  },
  number: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  label: {
    fontSize: '20px',
    fontWeight: 'normal',
    color: '#333',
    marginTop: '-10px'
  }
};

export default HackathonStats2024;
