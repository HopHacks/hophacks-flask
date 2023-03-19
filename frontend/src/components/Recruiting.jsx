import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Team from './home/Team';
import Sponsors from './home/Sponsors';
import Prizes from './home/Prizes';
import Schedule from './home/Schedule';
import { ParallaxBanner } from 'react-scroll-parallax';

import '../stylesheets/home.css';

const useStyles = makeStyles({
  logo: {
    top: '25%',
    width: '60vw', // This is centered, 20 - 60 - 20
    left: '20vw',
    position: 'absolute',
    textAlign: 'center',
  },
  margin: {
    marginBottom: '13px',
  },
  color: {
    backgroundColor: '#eef7ff',
  },
  title: {
    color: '#7289da',
    fontFamily: 'PT Sans',
  },

  button: {
    backgroundColor: '#FFFFFF',
    color: '#c8e7fa',
    width: '50%',
    minHeight: '50px',
    border: '4px solid',
    '&:hover': {
      backgroundColor: '#c8e7fa',
    },
  },
});

export default function Recruiting() {
  const classes = useStyles();

  return (
    <div>
      <a
        id="mlh-trust-badge"
        style={{
          display: 'block',
          maxWidth: '100px',
          minWidth: '60px',
          position: 'fixed',
          right: '30px',
          top: '0',
          width: '10%',
          zIndex: '10000',
        }}
        href="https://mlh.io/seasons/2022/events?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2022-season&utm_content=gray"
        target="_blank"
      >
        <img
          src="https://s3.amazonaws.com/logged-assets/trust-badge/2022/mlh-trust-badge-2022-gray.svg"
          alt="Major League Hacking 2022 Hackathon Season"
          style={{ width: '100%' }}
        ></img>
      </a>

      <Container fixed>
        <Box py={2}>
          <Card>
            <CardContent>
              <Typography className={classes.title} variant="h4" gutterBottom>
                What is HopHacks?
              </Typography>
              <Typography>
                HopHacks is the original student-run hackathon at Johns Hopkins
                University, running since Fall 2013! A hackathon is an event
                where students get together in groups to work on a software or
                hardware project over the course of a few days and present their
                work at the end of the event. Each group then submits their
                project to a panel of judges who award prizes based on different
                categories. This event is open to students of all skill levels
                and coding experience, so we encourage you to participate even
                if you are new to these types of events!
              </Typography>
            </CardContent>

            <CardContent>
              <Typography className={classes.title} variant="h4" gutterBottom>
                Why should I join?
              </Typography>
              <Typography>
                <p>
                  Have you ever wanted to see the chaos behind organizing a
                  hackathon? Now you can apply to be part of the team behind
                  HopHacks. We are a team of diverse majors who are passionate
                  about student innovation. We believe our hackathon helps
                  students of all backgrounds learn more about computer science,
                  as well as giving an opportunity for seasoned coders to show
                  off their talents. Within HopHacks, we also foster a sense of
                  community with each other and develop strong friendships that
                  last for years after leaving Hopkins.
                </p>

                <p>
                  There are also industry benefits for being an organizer.
                  You'll get access to a large network of companies for
                  internships and full time jobs, and meet many of our sponsor
                  representatives during the event. Many of our organizers go on
                  to work at the most respected tech companies out there.
                </p>

                <p>
                  Come to our events to learn more about what we do and what you
                  can bring to HopHacks. <b>We welcome all majors</b>, so you
                  don't need to be a computer science major to be part of our
                  team!
                </p>
              </Typography>
            </CardContent>

            <CardContent>
              <Typography className={classes.title} variant="h5" gutterBottom>
                <a
                  className="link-text"
                  href="https://forms.gle/Znzy2aFq7Bwwx7P4A"
                >
                  Application Form
                </a>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </div>
  );
}
