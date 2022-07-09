import React from "react";
import { Link } from "react-router-dom";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Team from './home/Team';
import Sponsors from "./home/Sponsors";
import Prizes from "./home/Prizes";
import Schedule from "./home/Schedule";
import About from "./home/About"
import Faq from "./home/Faq"
import { ParallaxBanner } from 'react-scroll-parallax';

import '../stylesheets/home.css'
import AboutTransition from "./home/AboutTransition";

const useStyles = makeStyles({
    logo: {
        top: '25%',
        width: '60vw', // This is centered, 20 - 60 - 20
        left: '20vw',
        position: 'absolute',
        textAlign: 'center',
    },
    margin: {
        marginBottom: "13px",
    },
    color: {
        //backgroundColor: "#2195ea",
        backgroundColor: "#376efa",

    },
    colorBackground: {
        backgroundColor: "#376eea",
    },
    title: {
        color: "#ffffff",
        fontFamily: "VCR OSD Mono",
    },

    button: {
        backgroundColor: "#FFFFFF", color: "#c8e7fa", width: "50%", minHeight: "50px", border: "4px solid",
        "&:hover": {
            backgroundColor: "#c8e7fa",
        }
    },
    gradient: {
        backgroundImage: "linear-gradient(#15ABFB, #376CC9)",
    }
  }
);

export default function Home() {
    const classes = useStyles();

    function img(url) {
        return process.env.PUBLIC_URL + '/images/' + url;
    }

    const Banner = (
        <div style={{ width: "100%", height: "100%", backgroundColor: "#0F1827" }}>
            <ParallaxBanner
                layers={[
                    {
                        image: img('010_sky_edit2.png'),
                        amount: -0.225,
                    },
                    {
                        image: img('009_back_trees2.png'),
                        amount: -0.3,
                    },
                    {
                        image: img('008_sun.webp'),
                        amount: -0.375,
                    },
                    {
                        image: img('007_sky_clouds.webp'),
                        amount: -0.45,
                    },
                    {
                        image: img('006_mountains.webp'),
                        amount: -0.525,
                    },
                    {
                        image: img('005_behind_tower_trees2.png'),
                        amount: -0.6,
                    },
                    {
                        image: img('004_behind_tower_clouds2.png'),
                        amount: -0.675,
                    },
                    {
                        image: img('003_tower.webp'),
                        amount: -0.7,
                    },
                    {
                        image: img('002_front_of_tower_clouds2.png'),
                        amount: -0.825,
                    },
                    {
                        image: img('001_bushes3.png'),
                        amount: -0.9,
                    },

                ]}
                style={{
                    height: '100vh',
                }}
            >
            </ParallaxBanner>
        </div>
    )

    /* Logo on top of Parallax Banner */
    const Logo = (
        <div className={classes.logo}>
            <img src={img('HopHacks_logo.png')} style={{
                'width': '14vw',
            }} />

            <Typography align="center" justify="center" style={{ 'color': '#FFFFFF', fontSize: '3.8em', fontFamily: "VCR OSD Mono" }} >
                <strong>HOPHACKS</strong>
            </Typography>

            <div />

            <Typography align="center" style={{ 'color': '#FFFFFF', fontSize: '2.0em', fontFamily: "VCR OSD Mono" }} >
                <strong>September</strong>
            </Typography>
            <br />


            <Button className={classes.button} variant="outlined" href="https://forms.gle/bVRLmpbLfDuZ7pkX6" >

                <Typography style={{ "color": "#202c63", fontSize: '2.8em', fontFamily: "VCR OSD Mono" }}>

                    <strong>Pre-registration</strong>
                </Typography>
            </Button>

        </div>
    );

    return (
        <div className={classes.gradient}>
            <a id="mlh-trust-badge" 
               style={{'display':'block','maxWidth':'100px','minWidth':'60px','position':'fixed', 'right':'30px','top':'0','width':'10%','zIndex':'10000'}} 
               href="https://mlh.io/seasons/2022/events?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2022-season&utm_content=gray" 
               target="_blank">
                <img src="https://s3.amazonaws.com/logged-assets/trust-badge/2022/mlh-trust-badge-2022-gray.svg" alt="Major League Hacking 2022 Hackathon Season" style={{"width":"100%"}}></img>
            </a>

            {Banner}
            {Logo}

            <Container fixed>
                <Box py={2}>
                    <Card>
                        <CardContent>
                            <Typography className={classes.title} variant="h4" gutterBottom>
                                About
                            </Typography>
                            <Typography >
                                HopHacks is a 36-hour biannual Hackathon held at the Johns Hopkins University that encourages engineers, designers, and entrepreneurs to explore new ideas and create new applications. Teams of up to 4 university students work on projects from scratch. At the end of the hackathon, teams present their projects to judges and compete for prizes!
                                <p>
                                    <b>
                                        Note: Due to the COVID-19 pandemic, we will be hosting HopHacks virtually via Discord and Zoom.
                                    </b>
                                </p>
                            </Typography>
                        </CardContent>
                    </Card>


                    <Schedule />
                    <Prizes />
                    <Sponsors />
                    <Faq />
                    <Team />
                </Box>
            </Container>
        </div>
    );

}
