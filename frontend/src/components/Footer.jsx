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
        <Box pt={5} bgcolor="#8a98a8" color="white">
        <Container maxWidth="lg">
            <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                    <Grid container><Typography style={{fontFamily: "vcrOsdMono,arial,helvetica,sans-serif", fontSize: 20}}>Hackathon Info</Typography></Grid>
                    <Grid container>
                        <Typography style={{fontSize: 16}}>
                        To contact us, please email&nbsp;
                        <a href="mailto:hophacks@gmail.com">hophacks@gmail.com</a>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Grid container><Typography style={{fontFamily: "vcrOsdMono,arial,helvetica,sans-serif", fontSize: 20}}>Contacts</Typography></Grid>
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
                        <Grid item>
                            <a href="\" title="Discord">
                                <img src={img('discord-icon.png')} style={{ width: "40px", margin: "10px 5px 5px" }} alt="discord-icon" />
                            </a>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Box textAlign="center" pt={{xs: 5, sm: 5}} pb={{xs: 5, sm: 2}}>
                <Typography style={{fontSize: 14}}>HopHacks &reg; {new Date().getFullYear()}</Typography>
            </Box>
        </Container>
        </Box>  
    );
};

export default Footer;