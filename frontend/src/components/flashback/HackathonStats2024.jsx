import React from 'react';

function HackathonStats2024() {
  // Stats data for the hackathon
  const stats = [
    { number: '36', label: 'Hours' },
    { number: '$16,376', label: 'Total Prizes' },
    { number: '202', label: 'Participants' },
    { number: '10', label: 'Sponsors' },
    { number: '68', label: 'Projects' }
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>2024 Hackathon Stats</h2>
      <div style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
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
  container: {
    marginTop: '40px',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center'
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '40px'
  },
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
    backgroundColor: '#f0f0f0',
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
    color: '#ff5722'
  },
  label: {
    fontSize: '20px',
    fontWeight: 'normal',
    color: '#333',
    marginTop: '-10px'
  }
};

export default HackathonStats2024;
