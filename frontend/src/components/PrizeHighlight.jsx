import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

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

export default function PrizeHighlight() {
  const classes = useStyles();
  const prizeSample = (
    <Typography className={classes.title}>
      <h2>Track/Prize: Teamname</h2>
      <h3>Description and more details</h3>
    </Typography>
  );

  return (
    <Grid container>
      <Grid container xs={8} sm={8} md={8}>
        {/* for pictures */}
        <Grid item sm={10}>
          <img
            src={'https://hophacks-image.s3.amazonaws.com/hop.png'}
            style={{ width: '200px', margin: '1px 250px 5px', justifyContent: 'center' }}
          />
        </Grid>
        <Grid item sm={3}>
          <img
            src={'https://hophacks-image.s3.amazonaws.com/hop.png'}
            style={{ width: '150px', margin: '1px 50px 5px' }}
          />
        </Grid>
        <Grid item sm={3}>
          <img
            src={'https://hophacks-image.s3.amazonaws.com/hop.png'}
            style={{ width: '150px', margin: '1px 50px 5px' }}
          />
        </Grid>
        <Grid item sm={3}>
          <img
            src={'https://hophacks-image.s3.amazonaws.com/hop.png'}
            style={{ width: '150px', margin: '1px 50px 5px' }}
          />
        </Grid>
        <Grid item sm={10}>
          <img
            src={'https://hophacks-image.s3.amazonaws.com/hop.png'}
            style={{ width: '150px', margin: '1px 250px 5px', justifyContent: 'center' }}
          />
        </Grid>
      </Grid>
      <Grid container xs={4} sm={4} md={4}>
        {/* for prize descriptions */}
        <Grid item lg={8}>
          {prizeSample}
        </Grid>
        <Grid item lg={8}>
          {prizeSample}
        </Grid>
        <Grid item lg={8}>
          {prizeSample}
        </Grid>
        <Grid item lg={8}>
          {prizeSample}
        </Grid>
      </Grid>
    </Grid>
  );
}
