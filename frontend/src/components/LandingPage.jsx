import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import Footer from './Footer';

const useStyles = makeStyles({
  margin: {
    marginBottom: '20px'
  },
  title: {
    color: '#000000',
    fontFamily: 'PT Sans'
  },
  button: {
    color: '#841584'
  },
  btn_text: {
    color: '#ffffff'
  }
});

export default function LandingPage1() {
  const classes = useStyles();
  const title = (
    <Typography
      className={classes.title}
      variant="h3"
      gutterBottom
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}
    >
      <h2>HopHacks 2024 Coming Soon!</h2>
    </Typography>
  );
  const content = (
    <Typography
      className={classes.title}
      variant="h4"
      gutterBottom
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}
    >
      <h4>
        While we wait for HopHacks 2024, check <br></br> out some highlights from past years!
      </h4>
    </Typography>
  );

  const year2023 = (
    <Button
      variant="contained"
      style={{ height: '100px', width: '250px', backgroundColor: '#34b4eb' }}
    >
      <Typography variant="h3">2023</Typography>
    </Button>
  );
  const year2022 = (
    <Button
      variant="contained"
      style={{ height: '100px', width: '250px', backgroundColor: '#34b4eb' }}
      color="blue"
    >
      <Typography variant="h3" color="blue">
        2022
      </Typography>
    </Button>
  );
  const year2021 = (
    <Button
      variant="contained"
      style={{ height: '100px', width: '250px', backgroundColor: '#34b4eb' }}
      color="blue"
    >
      <Typography variant="h3">2021</Typography>
    </Button>
  );

  return (
    //We should refactor this into separate importable components if we have time
    //But this is fine for now
    <div>
      <div className="hero">
        <Grid
          container
          spacing={0}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Grid item xs={8} md={8}>
            {title}
          </Grid>
          <Grid item xs={8} md={8}>
            {content}
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <img
              src={'https://hophacks-image.s3.amazonaws.com/hop.png'}
              style={{ width: '200px', margin: '1px 100px 5px' }}
            />
          </Grid>
          <Grid item xs={8} md={8}>
            <Grid
              container
              spacing={12}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'right',
                marginBottom: '13px'
              }}
            >
              <Grid item xs={4} md={3}>
                {year2023}
              </Grid>
              <Grid item xs={4} md={3}>
                {year2022}
              </Grid>
              <Grid item xs={4} md={3}>
                {year2021}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className="2023">
        <h1>HOPHACKS 2023</h1>
        <h1>SEPTEMBER 15-17</h1>
        <a href="https://hophacks.devpost.com">
          <h3>View the Devpost</h3>
        </a>
      </div>
      <Footer />
    </div>
  );
}
