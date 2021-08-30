import React from "react";

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { ParallaxBanner } from 'react-scroll-parallax';


import { withStyles } from '@material-ui/core/styles';
import Team from './home/Team';
import '../stylesheets/home.css'
import Sponsors from "./home/Sponsors";

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
        backgroundColor: "#eef7ff",
    },
    title: {
        color: "#7289da",
        fontFamily: "VCR OSD Mono",
    },
});




export default function Home() {
    const classes = useStyles();

    function img(url) {
        return process.env.PUBLIC_URL + '/images/' + url;
    }

    const Banner = (
        <div style={{ width: "100%", height: "100%" }}>
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

            <img src={img('HopHacks_logo.png')} style={{
                'width': '14vw',
            }} />

            <Typography style={{ 'color': '#FFFFFF', fontSize: '100px', fontFamily: "VCR OSD Mono" }} >
                <strong>HOPHACKS</strong>
            </Typography>

            <div />



            <Typography style={{ 'color': '#FFFFFF', fontSize: '40px', fontFamily: "VCR OSD Mono" }} >
                <strong>SEPTEMBER 17-19, 2021</strong>
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
                            <Typography className={classes.title} variant="h4" gutterBottom>
                                About
                            </Typography>
                            <Typography >
                                
                                HopHacks is a 36-hour biannual Hackathon held at Johns Hopkins University that encourages engineers, designers, and entrepreneurs to explore new ideas and create new applications. Teams of up to 4 university students work on projects from scratch. At the end of the hackathon, teams present their projects to judges and compete for prizes!

                                <p>
                                    <b>
                                        Note: Due to the COVID-19 pandemic, we will be hosting HopHacks virtually via Discord and Zoom.
                                    </b>
                                </p>
                            </Typography>
                        </CardContent>
                    </Card>



                </Box>

                <Box py={2}>

                    <Card>
                        <CardContent>

                            <Typography className={classes.title} variant="h4" gutterBottom>
                                FAQs
                            </Typography>



                            <Card raised="true" className={`${classes.margin} ${classes.color}`} >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                       <b> Who can participate? </b>
                                    </Typography>

                                    <Typography>
                                        Any <b>university student</b> enrolled in any undergraduate or graduate program may participate. High school students may <b>NOT</b> participate.
                                    </Typography>

                                </CardContent>
                            </Card>



                            <Card raised="true" className={`${classes.margin} ${classes.color}`}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <b>Where will HopHacks take place?</b>
                                    </Typography>

                                    <Typography >

                                        Because of restrictions due to COVID-19, HopHacks will be virtual this year. We will be using a mix of Discord and Zoom, so make sure you have accounts for them!

                                    </Typography>

                                </CardContent>
                            </Card>

                            <Card raised="true" className={`${classes.margin} ${classes.color}`}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                    <b>Who will be there?</b>

                                    </Typography>

                                    <Typography >

                                        In addition to students in attendance, representatives from many of our sponsor companies will be there to mentor the participants.



                                    </Typography>

                                </CardContent>
                            </Card>


                            {/* <Card raised="true" className={`${classes.margin} ${classes.color}`}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        What are the prizes?

                                    </Typography>

                                    <Typography >

                                        <p>HopHacks will be awarding larger prizes this year for the top 10!</p>
                                        <p>
                                            We will have: a $1,024 grand prize, a $768 second place prize, a $512 third place prize,
                                            a $384 fourth place prize, and a $256 fifth place prize. The rest of the top 10 teams (sixth to tenth place)
                                            will receive $128 each. The prize will be distributed among team members, and all teams are automatically eligible
                                            to compete for these prizes.
                                        </p>

                                        <p>
                                            In addition to the HopHacks prizes, there will also be several branded prizes offered
                                            by our sponsors. The full list of prizes will be on our Devpost, which will be linked when available.
                                            You may sign up for individual branded prizes there (which you must do for each branded prize you wish to compete for).
                                        </p>


                                    </Typography>

                                </CardContent>
                            </Card> */}


                            <Card raised="true" className={`${classes.margin} ${classes.color}`}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                    <b> Who are the judges? </b>

                                    </Typography>

                                    <Typography >

                                        The judges will be a mix of local tech professionals and JHU faculty.


                                    </Typography>

                                </CardContent>
                            </Card>

                            <Card raised="true" className={`${classes.margin} ${classes.color}`}>
                                <CardContent>
                                    <Typography  variant="h6" gutterBottom>
                                    <b>Will I be able to participate in multiple virtual hackathons during the same weekend?</b>

                                    </Typography>

                                    <Typography >

                                        Yes! Because of the nature of virtual hackathons, you will be able to submit your project to multiple concurrent events.
                                        The project you create, however, must be new and <b>CANNOT</b> be worked on before the start of the hackathon.


                                    </Typography>

                                </CardContent>
                            </Card>

                            <Card raised="true" className={`${classes.margin} ${classes.color}`}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <b>Where will I sleep? </b>

                                    </Typography>

                                    <Typography >

                                        Since HopHacks is happening virtually this year, you can sleep anywhere you want (though we recommend sleeping in a bed)!


                                    </Typography>

                                </CardContent>
                            </Card>

                            <Card raised="true" className={`${classes.margin} ${classes.color}`}>
                                <CardContent>
                                    <Typography  variant="h6" gutterBottom>
                                        <b>What about the free food?</b>

                                    </Typography>

                                    <Typography >

                                        Unfortunately, because we do not have the technology to provide virtual food, we will not be having free food this year. Feel free to create a hack to develop such technology!

                                    </Typography>

                                </CardContent>
                            </Card>

                            <Card raised="true" className={`${classes.margin} ${classes.color}`}>
                                <CardContent>
                                    <Typography  variant="h6" gutterBottom>
                                        <b>What if I have any other questions? </b>

                                    </Typography>

                                    <Typography >

                                        You can message us at our <a className="link-text" href="https://facebook.com/hophacks">Facebook</a> page and one of our team members will respond accordingly. Alternatively, you can email us at <a className="link-text" href="mailto:team@hophacks.com">team@hophacks.com</a>
                                    </Typography>

                                </CardContent>
                            </Card>



                        </CardContent>
                    </Card>

                    <Team />
                    <Sponsors />

                </Box>

            </Container>

        </div>
    );

}
