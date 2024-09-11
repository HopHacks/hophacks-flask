import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles({
  margin: {
    borderTop: '1',
    borderBottom: '1'
  },
  marginBot: {
    borderTop: '1',
    borderBottom: '20'
  },
  color: {
    backgroundColor: 'rgba(45, 153, 224, 1)'
  },
  colorBackground: {
    backgroundColor: '#1D539F'
  },
  title: {
    fontSize: '3rem',
    color: '#061a40',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: '30px'
  },

  button: {
    backgroundColor: '#6, 26, 64, 1',
    color: '#c8e7fa',
    width: '50%',
    minHeight: '50px',
    border: '4px solid',
    '&:hover': {
      backgroundColor: '#c8e7fa'
    }
  },
  text: {
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Inter',
    flexDirection: 'column',
    marginBottom: '0px'
  },
  link: {
    color: 'rgba(250, 192, 19, 1)'
  },
  MuiAccordionroot: {
    '&.MuiAccordion-root:before': {
      backgroundColor: '#376eea',
      flexDirection: 'column'
    },
    '&.MuiAccordion-root.Mui-expanded:last-child': {
      paddingBottom: '20px',
      marginTop: '1px',
      marginBottom: '10px',
      backgroundColor: 'rgba(45, 153, 224, 1)'
    },
    '&.MuiAccordionSummary-content': {
      margin: '0'
    }
  },
  expanded: {},
  content: {
    '&$expanded': {
      margin: '0',
      minHeight: '0'
    },
    margin: '0'
  },
  MuiAccordionDetailroot: {
    padding: '0px 16px 0px',
    flexDirection: 'column'
  },
  expand_icon: {
    color: 'rgba(250, 192, 19, 1)'
  },
  mt_50: {
    marginTop: '50px'
  }
});

const Tracks = () => {
  const classes = useStyles();
  return (
    <div className={classes.mt_50}>
      <div className="hero" id="tracks">
        <Typography className={classes.title} variant="h4" style={{ marginTop: '0%' }} gutterBottom>
          Tracks
        </Typography>
        <Typography
          className={classes.divFont}
          style={{ color: 'rgba(6, 26, 64, 1)', fontWeight: 'bold', fontStyle: 'italic' }}
        >
          Each Team can choose one and only one track
        </Typography>
        <Box
          raised="true"
          border={0}
          borderLeft={0}
          borderRight={0}
          borderBottom={0}
          marginTop={'0.5rem'}
        >
          <Accordion
            className={`${classes.colorBackground} ${classes.text}`}
            border={0}
            elevation={0}
            classes={{ root: classes.MuiAccordionroot }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className={classes.expand_icon} />}
              classes={{
                root: classes.content,
                content: classes.content,
                expanded: classes.expanded
              }}
            >
              <Typography className={classes.text} variant="h6" gutterBottom>
                <b> Bloomberg - “Most Philanthropic Hack” </b>
              </Typography>
            </AccordionSummary>
            <AccordionDetails classes={{ root: classes.MuiAccordionDetailroot }}>
              <Typography className={classes.text}>
                This will be awarded to the best application to support philanthropic goals.
                Criteria will include how much the application aims to help people and improve
                lives, technical difficulty, and technical polish.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box
          raised="true"
          border={0}
          borderLeft={0}
          borderRight={0}
          borderBottom={0}
          marginTop={'0.5rem'}
        >
          <Accordion
            className={`${classes.colorBackground} ${classes.text}`}
            border={0}
            elevation={0}
            classes={{ root: classes.MuiAccordionroot }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className={classes.expand_icon} />}
              classes={{
                root: classes.content,
                content: classes.content,
                expanded: classes.expanded
              }}
            >
              <Typography className={classes.text} variant="h6" gutterBottom>
                <b> Patient Safety Technology Challenge </b>
              </Typography>
            </AccordionSummary>
            <AccordionDetails classes={{ root: classes.MuiAccordionDetailroot }}>
              <Typography className={classes.text}>
                We’re in search of bold new thinking. This is an invitation to solve the problem of
                medical error that harms millions of U.S. patients, kills approximately 250,000
                patients, and costs billions of dollars every year. We’re calling on HopHacks teams
                to envision the best technology-enabled patient safety solution that has the
                potential to avert patient harm and save lives. You do not need to have any
                background in healthcare to participate! To be eligible to win your project must
                align with one of the following five leading patient safety challenges facing health
                care across the continuum of care: Medication errors, procedural/surgical errors,
                errors during routine patient care (e.g. pressure ulcers, blood clots, falls),
                infections and diagnostic safety. Learn more about the problem and get access to
                resources to help your hack{' '}
                <a
                  className={classes.contact}
                  href={`https://l.messenger.com/l.php?u=https%3A%2F%2Fwww.patientsafetytech.com%2Fpatient-safety&h=AT1KD7Y0j7HlY_d7JJj_ikRbbJDAjichw4NbeeX1YuPhDgIDAmzo83z6xy0P2srY0HpjHXbFSliasF4ieTUTQvML-cOfj-iW33GccdobqxAsSjxfgRzbP7bWsTY9Y8JlCR63ZlgKfYhFAYEXXsjeHTtA9s4`}
                >
                  here
                </a>
                .
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box
          raised="true"
          border={0}
          borderLeft={0}
          borderRight={0}
          borderBottom={0}
          marginTop={'0.5rem'}
        >
          <Accordion
            className={`${classes.colorBackground} ${classes.text}`}
            border={0}
            elevation={0}
            classes={{ root: classes.MuiAccordionroot }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className={classes.expand_icon} />}
              classes={{
                root: classes.content,
                content: classes.content,
                expanded: classes.expanded
              }}
            >
              <Typography className={classes.text} variant="h6" gutterBottom>
                <b> Telemedicine & AI : Patient History Taking Challenges in Teleconsultations </b>
              </Typography>
            </AccordionSummary>
            <AccordionDetails classes={{ root: classes.MuiAccordionDetailroot }}>
              <Typography className={classes.text}>
                Telemedicine Hub doctors need accurate and complete patient clinical history from
                Spokes to improve diagnostic accuracy and reduce repeated questioning. Currently,
                insufficient history forces Hub doctors to spend valuable time asking basic
                questions, delaying treatment. Your challenge is to create a solution that improves
                the reliability and completeness of clinical data collected at Spokes, optimizing
                time for more teleconsultations and better diagnoses.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </div>
    </div>
  );
};

export default Tracks;
