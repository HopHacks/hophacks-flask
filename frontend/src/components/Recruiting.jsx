import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import '../stylesheets/recruit.css';
import { Box } from '@material-ui/core';

const useStyles = makeStyles({
  margin: {
    marginBottom: '13px'
  },
  title: {
    color: '#7289da',
    fontFamily: 'PT Sans'
  },
  btn_text: {
    color: '#ffffff'
  }
});

export default function Recruiting() {
  const classes = useStyles();
  const isMobile = window.innerWidth < 960;

  const contact = (
    <Grid style={{ alignSelf: 'flex-start', marginBottom: '13px' }}>
      <a href="https://www.facebook.com/HopHacks" title="Facebook">
        <img
          src={'https://hophacks-image.s3.amazonaws.com/fb.png'}
          style={{ width: '30px', margin: '10px 5px 5px' }}
          alt="fb-icon"
        />
      </a>
      <a href="https://www.linkedin.com/company/hophacks/" title="LinkedIn">
        <img
          src={'https://hophacks-image.s3.amazonaws.com/linkedin.png'}
          style={{ width: '30px', margin: '10px 5px 5px' }}
          alt="linkedin-icon"
        />
      </a>
      <a href="https://www.instagram.com/hophacks/?hl=en" title="Instagram">
        <img
          src={'https://hophacks-image.s3.amazonaws.com/ins.png'}
          style={{ width: '30px', margin: '10px 5px 5px' }}
          alt="linkedin-icon"
        />
      </a>
    </Grid>
  );

  const whatContent = (
    <Card class="card">
      <CardContent>
        <Typography className={classes.title} variant="h4" gutterBottom>
          What is HopHacks?
        </Typography>
        <Typography>
          HopHacks is the original student-run hackathon at Johns Hopkins University, running since
          Fall 2013! A hackathon is an event where students get together in groups to work on a
          software or hardware project over the course of a few days and present their work at the
          end of the event. Each group then submits their project to a panel of judges who award
          prizes based on different categories. This event is open to students of all skill levels
          and coding experience, so we encourage you to participate even if you are new to these
          types of events!
        </Typography>
      </CardContent>
    </Card>
  );

  const whyContent = (
    <Card class="card">
      <CardContent>
        <Typography className={classes.title} variant="h4" gutterBottom>
          Why should I join?
        </Typography>
        <Typography>
          <p>
            Have you ever wanted to see the chaos behind organizing a hackathon? Now you can apply
            to be part of the team behind HopHacks. We are a team of diverse majors who are
            passionate about student innovation. We believe our hackathon helps students of all
            backgrounds learn more about computer science, as well as giving an opportunity for
            seasoned coders to show off their talents. Within HopHacks, we also foster a sense of
            community with each other and develop strong friendships that last for years after
            leaving Hopkins.
          </p>

          <p>
            There are also industry benefits for being an organizer. You&apos;ll get access to a
            large network of companies for internships and full time jobs, and meet many of our
            sponsor representatives during the event. Many of our organizers go on to work at the
            most respected tech companies out there.
          </p>

          <p>
            Come to our events to learn more about what we do and what you can bring to HopHacks.{' '}
            <b>We welcome all majors</b>, so you don&apos;t need to be a computer science major to
            be part of our team!
          </p>
        </Typography>
      </CardContent>
    </Card>
  );

  if (isMobile) {
    return (
      <Box align="center" style={{ paddingTop: '5%' }}>
        <Grid container direction="row" alignItems="center" justifyContent="center">
          <Grid item xs={12} align="center">
            <img src={'https://hophacks-image.s3.amazonaws.com/hop.png'} width="70%" />
          </Grid>
          <Grid item xs={12} align="center">
            <img
              src={'https://hophacks-image.s3.amazonaws.com/HOPHACKS_2024.png'}
              width="70%"
              style={{ marginBottom: '5%' }}
            />
          </Grid>
          <Grid item xs={12} align="center">
            <img src={'https://hophacks-image.s3.amazonaws.com/hopline2.png'} width="70%" />
          </Grid>
          <Grid item xs={12} align="center">
            {contact}
          </Grid>
        </Grid>
        <Box class="card-button" style={{ width: '20%' }}>
          <a href="https://forms.gle/r6UAhi65JjzeuT656" style={{ textDecoration: 'none' }}>
            <Typography className={classes.btn_text} variant="h4" gutterBottom>
              Interest Form
            </Typography>
          </a>
        </Box>
        <Grid container direction="row" alignItems="flex-start">
          <Grid item xs={12} align="center">
            {whatContent}
          </Grid>
          <Grid item xs={12} align="center">
            {whyContent}
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box align="center" style={{ paddingTop: '5%' }}>
      <Grid container direction="row" alignItems="center" justifyContent="center">
        <Grid item xs={3} align="center">
          {' '}
        </Grid>
        <Grid item xs={2} align="center">
          <img src={'https://hophacks-image.s3.amazonaws.com/hop.png'} width="70%" />
        </Grid>
        <Grid item xs={4}>
          <img
            src={'https://hophacks-image.s3.amazonaws.com/HOPHACKS_2024.png'}
            width="70%"
            style={{ marginBottom: '5%' }}
          />
          <img src={'https://hophacks-image.s3.amazonaws.com/hopline2.png'} width="70%" />
          {contact}
        </Grid>
        <Grid item xs={3} align="center">
          {' '}
        </Grid>
      </Grid>
      <Box class="card-button" style={{ width: '20%' }}>
        <a href="https://forms.gle/r6UAhi65JjzeuT656" style={{ textDecoration: 'none' }}>
          <Typography className={classes.btn_text} variant="h4" gutterBottom>
            Interest Form
          </Typography>
        </a>
      </Box>
      <Grid container direction="row" alignItems="flex-start">
        <Grid item xs={6} align="center">
          {whatContent}
        </Grid>
        <Grid item xs={6} align="center">
          {whyContent}
        </Grid>
      </Grid>
    </Box>
  );
}
