import React from "react";

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import {ParallaxBanner, ParallaxProvider} from 'react-scroll-parallax'

import '../stylesheets/base.css'

const useStyles = makeStyles({
    logo: {
        top: '40%',
        width: '60vw', // This is centered, 20 - 60 - 20
        left: '20vw',
        position: 'absolute',
        textAlign: 'center', 
    },
});

export default function Home() {
    const classes = useStyles();

    function img(url) {
        return process.env.PUBLIC_URL + '/images/' + url;
    }

    const Banner = (            
        <ParallaxBanner
            layers={[
                {
                    image: img('parallax1.webp'),
                    amount: 0.9,
                },
                {
                    image: img('parallax2.webp'),
                    amount: 0.825,
                },
                {
                    image: img('parallax3.webp'),
                    amount: 0.75,
                },
                {
                    image: img('parallax4.webp'),
                    amount: 0.675,
                },
                {
                    image: img('parallax5.webp'),
                    amount: 0.6,
                },
                {
                    image: img('parallax6.webp'),
                    amount: 0.525,
                },
                {
                    image: img('parallax7.webp'),
                    amount: 0.45,
                },
                {
                    image: img('parallax8.webp'),
                    amount: 0.375,
                },
                {
                    image: img('parallax9.webp'),
                    amount: 0.3,
                },
                {
                    image: img('parallax10.webp'),
                    amount: 0.225,
                },
                {
                    image: img('parallax11.webp'),
                    amount: 0.15,
                },
                {
                    image: img('parallax12.webp'),
                    amount: 0.075,
                },
                {
                    image: img('parallax13.webp'),
                    amount: 0,
                },
            ]}

            style={{
                height: '100vh',
            }}
        />
    )

    /* Logo on top of Parallax Banner */
    const Logo = (      
        <div className={classes.logo}>
            <img src={img('hoptext.gif')} style={{
                'width': '35vw',
            }}/>

            <div/>

            <img src={img('hoplogo.png')} style={{
                'width': '6vw', 
            }} />

            <Typography style = {{'color': '#FFFFFF'}} >
                <strong>We're revamping our website, come back soon!</strong>
            </Typography>
        </div>
    );


    return (
        <div>

            {Banner}
            {Logo}
            
            <Container fixed color="secondary">

                <Box py={2}>
                    <Card>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            About
                        </Typography>
                        <Typography color="textSecondary">
                            HopHacks is a 36-hour biannual Hackathon held at Johns Hopkins University that encourages engineers, designers, and entrepreneurs to explore new ideas and create new applications. Teams of up to 4 university students work on projects from scratch. At the end of the hackathon, teams present their projects to judges and compete for prizes up to $1024!

                            Note: Due to the COVID-19 pandemic, we will be hosting HopHacks virtually via Discord and Zoom.
                        </Typography>
                    </CardContent>
                    </Card>
                </Box>

                <Box py={2}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                About
                            </Typography>
                            <Typography color="textSecondary">
                                HopHacks is a 36-hour biannual Hackathon held at Johns Hopkins University that encourages engineers, designers, and entrepreneurs to explore new ideas and create new applications. Teams of up to 4 university students work on projects from scratch. At the end of the hackathon, teams present their projects to judges and compete for prizes up to $1024!

                                Note: Due to the COVID-19 pandemic, we will be hosting HopHacks virtually via Discord and Zoom.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

            </Container>
        </div>
    );

}
