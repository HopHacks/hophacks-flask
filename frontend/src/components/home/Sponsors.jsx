import React from 'react';
// import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  root: {
    marginTop: '50px' // Space above the entire component
  },
  sponsorTitle: {
    fontSize: '3rem',
    color: '#061a40',
    fontFamily: 'Inter',
    fontWeight: 'bold'
  },
  title: {
    fontSize: '3rem',
    color: '#061a40',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: '30px' // Space below the title box
  },
  contact: {
    fontFamily: 'Inter',
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: '1rem',
    margin: '0.5rem',
    color: '#1D539F',
    marginBottom: '40px' // Space below the title box
  },
  comingSoon: {
    fontFamily: 'Inter',
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: '1.5rem',
    margin: '0.5rem',
    color: '#1D539F'
  },
  sponsorBox: {
    width: '250px',
    height: '250px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    borderRadius: '5px',
    overflow: 'hidden',
    position: 'relative',
    border: '20px solid'
  },
  sponsorImage: {
    maxWidth: '80%',
    maxHeight: '80%',
    objectFit: 'contain'
  },
  labelText: {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  gridRow: {
    marginBottom: '20px', // Adjust this value to set the spacing between rows
    justifyContent: 'center' // Center the grid items
  }
});

function SponsorBox({ imageUrl, borderColor, size }) {
  const classes = useStyles();

  return (
    <div
      className={classes.sponsorBox}
      style={{
        backgroundColor: '#cbc2cb',
        borderColor,
        width: size.width,
        height: size.height
      }}
    >
      <img src={imageUrl} className={classes.sponsorImage} alt="sponsor" />
    </div>
  );
}

export default function Sponsors() {
  const classes = useStyles();
  function img(url) {
    return 'https://hophacks-website.s3.amazonaws.com' + '/images/' + url;
  }
  const sizes = {
    gold: { width: '400px', height: '300px' },
    sable: { width: '270px', height: '270px' },
    blue: { width: '220px', height: '200px' },
    starter: { width: '150px', height: '150px' }
  };
  return (
    <div className={classes.root}>
      <div className="hero">
        <Box display="flex" className="sponsor-title">
          <div className={classes.title}>Sponsors</div>
          <div className={classes.contact}>
            Interested in sponsoring us? Email us at
            <a className={classes.contact} href={`mailto:hophacks.sponsors@gmail.com`}>
              hophacks.sponsors@gmail.com
            </a>
          </div>
        </Box>
        {/* <div className={classes.comingSoon}>Coming Soon!</div> */}
        <Grid
          container
          spacing={3}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Gold Sponsors */}
          <Grid container spacing={3} className={classes.gridRow}>
            {/* <Grid item xs={12} md={2}>
              <Typography variant="h4" style={{ color: '#F8B92A' }}>
                GOLD
              </Typography>
            </Grid> */}
            <Grid item>
              <SponsorBox
                size={sizes.gold}
                backgroundColor="#D9D9D9"
                borderColor="#F8B92A"
                imageUrl={img('sponsor/png/marshall_wace.png')}
              />
            </Grid>
            <Grid item>
              <SponsorBox
                size={sizes.gold}
                backgroundColor="#F8B92A"
                borderColor="#F8B92A"
                imageUrl={img('sponsor/png/bloomberg_hori.png')}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} className={classes.gridRow}>
            {/* <Grid item xs={12} md={2}>
              <Typography variant="h4" style={{ color: '#23580A' }}>
                SABLE
              </Typography>
            </Grid> */}
            <Grid item>
              <SponsorBox
                size={sizes.blue}
                backgroundColor="#1D539F"
                borderColor="#1D539F"
                imageUrl={img('sponsor/png/cbid.png')}
              />
            </Grid>
            <Grid item>
              <SponsorBox
                size={sizes.blue}
                backgroundColor="#1D539F"
                borderColor="#1D539F"
                imageUrl={img('sponsor/png/apl_hori.png')}
              />
            </Grid>
            <Grid item>
              <SponsorBox
                size={sizes.sable}
                backgroundColor="#23580A"
                borderColor="#23580A"
                imageUrl={img('sponsor/png/it_hori.png')}
              />
            </Grid>
            <Grid item>
              <SponsorBox
                size={sizes.blue}
                backgroundColor="#1D539F"
                borderColor="#1D539F"
                imageUrl={img('sponsor/png/scm_hori_bg.png')}
              />
            </Grid>
            <Grid item>
              <SponsorBox
                size={sizes.blue}
                backgroundColor="#1D539F"
                borderColor="#1D539F"
                imageUrl={img('sponsor/png/pst.png')}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} className={classes.gridRow}>
            <Grid item>
              <SponsorBox
                size={sizes.starter}
                backgroundColor="#E73427"
                borderColor="#E73427"
                imageUrl={img('sponsor/png/jhfcu.png')}
              />
            </Grid>
            <Grid item>
              <SponsorBox
                size={sizes.starter}
                backgroundColor="#E73427"
                borderColor="#E73427"
                imageUrl={img('sponsor/png/ffu.png')}
              />
            </Grid>
            <Grid item>
              <SponsorBox
                size={sizes.blue}
                backgroundColor="#1D539F"
                borderColor="#1D539F"
                imageUrl={img('sponsor/png/jhuaa.png')}
              />
            </Grid>
            <Grid item>
              <SponsorBox
                size={sizes.blue}
                backgroundColor="#1D539F"
                borderColor="#1D539F"
                imageUrl={img('sponsor/png/jhu_cs.png')}
              />
            </Grid>
            <Grid item>
              <SponsorBox
                size={sizes.starter}
                backgroundColor="#E73427"
                borderColor="#E73427"
                imageUrl={img('sponsor/png/cards_against_humanity.png')}
              />
            </Grid>

            <Grid item>
              <SponsorBox
                size={sizes.starter}
                backgroundColor="#E73427"
                borderColor="#E73427"
                imageUrl={img('sponsor/png/red_bull.png')}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} className={classes.gridRow}>
            <Grid item>
              <SponsorBox
                size={sizes.starter}
                backgroundColor="#E73427"
                borderColor="#E73427"
                imageUrl={img('sponsor/png/palantir.png')}
              />
            </Grid>
          </Grid>

          {/* Starter Sponsors */}
          <Grid container spacing={3} className={classes.gridRow}>
            {/* <Grid item xs={12} md={2}>
              <Typography variant="h4" style={{ color: '#E73427' }}>
                STARTER
              </Typography>
            </Grid> */}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
