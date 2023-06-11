import React from 'react';

import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';

function img(url) {
  return 'https://hophacks-website.s3.amazonaws.com/images/sponsor/png/' + url;
}

const useStyles = makeStyles({
  title: {
    fontFamily: 'Inter',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '3rem',
    margin: '2rem',
    color: 'rgba(247, 243, 255, 1)'
  },
  contact: {
    fontFamily: 'Inter',
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: '1rem',
    margin: '0.5rem',
    color: 'rgba(247, 243, 255, 1)'
  }
});

function SponsorItem({ size, children }) {
  return (
    <div className="sponsor-wrapper">
      <div className={`sponsor-foreground sponsor-${size} sponsor-children`}>
        {children}
        <div className={`sponsor-background sponsor-${size}`}></div>
      </div>
    </div>
  );
}

export default function Sponsors() {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      marginTop={'10rem'}
      justifyContent="center"
      className="sponsor-container"
      id="sponsors"
    >
      <SponsorItem size="xl">
        <div style={{ paddingTop: '15px' }}>
          <div className={classes.title}>Sponsors</div>
          <div className={classes.contact}>Interested in sponsoring us?</div>
          <div className={classes.contact}>Email us at </div>
          <div className={classes.contact}>
            <a className={classes.contact} href={`mailto:hophacks.sponsors@gmail.com`}>
              hophacks.sponsors@gmail.com
            </a>
          </div>
        </div>
      </SponsorItem>
      {/* <img
        id="hop-logo"
        src={`https://hophacks-website.s3.amazonaws.com/images/logo-artists.PNG`}
        width="40%"
      /> */}
      {/* logo-artists.PNG */}
      <Box display="flex" flexDirection="column">
        <Box display="flex" justifyContent="space-between" className="sponsor-container">
          <SponsorItem size="large">
            <img src={img('it_bg.png')} style={{ width: '280px' }} className="sponsor-img" />
          </SponsorItem>
          <SponsorItem size="large">
            <img src={img('PaitentSafety.gif')} style={{ width: '320px' }} />
          </SponsorItem>
        </Box>
        {/* <Box display="flex" justifyContent="space-between" className="medium-container">
          <SponsorItem size="medium"></SponsorItem>
          <SponsorItem size="medium"></SponsorItem>
          <SponsorItem size="medium"></SponsorItem>
        </Box> */}
        <Box display="flex" className="medium-container">
          <SponsorItem size="small">
            <img src={img('stickerMule.jpg')} style={{ width: '140px' }} className="sponsor-img" />
          </SponsorItem>
          <SponsorItem size="small">
            <img src={img('echo3D.webp')} style={{ width: '140px' }} className="sponsor-img" />
          </SponsorItem>
          {/* <SponsorItem size="small"></SponsorItem>
          <SponsorItem size="small"></SponsorItem> */}
        </Box>
      </Box>
    </Box>
  );
}
