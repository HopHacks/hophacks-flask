import React, { useState } from 'react';

function nameToURL(name) {
  return `https://hophacks-recap.s3.us-east-1.amazonaws.com${name}`;
}

function ProjectCard({ title, description, image, link }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" style={styles.cardLink}>
      <div style={styles.card}>
        <img src={image} alt={`${title} logo`} style={styles.image} />
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.description}>{description}</p>
      </div>
    </a>
  );
}

// Main ProjectHighlights component
function ProjectHighlights() {
  const [selectedYear, setSelectedYear] = useState('2023'); // State for the selected year

  // Define data for each year
  const projectsData = {
    2022: [
      {
        id: 1,
        title: 'Countability',
        description:
          'Surgical tools left in a patients’ body can cause illness or death. Countability is a low-cost, accessible technology using AI and smartphones to track tools in the operating room to catch mistakes.',
        image: nameToURL('projectHighlight1_2023'),
        link: 'https://devpost.com/software/countability'
      },
      {
        id: 2,
        title: 'arxiv paper reference helper',
        description:
          'Tired of scouring through the web looking for references to a paper? This program provides you with relevant parts of the reference articles.',
        image: nameToURL('projectHighlight2_2023'),
        link: 'https://devpost.com/software/reference-summary'
      },
      {
        id: 3,
        title: 'Majestic Signs',
        description:
          'Exercise your hand muscles or become the next hokage or even a jujutsu sorcerer! (anime reference)',
        image: nameToURL('projectHighlight3_2023'),
        link: 'https://devpost.com/software/majesty-signs'
      }
    ],
    2023: [
      {
        id: 1,
        title: 'Future Countability',
        description:
          'An improved version of Countability that introduces real-time AI tracking of surgical tools for even greater safety.',
        image: nameToURL('projectHighlight1_2024'),
        link: 'https://devpost.com/software/countability'
      },
      {
        id: 2,
        title: 'Advanced arxiv paper reference helper',
        description:
          'The next generation of paper referencing, now featuring AI-assisted summaries.',
        image: nameToURL('projectHighlight2_2024'),
        link: 'https://devpost.com/software/reference-summary'
      },
      {
        id: 3,
        title: 'Next Majestic Signs',
        description:
          'Take hand exercises to the next level with AR-based tracking and gamification.',
        image: nameToURL('projectHighlight3_2024'),
        link: 'https://devpost.com/software/majesty-signs'
      }
    ],
    2024: [
      {
        id: 1,
        title: 'Surgical AI Assistant',
        description:
          'A groundbreaking assistant that uses AI to not only track tools but also predict surgical needs in real time.',
        image: nameToURL('projectHighlight1_2024'),
        link: 'https://devpost.com/software/countability'
      },
      {
        id: 2,
        title: 'arxiv Plus',
        description:
          'Beyond references: This tool generates summaries, diagrams, and insights for any academic paper.',
        image: nameToURL('projectHighlight2_2024'),
        link: 'https://devpost.com/software/reference-summary'
      },
      {
        id: 3,
        title: 'Majestic Signs Pro',
        description:
          'Combining AR, VR, and AI to revolutionize hand dexterity training and gamified exercises.',
        image: nameToURL('projectHighlight3_2024'),
        link: 'https://devpost.com/software/majesty-signs'
      }
    ]
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h2 style={styles.header}>Project Highlights from Past Years</h2>

        <select
          style={styles.select}
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
      </div>

      <div style={styles.contentContainer}>
        <div style={styles.projectsGrid}>
          {projectsData[selectedYear].map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              image={project.image}
              link={project.link}
            />
          ))}
        </div>

        <button
          onClick={() => {
            const yearUrls = {
              2022: 'https://hophacks-fall-2022.devpost.com/?ref_feature=challenge&ref_medium=discover',
              2023: 'https://hophacks.devpost.com/project-gallery',
              2024: 'https://hophacks-fall-2024.devpost.com/?ref_feature=challenge&ref_medium=discover'
            };
            window.open(yearUrls[selectedYear], '_blank');
          }}
          style={styles.viewAllButton}
        >
          View All Projects
        </button>
      </div>
    </div>
  );
}

// Inline styles for the component
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px'
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'left'
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    marginTop: '10px'
  },
  viewAllButton: {
    backgroundColor: '#ff5722',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    marginLeft: '10px'
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px'
  },
  projectsGrid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    width: '300px',
    textAlign: 'center',
    backgroundColor: '#f0f0f0'
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit'
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row', // Items in a horizontal row
    justifyContent: 'center', // Center the row in the container
    alignItems: 'center', // Align items vertically in the center
    gap: '20px', // Space between the cards and the button
    marginTop: '20px' // Add spacing between sections
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '4px',
    marginBottom: '10px'
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '10px 0'
  },
  description: {
    fontSize: '14px',
    color: '#555'
  }
};

export default ProjectHighlights;
