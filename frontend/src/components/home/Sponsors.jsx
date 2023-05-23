import React from 'react';

import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  title: {
    fontFamily: 'Inter',
    textAlign: 'center',
    fontSize: '3rem',
    marginTop: '2rem'
  },
  contact: {
    fontFamily: 'Inter',
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: '0.9rem',
    margin: '0.5rem'
  }
});

function SponsorItem({ size, foreground, background, children }) {
  return (
    <div className="sponsor-wrapper">
      <div className={`sponsor-foreground sponsor-${foreground} sponsor-${size}`}>
        {children}
        <div className={`sponsor-background sponsor-${background} sponsor-${size}`}></div>
      </div>
    </div>
  );
}

export default function Sponsors() {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      marginTop={'7.5rem'}
      justifyContent="center"
      className="sponsor-container"
      id="sponsors"
    >
      <SponsorItem size="xl" foreground="light" background="dark">
        <div className={classes.title}>Sponsors</div>
        <div className={classes.contact}>Interested in sponsoring us?</div>
        <div className={classes.contact}>
          Email us at <a href={`mailto:hophacks.sponsors@gmail.com`}>hophacks.sponsors@gmail.com</a>
        </div>
      </SponsorItem>
      <img
        id="hop-logo"
        src={`https://hophacks-website.s3.amazonaws.com/images/logo-artists.PNG`}
        width="40%"
      />
      {/* logo-artists.PNG */}
      {/* <Box display="flex" flexDirection="column">
        <Box display="flex" justifyContent="space-between" className="sponsor-container">
          <SponsorItem size="large" foreground="light" background="dark"></SponsorItem>
          <SponsorItem size="large" foreground="dark" background="light"></SponsorItem>
        </Box>
        <Box display="flex" justifyContent="space-between" className="medium-container">
          <SponsorItem size="medium" foreground="dark" background="light"></SponsorItem>
          <SponsorItem size="medium" foreground="light" background="dark"></SponsorItem>
          <SponsorItem size="medium" foreground="dark" background="light"></SponsorItem>
        </Box>
        <Box display="flex" justifyContent="space-between" className="medium-container">
          <SponsorItem size="small" foreground="light" background="dark"></SponsorItem>
          <SponsorItem size="small" foreground="dark" background="light"></SponsorItem>
          <SponsorItem size="small" foreground="light" background="dark"></SponsorItem>
          <SponsorItem size="small" foreground="dark" background="light"></SponsorItem>
        </Box>
      </Box> */}
    </Box>
  );
}
