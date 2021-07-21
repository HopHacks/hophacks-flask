import React from "react";

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import {ParallaxBanner} from 'react-scroll-parallax';

import Team from './home/Team';
import '../stylesheets/home.css'

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
        <div style={{width:"100%", height:"100%"}}>
        <ParallaxBanner
            layers={[
                {
                    image: img('010_sky.webp'),
                    amount: 0.225,
                },
                {
                    image: img('009_back_trees.webp'),
                    amount: 0.3,
                },
                {
                    image: img('008_sun.webp'),
                    amount: 0.375,
                },
                {
                    image: img('007_sky_clouds.webp'),
                    amount: 0.45,
                },
                {
                    image: img('006_mountains.webp'),
                    amount: 0.525,
                },
                {
                    image: img('005_behind_tower_trees.webp'),
                    amount: 0.6,
                },
                {
                    image: img('004_behind_tower_clouds.webp'),
                    amount: 0.675,
                },
                {
                    image: img('003_tower.webp'),
                    amount: 0.75,
                },
                {
                    image: img('002_front_of_tower_clouds.webp'),
                    amount: 0.825,
                },
                
                {
                    image: img('001_bushes.webp'),
                    amount: 0.9,
                },

            ]}

            style={{
                height: '100vh',
            }}
        />

        </div>  
    )

    /* Logo on top of Parallax Banner */
    const Logo = (      
        <div className={classes.logo}>
            <img src={img('hoptext.gif')} style={{
                'width': '35vw',
            }}/>

            <div/>

            <img src={img('HopHacks_logo.png')} style={{
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
            
            <Container fixed>

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

                <Team/>

            </Container>

        </div>
    );

}
