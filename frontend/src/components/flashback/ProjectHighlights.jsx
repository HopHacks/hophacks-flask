// Reusable ProjectCard component
function ProjectCard({ title, description, image, link }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="no-underline text-inherit transition-translate duration-300 hover:-translate-y-2"
    >
      <div className="w-[300px] h-[320px] bg-gray-100 rounded-2xl text-center p-4">
        <img src={image} alt={`${title} logo`} style={styles.image} />
        <h3 className="font-bold text-lg">{title}</h3>
        <p style={styles.description}>{description}</p>
      </div>
    </a>
  );
}

// Main ProjectHighlights component
function ProjectHighlights({ selectedYear, setSelectedYear }) {
  // Define data for each year
  const projectsData = {
    2022: [
      {
        id: 1,
        title: 'Copycat',
        description:
          'Welcome to Copycat, a user-friendly mobile game that transforms social-emotional learning with artificial...',
        image: 'https://hophacks-recap.s3.us-east-1.amazonaws.com/project_highlight_1_2022.png',
        link: 'https://devpost.com/software/copycat-qiu7vr?_gl=1*1n2qlx9*_gcl_au*ODAwODg1NTcuMTczODc5NDI0NA..*_ga*MTEzODU5MDYyOC4xNzM4Nzk0MjQ0*_ga_0YHJK3Y10M*MTc0MTEwOTI1My4yLjEuMTc0MTEwOTM5MC4wLjAuMA..'
      },
      {
        id: 2,
        title: 'EZnote',
        description:
          'EZnote is an automatic note-taking tool empowered by Computer Vision and Machine Learning that aims to...',
        image: 'https://hophacks-recap.s3.us-east-1.amazonaws.com/project_highlight_2_2022.png',
        link: 'https://devpost.com/software/eznote?_gl=1*k99ebx*_gcl_au*ODAwODg1NTcuMTczODc5NDI0NA..*_ga*MTEzODU5MDYyOC4xNzM4Nzk0MjQ0*_ga_0YHJK3Y10M*MTc0MTEwOTI1My4yLjEuMTc0MTEwOTQ3Ni4wLjAuMA..'
      },
      {
        id: 3,
        title: 'Check it out!',
        description:
          'Grocery checkout, streamlined. Automatic grocery detection with machine learning.',
        image: 'https://hophacks-recap.s3.us-east-1.amazonaws.com/project_highlight_3_2022.png',
        link: 'https://devpost.com/software/check-it-out?_gl=1*yoctuk*_gcl_au*ODAwODg1NTcuMTczODc5NDI0NA..*_ga*MTEzODU5MDYyOC4xNzM4Nzk0MjQ0*_ga_0YHJK3Y10M*MTc0MTEwOTI1My4yLjEuMTc0MTEwOTUwOS4wLjAuMA..'
      }
    ],
    2023: [
      {
        id: 1,
        title: 'Majestic Signs',
        description:
          'Exercise your hand muscles or become the next hokage or even a jujutsu sorcerer! (anime reference).',
        image: 'https://hophacks-recap.s3.us-east-1.amazonaws.com/project_highlight_1_2023.png',
        link: 'https://devpost.com/software/majesty-signs?_gl=1*1we1etq*_gcl_au*ODAwODg1NTcuMTczODc5NDI0NA..*_ga*MTEzODU5MDYyOC4xNzM4Nzk0MjQ0*_ga_0YHJK3Y10M*MTc0MTEwOTI1My4yLjEuMTc0MTEwOTYxMC4wLjAuMA..'
      },
      {
        id: 2,
        title: 'arxiv paper reference helper',
        description:
          'Tired of scouring through the web looking for references to a paper? This program provides you with relevant...',
        image: 'https://hophacks-recap.s3.us-east-1.amazonaws.com/project_highlight_2_2023.png',
        link: 'https://devpost.com/software/reference-summary?_gl=1*1w53w7b*_gcl_au*ODAwODg1NTcuMTczODc5NDI0NA..*_ga*MTEzODU5MDYyOC4xNzM4Nzk0MjQ0*_ga_0YHJK3Y10M*MTc0MTEwOTI1My4yLjEuMTc0MTEwOTY0Ni4wLjAuMA..'
      },
      {
        id: 3,
        title: 'Countability',
        description:
          'Surgical tools left in a patients’ body can cause illness or death. Countability is a low-cost, accessible...',
        image: 'https://hophacks-recap.s3.us-east-1.amazonaws.com/project_highlight_3_2023.png',
        link: 'https://devpost.com/software/countability?_gl=1*how06x*_gcl_au*ODAwODg1NTcuMTczODc5NDI0NA..*_ga*MTEzODU5MDYyOC4xNzM4Nzk0MjQ0*_ga_0YHJK3Y10M*MTc0MTEwOTI1My4yLjEuMTc0MTEwOTY3Mi4wLjAuMA..'
      }
    ],
    2024: [
      {
        id: 1,
        title: 'NoteSync AI',
        description:
          'Our AI-powered platform seamlessly integrates audio, images, and handwritten notes into a unified...',
        image: 'https://hophacks-recap.s3.us-east-1.amazonaws.com/project_highlight_1_2024.png',
        link: 'https://devpost.com/software/notesync-ai-effective-learning-with-ai-powered-notes?_gl=1*1e0qbwp*_gcl_au*ODAwODg1NTcuMTczODc5NDI0NA..*_ga*MTEzODU5MDYyOC4xNzM4Nzk0MjQ0*_ga_0YHJK3Y10M*MTc0MTEwOTI1My4yLjEuMTc0MTEwOTcxMS4wLjAuMA..'
      },
      {
        id: 2,
        title: 'Young Heroes',
        description: 'Safe & Accessible 911 call simulation platform for kids.',
        image: 'https://hophacks-recap.s3.us-east-1.amazonaws.com/project_highlight_2_2024.png',
        link: 'https://devpost.com/software/young-heroes-hmi2vl?_gl=1*120rbz4*_gcl_au*ODAwODg1NTcuMTczODc5NDI0NA..*_ga*MTEzODU5MDYyOC4xNzM4Nzk0MjQ0*_ga_0YHJK3Y10M*MTc0MTEwOTI1My4yLjEuMTc0MTEwOTc4Ni4wLjAuMA..'
      },
      {
        id: 3,
        title: 'DenEyes',
        description: 'Early ADHD detection through AI-Powered Robotics and Computer Vision',
        image: 'https://hophacks-recap.s3.us-east-1.amazonaws.com/project_highlight_3_2024.png',
        link: 'https://devpost.com/software/deneyes?_gl=1*19k2umg*_gcl_au*ODAwODg1NTcuMTczODc5NDI0NA..*_ga*MTEzODU5MDYyOC4xNzM4Nzk0MjQ0*_ga_0YHJK3Y10M*MTc0MTEwOTI1My4yLjEuMTc0MTEwOTgxMC4wLjAuMA..'
      }
    ]
  };

  return (
    <div>
      <div style={styles.headerContainer}>
        <h2
          className="font-bold text-white text-6xl text-center mb-12 mt-32 w-2/3 max-w-2xl"
          style={{ fontVariant: 'small-caps' }}
        >
          Project Highlights from Past Years
        </h2>

        <div className="flex gap-3 mb-2 w-full justify-center items-center">
          {['2022', '2023', '2024'].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={
                selectedYear === year
                  ? 'h-12 px-4 py-2 text-lg font-bold rounded-2xl bg-recap-gold cursor-pointer transition-all duration-300 hover:bg-recap-gold-light text-white shadow-[0_0_20px_rgba(255,255,148,0.3)]'
                  : 'h-12 px-4 py-2 text-lg font-bold rounded-2xl bg-gray-100 cursor-pointer transition-colors duration-300 hover:bg-recap-gold-light hover:text-white'
              }
            >
              {year}
            </button>
          ))}
        </div>
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
          className="px-5 py-4 text-lg font-bold rounded-2xl bg-recap-gold cursor-pointer 
             text-white shadow-[0_0_40px_rgba(255,255,148,0.3)] 
             transition-shadow duration-300 
             hover:shadow-[0_0_120px_rgba(255,255,148,0.9)]"
        >
          {`View All Projects From ${selectedYear}`}
        </button>
      </div>
    </div>
  );
}

// Inline styles for the component
const styles = {
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px'
  },
  header: {
    fontSize: '36px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '16px',
    marginBottom: '24px',
    color: 'white'
  },
  viewAllButton: {
    backgroundColor: '#ffb51f',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    marginLeft: '10px',
    height: '48px'
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  activeButton: {
    padding: '10px 20px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#ffb51f',
    color: 'white',
    cursor: 'pointer'
  },
  projectsGrid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column', // Items in a horizontal row
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
  description: {
    fontSize: '14px',
    color: '#555'
  }
};

export default ProjectHighlights;
