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

function SponsorItem({ size, children, link = '#sponsors' }) {
  return (
    <a style={{ display: 'table-cell', textDecoration: 'none' }} href={link}>
      <div className="sponsor-wrapper">
        <div className={`sponsor-foreground sponsor-${size} sponsor-children`}>
          {children}
          <div className={`sponsor-background sponsor-${size}`}></div>
        </div>
      </div>
    </a>
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
      <Box display="flex" flexDirection="column">
        <Box display="flex" justifyContent="space-between" className="sponsor-container">
          <SponsorItem size="large" link="https://it.johnshopkins.edu/">
            <img src={img('it.png')} style={{ width: '280px' }} className="sponsor-img" />
          </SponsorItem>
          <SponsorItem size="large" link="https://www.patientsafetytech.com/">
            <img
              src={img('PaitentSafety.gif')}
              style={{ width: '320px' }}
              className="sponsor-img"
            />
          </SponsorItem>
        </Box>
        {/* <Box display="flex" justifyContent="space-between" className="medium-container">
          <SponsorItem size="medium"></SponsorItem>
          <SponsorItem size="medium"></SponsorItem>
          <SponsorItem size="medium"></SponsorItem>
        </Box> */}
        <Box display="flex" className="medium-container">
          <SponsorItem
            size="small"
            link="https://www.stickermule.com/uses/laptop-stickers?utm_source=referral_us&utm_medium=sponsorships_us&utm_campaign=hophacks2023"
          >
            <img src={img('stickerMule.png')} style={{ width: '130px' }} className="sponsor-img" />
          </SponsorItem>
          <SponsorItem size="small" link="https://www.echo3d.com/">
            <img src={img('echo3D.webp')} style={{ width: '130px' }} className="sponsor-img" />
          </SponsorItem>
          {/* <SponsorItem size="small"></SponsorItem>
          <SponsorItem size="small"></SponsorItem> */}
        </Box>
      </Box>
    </Box>
  );
}
