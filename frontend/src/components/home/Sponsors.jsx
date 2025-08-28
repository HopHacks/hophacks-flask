import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
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
    marginBottom: '20px', // spacing between rows
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
    large: { width: '520px', height: '220px' }, // Bloomberg / Marshall Wace
    medium: { width: '360px', height: '180px' }, // SpacetimeDB / Orcava / Pilgrim / Commure
    small: { width: '300px', height: '160px' } // Others
  };

  return (
    <div className={classes.root}>
      <div className="hero">
        <Box display="flex" className="sponsor-title">
          <div className={classes.title}>Sponsors</div>
        </Box>
        <Typography
          className={classes.divFont}
          style={{ color: 'rgba(6, 26, 64, 1)', fontWeight: 'bold', fontStyle: 'italic' }}
        >
          Interested in sponsoring HopHacks? Email us at
          <a className={classes.contact} href={`mailto:hophacks.sponsors@gmail.com`}>
            hophacks.sponsors@gmail.com
          </a>
        </Typography>

        <Grid
          container
          spacing={3}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Row 1 — Bloomberg (single large centered) */}
          <Grid container spacing={3} className={classes.gridRow}>
            <Grid item>
              <SponsorBox
                size={sizes.large}
                borderColor="#F8B92A"
                imageUrl={img('sponsors-2025/bloomberg.png')}
              />
            </Grid>
          </Grid>

          {/* Row 2 — Marshall Wace (single centered) */}
          <Grid container spacing={3} className={classes.gridRow}>
            <Grid item>
              <SponsorBox
                size={sizes.large}
                borderColor="#F8B92A"
                imageUrl={img('sponsors-2025/marshall_wace.png')}
              />
            </Grid>
          </Grid>

          {/* Row 3 — SpacetimeDB (left) & circular mark (right) */}
          <Grid container spacing={3} className={classes.gridRow}>
            <Grid item>
              <SponsorBox
                size={sizes.medium}
                borderColor="#23580A"
                imageUrl={img('sponsors-2025/spacetimedb.png')}
              />
            </Grid>
            <Grid item>
              <SponsorBox
                size={sizes.medium}
                borderColor="#23580A"
                imageUrl={img('sponsors-2025/orcava.png')}
              />
            </Grid>
          </Grid>

          {/* Row 4 — commure (left) & PILGRIM (right) */}
          <Grid container spacing={3} className={classes.gridRow}>
            <Grid item>
              <SponsorBox
                size={sizes.medium}
                borderColor="#1D539F"
                imageUrl={img('sponsors-2025/commure.png')}
              />
            </Grid>
            <Grid item>
              <SponsorBox
                size={sizes.medium}
                borderColor="#1D539F"
                imageUrl={img('sponsors-2025/pilgrim.png')}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} className={classes.gridRow}>
            <Grid item>
              <SponsorBox
                size={sizes.small}
                borderColor="#E73427"
                imageUrl={img('sponsors-2025/small_1.png')}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} className={classes.gridRow}>
            <Grid item>
              <SponsorBox
                size={sizes.small}
                borderColor="#E73427"
                imageUrl={img('sponsors-2025/small_2.png')}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} className={classes.gridRow}>
            <Grid item>
              <SponsorBox
                size={sizes.small}
                borderColor="#E73427"
                imageUrl={img('sponsors-2025/small_3.png')}
              />
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
