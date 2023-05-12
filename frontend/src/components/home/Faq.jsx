import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import '@fontsource/rosarivo';
import '../../stylesheets/home.css';

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
    //backgroundColor: "#2195ea",
    backgroundColor: '#376eea'
  },
  colorBackground: {
    backgroundColor: 'transparent'
  },
  title: {
    fontSize: '2rem',
    color: '#ffffff',
    fontFamily: 'Inter',
    marginBottom: '2rem'
  },

  button: {
    backgroundColor: '#FFFFFF',
    color: '#c8e7fa',
    width: '50%',
    minHeight: '50px',
    border: '4px solid',
    '&:hover': {
      backgroundColor: '#c8e7fa'
    }
  },
  text: {
    color: '#ffffff',
    fontFamily: 'Inter',
    flexDirection: 'column',
    marginBottom: '0px'
  },
  link: {
    color: '#8aecff'
  },
  MuiAccordionroot: {
    '&.MuiAccordion-root:before': {
      backgroundColor: '#376eea',
      flexDirection: 'column'
    },
    '&.MuiAccordion-root.Mui-expanded:last-child': {
      marginTop: '1px',
      marginBottom: '25px'
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
    color: 'white'
  }
});

export default function Faq() {
  const classes = useStyles();

  return (
    <Box id="faq" marginTop={'10rem'}>
      <Typography className={classes.title} variant="h4" style={{ marginTop: '0%' }} gutterBottom>
        Frequently Asked Questions
      </Typography>
      <Box
        raised="true"
        border={4}
        borderLeft={0}
        borderRight={0}
        borderBottom={0}
        borderColor="#ffffff"
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
              <b> Who can participate? </b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.MuiAccordionDetailroot }}>
            <Typography className={classes.text}>
              Any <b>university student</b> enrolled in any undergraduate or graduate program may
              participate. High school students may <b>NOT</b> participate.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box
        raised="true"
        border={4}
        borderLeft={0}
        borderRight={0}
        borderBottom={0}
        borderColor="#ffffff"
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
              <b>Where will HopHacks take place?</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.MuiAccordionDetailroot }}>
            <Typography className={classes.text}>
              HopHacks is held at Hodson Hall on the Johns Hopkins Homewood Campus in Baltimore, MD.
              A campus map can be found{' '}
              <a
                className={classes.link}
                href="https://drive.google.com/file/d/1aEulGqVSH3nPV2BXU90W8V-tDlFH-bRx/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
              , and you can navigate to us on{' '}
              <a
                className={classes.link}
                href="https://www.google.com/maps/place/Hodson+Hall/@39.3275298,-76.6244881,17z/data=!3m1!4b1!4m5!3m4!1s0x89c804df19af3e45:0x1e729d07213e16a!8m2!3d39.3275257!4d-76.6222941"
                target="_blank"
                rel="noreferrer"
              >
                Google Maps
              </a>
              . We will be <b>fully in-person</b> this year! Unfortunately, there will be no way to
              attend virtually.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box
        raised="true"
        border={4}
        borderLeft={0}
        borderRight={0}
        borderBottom={0}
        borderColor="#ffffff"
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
              <b>Is HopHacks in-person or virtual this year?</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.MuiAccordionDetailroot }}>
            <Typography className={classes.text}>
              We will be <b>fully in-person</b> this year! Unfortunately, there will be no way to
              attend virtually.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box
        raised="true"
        border={4}
        borderLeft={0}
        borderRight={0}
        borderBottom={0}
        borderColor="#ffffff"
      >
        <Accordion
          className={`${classes.colorBackground} ${classes.text}`}
          border={0}
          elevation={0}
          classes={{ root: classes.MuiAccordionroot }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className={classes.expand_icon} />}
            classes={{ content: classes.content, expanded: classes.expanded }}
          >
            <Typography className={classes.text} variant="h6" gutterBottom>
              <b>How do I get to HopHacks?</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.MuiAccordionDetailroot }}>
            <Typography className={classes.text}>
              To get to us, we offer two bus routes. The North Bus will pick up students from New
              York City, Rutgers, and Philadelphia; the South Bus will pick up students from
              Georgetown, UMDCP, and UMDBC. More information on the exact pickup locations of these
              busses will be posted and sent out shortly to those who indicate interest in their
              registration.
            </Typography>
            <br></br>
            <Typography className={classes.text}>
              If none of those options are for you, here are more ways to get to the party:
              <ul>
                <li>
                  For students from local Baltimore schools, we recommend the{' '}
                  <a
                    className={classes.link}
                    href="https://baltimorecollegetown.org/shuttle/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Collegetown Shuttle
                  </a>
                  .
                </li>
                <li>
                  For students from DC who are not taking our South/DC/Maryland Bus, we recommend
                  taking the{' '}
                  <a
                    className={classes.link}
                    href="https://www.mta.maryland.gov/schedule?type=marc-train"
                    target="_blank"
                    rel="noreferrer"
                  >
                    MARC
                  </a>{' '}
                  train to Baltimore Penn Station, and then taking the{' '}
                  <a
                    className={classes.link}
                    href="https://ts.jhu.edu/Shuttles/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    JHMI
                  </a>{' '}
                  shuttle or an Uber/Lyft/Taxi to Hopkins (if you do this, be sure to specify that
                  you’re going to the Homewood campus!).
                </li>
                <li>
                  For other students, we recommend taking the{' '}
                  <a
                    className={classes.link}
                    href="https://www.flixbus.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    FlixBus
                  </a>
                  , which stops near Baltimore Penn station so you can take the JHMI or
                  Uber/Lyft/Taxi to Hopkins as stated in the previous bullet.
                </li>
                <li>
                  Finally, for those of you who are driving, free parking will be available in the{' '}
                  <a
                    className={classes.link}
                    href="https://www.google.com/maps/place/JHU+South+Garage/@39.3266548,-76.6240642,17z/data=!4m5!3m4!1s0x89c805322769c3db:0x83520ffde4dbcc7!8m2!3d39.325966!4d-76.6221276"
                    target="_blank"
                    rel="noreferrer"
                  >
                    South Garage
                  </a>
                  . Come see us in Hodson Hall for a parking pass!
                </li>
              </ul>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box
        raised="true"
        border={4}
        borderLeft={0}
        borderRight={0}
        borderBottom={0}
        borderColor="#ffffff"
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
              <b>What are the COVID-19 policies for this event?</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.MuiAccordionDetailroot }}>
            <Typography className={classes.text}>
              Proof of COVID-19 vaccination and booster shot or proof of exemption must be uploaded
              to your Profile page when you register for HopHacks. No masks are required, unless you
              are exempt from vaccination.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box
        raised="true"
        border={4}
        borderLeft={0}
        borderRight={0}
        borderBottom={0}
        borderColor="#ffffff"
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
              <b>Who will be there?</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.MuiAccordionDetailroot }}>
            <Typography className={classes.text}>
              In addition to students in attendance, representatives from many of our sponsor
              companies will be there to mentor the participants.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box
        raised="true"
        border={4}
        borderLeft={0}
        borderRight={0}
        borderBottom={0}
        borderColor="#ffffff"
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
              <b> Who are the judges? </b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.MuiAccordionDetailroot }}>
            <Typography className={classes.text}>
              The judges will be a mix of local tech professionals and JHU faculty.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box
        raised="true"
        border={4}
        borderLeft={0}
        borderRight={0}
        borderBottom={0}
        borderColor="#ffffff"
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
              <b>Can I sleep?</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.MuiAccordionDetailroot }}>
            <Typography className={classes.text}>No. Real hackers are hardcore.</Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box
        raised="true"
        border={4}
        borderLeft={0}
        borderRight={0}
        borderBottom={0}
        borderColor="#ffffff"
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
              <b>Are you serious?</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.MuiAccordionDetailroot }}>
            <Typography className={classes.text}>
              Lol no. Sleeping rooms will be set aside for visiting students, although you should
              still bring your own blankets/sleeping bags/plushies/etc. These areas will be
              specified on our website closer to the event and also denoted with signs. Hopkins
              students may return to their dorms to sleep, but may not hack outside of the
              designated HopHacks buildings.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box
        raised="true"
        border={4}
        borderLeft={0}
        borderRight={0}
        borderBottom={0}
        borderColor="#ffffff"
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
              <b>What about the FREE FOOD?</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.MuiAccordionDetailroot }}>
            <Typography className={classes.text}>
              At registration, all participants will be given a wristband which MUST BE VISIBLE when
              you are getting food. If you do not have your wristband, you will not be able to get
              food. Also, we do not like people who come to HopHacks for the free food and then
              leave. We are watching you.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box
        raised="true"
        border={4}
        borderLeft={0}
        borderRight={0}
        borderBottom={0}
        borderColor="#ffffff"
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
              <b>When can I pick up parking passes?</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.MuiAccordionDetailroot }}>
            <Typography className={classes.text}>
              We will distribute parking passes to participants on the Sunday morning of HopHacks.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box border={4} borderLeft={0} borderRight={0} borderBottom={0} borderColor="#ffffff">
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
              <b>Will there be travel reimbursements?</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.MuiAccordionDetailroot }}>
            <Typography className={classes.text}>
              We will not be offering individual travel reimbursements but are sponsoring other
              modes of transportation detailed above.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box
        raised="true"
        border={4}
        borderLeft={0}
        borderRight={0}
        borderColor="#ffffff"
        sx={{ height: '800px' }}
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
              <b>What if I have any other questions? </b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.MuiAccordionDetailroot }}>
            <Typography className={classes.text}>
              You can email us at{' '}
              <a className={classes.link} href="mailto:hophacks@gmail.com">
                hophacks@gmail.com
              </a>
              . Alternatively, you can message us at our{' '}
              <a className={classes.link} href="https://www.instagram.com/hophacks/">
                Instagram
              </a>{' '}
              page and one of our team members will respond accordingly.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
