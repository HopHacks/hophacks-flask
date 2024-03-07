import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';

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

export default function HasTeam() {
  const classes = useStyles();
  const backButton = (
    <Button
      variant="contained"
      style={{ height: '100px', width: '200px', backgroundColor: '#34b4eb' }}
    >
      <h2>Back</h2>
    </Button>
  );
  const text = (
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
      <h2>
        Hi there ____ ! <br></br> it is your first time on the team matching page! <br></br> do you
        already have a team?
      </h2>
    </Typography>
  );

  return (
    <div>
      <Grid>{text}</Grid>
      <Grid>{backButton}</Grid>
    </div>
  );
}
