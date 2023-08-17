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
    color: 'rgba(247, 243, 255, 1)',
    margin: '0 2rem'
  },
  contact: {
    fontFamily: 'Inter',
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: '1rem',
    margin: '0.5rem',
    color: '#F7F3FF'
  }
});

function SponsorItem({ size, logo, width = '85%', link = '#sponsors' }) {
  return (
    <a style={{ display: 'table-cell', textDecoration: 'none' }} href={link}>
      <div className="sponsor-wrapper">
        <div className={`sponsor-foreground sponsor-${size} sponsor-children`}>
          <img src={img(logo)} style={{ width }} className="sponsor-img" />
          <div className={`sponsor-background sponsor-${size}`}></div>
        </div>
      </div>
    </a>
  );
}

export default function Sponsors() {
  const classes = useStyles();

  return (
    <Box marginTop={'10rem'} justifyContent="center" className="sponsor-container" id="sponsors">
      <Box display="flex" className="sponsor-title">
        <div className={classes.title}>Sponsors</div>
        <div className={classes.contact}>
          Interested in sponsoring us? Email us at
          <a className={classes.contact} href={`mailto:hophacks.sponsors@gmail.com`}>
            hophacks.sponsors@gmail.com
          </a>
        </div>
      </Box>
      <div className="sponsor-row">
        <SponsorItem logo="it.png" size="sable" link="https://it.johnshopkins.edu/" />
        <SponsorItem
          logo="bgb-white.png"
          size="gold"
          link="https://www.bgbgroup.com/"
          width="95%"
        />
        <SponsorItem
          logo="PatientSafety.png"
          size="sable"
          link="https://www.patientsafetytech.com/"
        />
      </div>
      <div className="sponsor-row">
        <SponsorItem logo="twilio.png" size="sable" link="https://www.twilio.com/en-us" />
        <SponsorItem logo="scm.svg" size="sable" link="https://www.scm-lp.com/" />
        <SponsorItem logo="cbid.png" size="lab" link="https://cbid.bme.jhu.edu/" />
      </div>
      <div className="sponsor-row">
        <SponsorItem logo="jhuiaa.webp" size="lab" link="https://iaa.jhu.edu/" />
        <SponsorItem
          logo="jhmi_tic.png"
          size="blue"
          link="https://www.hopkinsmedicine.org/technology_innovation/"
          width="70%"
        />
        <SponsorItem logo="jhucs.png" size="blue" link="https://www.cs.jhu.edu/" width="80%" />

        <SponsorItem logo="jhume.jpg" size="blue" link="https://me.jhu.edu/" width="94%" />
      </div>
      <div className="sponsor-row">
        <SponsorItem logo="tunnel.svg" size="blue" link="https://tunnel.dev/" width="85%" />
        <SponsorItem logo="jhuapl.png" size="blue" link="https://www.jhuapl.edu/" width="120%" />

        <SponsorItem logo="GCP.png" size="inkind" link="https://cloud.google.com" width="60%" />
        <SponsorItem logo="wolfram.png" size="inkind" link="https://www.wolframalpha.com/" />
      </div>
      <div className="sponsor-row">
        <SponsorItem
          logo="stickerMule.png"
          size="inkind"
          link="https://www.stickermule.com/uses/laptop-stickers?utm_source=referral_us&utm_medium=sponsorships_us&utm_campaign=hophacks2023"
        />
        <SponsorItem
          logo="leading_learners.jpeg"
          size="inkind"
          link="https://www.leading-learners.com/"
          width="40%"
        />
        <SponsorItem logo="verbwire.svg" size="inkind" link="https://www.verbwire.com/" />
        <SponsorItem logo="echo3D.webp" size="inkind" link="https://www.echo3d.com/" />
        <SponsorItem
          logo="ffu.png"
          size="inkind"
          link="https://ventures.jhu.edu/programs-services/fastforward-u/"
        />
      </div>
    </Box>
  );
}
