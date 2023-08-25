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
    width: '70%'
  }
});

function img(url) {
  return 'https://hophacks-website.s3.amazonaws.com' + '/images/' + url;
}

export default function Prizes() {
  const classes = useStyles();

  return (
    <>
      <Grid container spacing={2} alignItems="center" id="prizes">
        <Typography className={classes.title} variant="h3" gutterBottom>
          Prizes
        </Typography>
        <div style={{ textAlign: 'center' }}>
          <img src={img('prize2023Fall.PNG')} className={classes.platform} />
        </div>
        <div className="prizeStampDiv">
          <img className="prizeStamp" src={img('1st.svg')} />
          <img className="prizeStamp" src={img('2nd.svg')} />
          <img className="prizeStamp" src={img('3rd.svg')} />
        </div>
      </Grid>
      <div>
        <div className="prizeTrackDiv">
          <img className="prizeTrackStamp" src={img('ffuventure1st.svg')} />
          <img className="prizeTrackStamp" src={img('ffuventure2nd.svg')} />
          <img className="prizeTrackStampHidden" src={img('pstcwinner.svg')} />
          <img className="prizeTrackStamp" src={img('pstcwinner.svg')} />
          <img className="prizeTrackStampHidden" src={img('pstcwinner.svg')} />
          <img className="prizeTrackStamp" src={img('ffudesign1st.svg')} />
          <img className="prizeTrackStamp" src={img('ffudesign2nd.svg')} />
        </div>
      </div>
    </>
  );
}
