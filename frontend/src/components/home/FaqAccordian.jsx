import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// ✅ Styles for semi-opaque background and white text
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  accordion: {
    backgroundColor: 'rgba(255, 233, 242, 0.32)', // semi-opaque
    color: 'white',
    marginBottom: theme.spacing(1),
    '&:before': {
      display: 'none',
    },
    transition: 'background-color 0.3s ease',
    '&:before': {
      display: 'none',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)', // slightly darker on hover
    },
  },
  summary: {
    fontWeight: 600,
    fontSize: '2rem',
  },
  details: {
    fontSize: '1.2rem',
    lineHeight: 1.5,
  },
}));

const linkClass = "underline hover:text-blue-600 transition-colors duration-300"

const faqData = [
  {
    question: 'What is a hackathon?',
    answer:
      'HopHacks is a 36 hour annual Hackathon held at the Johns Hopkins University that encourages engineers, designers, and entrepreneurs to explore new ideas and create new applications.',
  },
  {
    question: 'Who will participate?',
    answer: 'Any university student enrolled in any undergraduate or graduate program may participate. High school students may NOT participate.',
  },
  {
    question: 'Where will HopHacks take place?',
    answer: (
      <>
        HopHacks is held at Hodson Hall on the Johns Hopkins Homewood Campus in Baltimore, MD.
        A campus map can be found{' '}
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
        . We will be <b>fully in-person</b> this year! Unfortunately, there will be no way to
        attend virtually.
      </>
    ),
  },
  {
    question: 'What about the free food?',
    answer: 'At registration, all participants will be given a wristband which MUST BE VISIBLE when you are getting food.If you do not have your wristband, you will not be able to get food. Also, we do not like people who come to HopHacks for the free food and then leave. We are watching you.',
  },
  {
    question: 'When can I pick up parking passes?',
    answer: 'We will distribute parking passes to participants on the Sunday morning of HopHacks.',
  },
  {
    question: 'Will there be travel reimbursement?',
    answer: 'We will not be offering individual travel reimbursements.',
  },
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
