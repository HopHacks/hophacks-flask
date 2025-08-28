import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  makeStyles
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1.8)
  },
  accordion: {
    backgroundColor: 'rgba(255, 233, 242, 0.32)', // semi-opaque
    color: 'white',
    marginBottom: theme.spacing(1),
    '&:before': {
      display: 'none'
    },
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)' // slightly darker on hover
    }
  },
  summary: {
    fontWeight: 600,
    fontSize: '2rem'
  },
  details: {
    fontSize: '1.2rem',
    lineHeight: 1.5
  }
}));

const linkClass = 'underline hover:text-blue-600 transition-colors duration-300';

const faqData = [
  {
    question: 'What is a hackathon?',
    answer:
      'A fast paced environment that encourages engineers, designers, and entrepreneurs to explore new ideas and create new software or hardware applications in a short timeframe. Hackers compete for prizes in tracks by sponsors, eat free food, receive cool merch, and make memories that last a lifetime!'
  },
  {
    question: 'What is HopHacks?',
    answer:
      'HopHacks is the 36 hour annual premier Hackathon held at Johns Hopkins University in the fall.'
  },
  {
    question: 'Who can participate?',
    answer:
      'Any university student enrolled in any undergraduate or graduate program may apply to hack. High school students may NOT participate. We will email you closer to the hackathon once we approve your application.'
  },
  {
    question: 'I don’t have a team, how can I make one?',
    answer:
      'We will have a team matching process after we accept hackers! You may form teams of up to four hackers, or compete solo. Additionally, we will be hosting team matching events at the start of the hackathon, so don’t worry!'
  },
  {
    question: 'Where will HopHacks take place?',
    answer: (
      <>
        This year, HopHacks is held at Hodson Hall and the Glass Pavilion on the Johns Hopkins
        Homewood Campus in Baltimore, MD. A campus map can be found{' '}
        <a
          className={linkClass}
          href="https://drive.google.com/file/d/1aEulGqVSH3nPV2BXU90W8V-tDlFH-bRx/view?usp=sharing"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
        , and you can navigate to us on{' '}
        <a
          className={linkClass}
          href="https://www.google.com/maps/place/Hodson+Hall/@39.3275298,-76.6244881,17z"
          target="_blank"
          rel="noreferrer"
        >
          Google Maps
        </a>
        .
      </>
    )
  },
  {
    question: 'Is HopHacks held in-person?',
    answer:
      'Yes! We will be fully in-person this year so you can meet other hackers and sponsors! Unfortunately, there will be no way to attend virtually.'
  },
  {
    question: 'When can I pick up parking passes?',
    answer: 'We will distribute parking passes to participants on the Sunday morning of HopHacks.'
  },
  {
    question: 'Will there be travel reimbursement?',
    answer: (
      <>
        We will not be offering individual travel reimbursements. However, please see the busing
        interest form in our{' '}
        <a className={linkClass} href="https://linktr.ee/hophacks" target="_blank" rel="noreferrer">
          LinkTree
        </a>{' '}
        to sign up for updates. If enough people from your city sign up, we may send a FREE bus to
        pick up hackers in your area!
      </>
    )
  },
  {
    question: 'What about the free food?',
    answer:
      'At registration, all participants will be given a wristband which MUST BE VISIBLE when you are getting food. If you do not have your wristband, you will not be able to get food.'
  },
  {
    question: 'Where can I find the MLH code of conduct?',
    answer: (
      <>
        You can find the MLH code of conduct{' '}
        <a
          className={linkClass}
          href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
          target="_blank"
          rel="noreferrer"
        >
          here.
        </a>
      </>
    )
  },
  {
    question: 'My question wasn’t answered here!',
    answer: (
      <>
        Please email hophacks@gmail.com or ask your question in our{' '}
        <a
          className={linkClass}
          href="https://discord.com/invite/8V8wmCWUhH"
          target="_blank"
          rel="noreferrer"
        >
          Discord
        </a>{' '}
        and one of our organizers will get back to you soon!
      </>
    )
  }
];

export default function FaqAccordion() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {faqData.map(({ question, answer }, index) => (
        <Accordion key={index} className={classes.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}>
            <Typography className={classes.summary}>{question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className={classes.details}>{answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
