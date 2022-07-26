import React from 'react';
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import { Typography } from "@material-ui/core";
import './../stylesheets/home.css'

const Footer = function Footer(props) {
    function img(url) {
        return process.env.PUBLIC_URL + '/images/footer/' + url;
    }

    return (

        <Box pt={5} bgcolor="#FFC0CB" color="white">
            <Container maxWidth="lg">
                <Grid container spacing={5}>

                    <Grid item xs={12} sm={2}>
                        <img src={img('bluejay-icon.png')} style={{ width: "100px" }} />
                    </Grid>

                    <Grid item xs={6} sm={3}>

                        <Grid container>
                            <Typography style={{ fontSize: 18 }}>
                                <a href="mailto:hophacks2022@gmail.com" style={{ textDecoration: 'none', color: 'white' }}>hophacks2022@gmail.com</a>
                            </Typography>
                        </Grid>
                        <Grid container><Typography style={{ fontSize: 18 }}>Malone Hall</Typography></Grid>
                        <Grid container><Typography style={{ fontSize: 18 }}>Johns Hopkins University</Typography></Grid>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <Grid container><Typography style={{ fontFamily: "vcrOsdMono,arial,helvetica,sans-serif", fontSize: 20 }}>Follow Us</Typography></Grid>
                        <Grid container>
                            <Grid item>
                                <a href="https://www.facebook.com/HopHacks" title="Facebook">
                                    <img src={img('fb-icon.png')} style={{ width: "40px", margin: "10px 5px 5px" }} alt="fb-icon" />
                                </a>
                            </Grid>
                            <Grid item>
                                <a href="https://www.linkedin.com/company/hophacks/" title="Facebook">
                                    <img src={img('linkedin-icon.png')} style={{ width: "40px", margin: "10px 5px 5px" }} alt="linkedin-icon" />
                                </a>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>

    );
};

export default Footer;