import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  title: {
    color: '#ffffff',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '375%',
    margin: 'auto'
  },
  platform: {
    margin: 'auto',
    width: '90%'
  },
  prizeStampDiv: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 'auto'
  },
  prizeStamp: {
    width: '33.33%',
    padding: '5px'
  }
});

function img(url) {
  return 'https://hophacks-website.s3.amazonaws.com' + '/images/' + url;
}

export default function Prizes() {
  const classes = useStyles();

  return (
    <Grid container spacing={2} alignItems="center">
      <Typography className={classes.title} variant="h4" gutterBottom>
        Prizes
      </Typography>
      <img src={img('prize2023Fall.PNG')} className={classes.platform} />
      <div className={classes.prizeStampDiv}>
        <img className={classes.prizeStamp} src={img('firstPlace.png')} />
        <img className={classes.prizeStamp} src={img('secondPlace.png')} />
        <img className={classes.prizeStamp} src={img('thirdPlace.png')} />
      </div>
    </Grid>
  );
}
