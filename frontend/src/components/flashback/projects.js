import nameToURL from '../utils/nameToURL';

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
      description: 'The next generation of paper referencing, now featuring AI-assisted summaries.',
      image: nameToURL('projectHighlight2_2024'),
      link: 'https://devpost.com/software/reference-summary'
    },
    {
      id: 3,
      title: 'Next Majestic Signs',
      description: 'Take hand exercises to the next level with AR-based tracking and gamification.',
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

export default projectsData;
