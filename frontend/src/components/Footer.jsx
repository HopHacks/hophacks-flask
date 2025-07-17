import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import './../stylesheets/home.css';

const Footer = function Footer() {
  function img(url) {
    return 'https://hophacks-website.s3.amazonaws.com' + '/images/' + url;
  }

  return (
    <Box pt={5} bgcolor="#172745" color="white">
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Grid container direction="column" alignItems="center" justifyContent="center">
              <img src={img('Hophacks_logo_clean.png')} style={{ width: '100px' }} />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid container direction="column" alignItems="center" justifyContent="center">
              <Typography style={{ fontFamily: 'Inter', fontSize: 18 }}>
                <a
                  href="mailto:hophacks@gmail.com"
                  style={{ textDecoration: 'none', color: 'white' }}
                >
                  hophacks@gmail.com
                </a>
              </Typography>
            </Grid>
            <Grid container direction="column" alignItems="center" justifyContent="center">
              <Typography style={{ fontFamily: 'Inter', fontSize: 18 }}>Malone Hall</Typography>
            </Grid>
            <Grid container direction="column" alignItems="center" justifyContent="center">
              <Typography style={{ fontFamily: 'Inter', fontSize: 18 }}>
                Johns Hopkins University
              </Typography>
            </Grid>
            <Grid container direction="column" alignItems="center" justifyContent="center">
              <Typography style={{ fontFamily: 'Inter', fontSize: 18 }}>
                <a
                  href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
                  style={{ textDecoration: 'none', color: '#51A5F7' }}
                >
                  MLH Code of Conduct
                </a>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid container direction="column" alignItems="center" justifyContent="center">
              <Typography style={{ fontFamily: 'Inter', fontSize: 20 }}>Follow Us</Typography>
              <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <a href="https://www.facebook.com/HopHacks" title="Facebook">
                  <img
                    src={img('footer/fb-icon.png')}
                    style={{ width: '40px', marginRight: '10px' }}
                    alt="fb-icon"
                  />
                </a>
                <a href="https://www.linkedin.com/company/hophacks/" title="LinkedIn">
                  <img
                    src={img('footer/linkedin-icon.png')}
                    style={{ width: '40px', marginRight: '10px' }}
                    alt="linkedin-icon"
                  />
                </a>
                <a href="https://www.instagram.com/hophacks/?hl=en" title="Instagram">
                  <img
                    src={img('footer/instagram-icon.png')}
                    style={{ width: '40px' }}
                    alt="instagram-icon"
                  />
                </a>
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
