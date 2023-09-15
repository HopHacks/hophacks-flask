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
          <img className="prizeTrackStamp" src={img('FFUNV1.png')} />
          <img className="prizeTrackStamp" src={img('FFUNV2.png')} />
          <img className="prizeTrackStampHidden" src={img('pstcwinner.svg')} />
          <img className="prizeTrackStamp" src={img('BGBTrack1.png')} />
          <img className="prizeTrackStamp" src={img('BGBTrack2.png')} />
          <img className="prizeTrackStampHidden" src={img('pstcwinner.svg')} />
          <img className="prizeTrackStamp" src={img('CBID1.png')} />
          <img className="prizeTrackStamp" src={img('CBID2.png')} />
        </div>
      </div>
      <div>
        <div className="prizeTrackDiv">
          <img className="prizeTrackStamp" src={img('PSW.png')} />
          <img className="prizeTrackStamp" src={img('IAA1.png')} />
          <img className="prizeTrackStampHidden" src={img('pstcwinner.svg')} />
<<<<<<< HEAD
          <img className="prizeTrackStampHidden" src={img('pstcwinner.svg')} />

          <img className="prizeTrackStamp" src={img('FFU1.png')} />
          {/* <img className="prizeTrackStampHidden" src={img('pstcwinner.svg')} /> */}
          <img className="prizeTrackStamp" src={img('FFU2.png')} />
          <img className="prizeTrackStamp" src={img('FFU3.png')} />
=======
          <img className="prizeTrackStamp" src={img('BGB1.png')} />
          <img className="prizeTrackStamp" src={img('BGB2.png')} />
>>>>>>> a95030a809a2d44a4fdb5aaec50a1824b60e676a
        </div>
      </div>
    </>
  );
}
