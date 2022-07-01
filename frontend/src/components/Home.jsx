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
import { ParallaxBanner } from 'react-scroll-parallax';

import '../stylesheets/home.css'

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
    text: {
        color: "#ffffff",
        fontFamily: "Inter",
    }
});

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
                <strong>INTERESTED IN BEING AN ORGANIZER? </strong>
            </Typography>
            <br />


            <Button className={classes.button} variant="outlined" href="https://forms.gle/Znzy2aFq7Bwwx7P4A">

                <Typography style={{ "color": "#202c63", fontSize: '2.8em', fontFamily: "VCR OSD Mono" }}>

                    <strong>Join the team!</strong>
                </Typography>
            </Button>

        </div>
    );

    return (
        <div>
            <a id="mlh-trust-badge"
                style={{ 'display': 'block', 'maxWidth': '100px', 'minWidth': '60px', 'position': 'fixed', 'right': '30px', 'top': '0', 'width': '10%', 'zIndex': '10000' }}
                href="https://mlh.io/seasons/2022/events?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2022-season&utm_content=gray"
                target="_blank">
                <img src="https://s3.amazonaws.com/logged-assets/trust-badge/2022/mlh-trust-badge-2022-gray.svg" alt="Major League Hacking 2022 Hackathon Season" style={{ "width": "100%" }}></img>
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
                    <Card className={`${classes.colorBackground}`}>
                        <CardContent>
                            <Typography className={classes.title} variant="h4" gutterBottom>
                                FAQs
                            </Typography>

                            <Card raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <b> Who can participate? </b>
                                    </Typography>

                                    <Typography>
                                        Any <b>university student</b> enrolled in any undergraduate or graduate program may participate. High school students may <b>NOT</b> participate.
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <b>Where will HopHacks take place?</b>
                                    </Typography>

                                    <Typography >
                                        HopHacks is held at the Johns Hopkins Homewood Campus in Baltimore, MD. A campus map can be found <a className="link-text" href="https://www.jhu.edu/assets/uploads/2014/10/homewood_campus_map.pdf" target="_blank">here</a>, and you can navigate to us on <a className="link-text" href="https://www.google.com/maps/place/Johns+Hopkins+University/@39.3299013,-76.6227117,17z/data=!3m1!4b1!4m5!3m4!1s0x89c804df8502f88d:0x303d58494fa04c66!8m2!3d39.3299013!4d-76.6205177" target="_blank">Google Maps</a>.
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <b>How do I get to HopHacks?</b>
                                    </Typography>

                                    <Typography >
                                        To get to us, we offer two bus routes. The North Bus will pick up students from New York City, Rutgers, and Philadelphia; the South Bus will pick up students from Georgetown, UMDCP, and UMDBC. More information on the exact pickup locations of these busses will be posted and sent out shortly to those who indicate interest in their registration.
                                    </Typography>

                                    <Typography >
                                        If none of those options are for you, here are more ways to get to the party:
                                        <ul>
                                            <li>For students from local Baltimore schools, we recommend the <a className="link-text" href="https://baltimorecollegetown.org/shuttle/" target="_blank">Collegetown Shuttle</a>.</li>
                                            <li>For students from DC who are not taking our South/DC/Maryland Bus, we recommend taking the <a className="link-text" href="https://www.mta.maryland.gov/schedule?type=marc-train" target="_blank">MARC</a> train to Baltimore Penn Station, and then taking the <a className="link-text" href="https://ts.jhu.edu/Shuttles/" target="_blank">JHMI</a> shuttle or an Uber/Lyft/Taxi to Hopkins (if you do this, be sure to specify that you’re going to the Homewood campus!).</li>
                                            <li>For other students, we recommend taking the <a className="link-text" href="https://www.flixbus.com/" target="_blank">FlixBus</a>, which stops near Baltimore Penn station so you can take the JHMI or Uber/Lyft/Taxi to Hopkins as stated in the previous bullet.</li>
                                            <li>Finally, for those of you who are driving, free parking will be available in the <a className="link-text" href="https://www.google.com/maps/place/JHU+South+Garage/@39.3266548,-76.6240642,17z/data=!4m5!3m4!1s0x89c805322769c3db:0x83520ffde4dbcc7!8m2!3d39.325966!4d-76.6221276" target="_blank">South Garage</a>. Come see us in the HQ for a parking pass!</li>
                                        </ul>
                                    </Typography>

                                    <Typography >
                                        <b>Note:</b> We will not be offering individual travel reimbursements.
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <b>Who will be there?</b>
                                    </Typography>

                                    <Typography >
                                        In addition to students in attendance, representatives from many of our sponsor companies will be there to mentor the participants.
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <b> Who are the judges? </b>
                                    </Typography>

                                    <Typography >
                                        The judges will be a mix of local tech professionals and JHU faculty.
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <b>Can I sleep?</b>
                                    </Typography>

                                    <Typography >
                                        No. Real hackers are hardcore.
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <b>Are you serious?</b>
                                    </Typography>

                                    <Typography >
                                        Lol no. Sleeping rooms will be set aside for visiting students, although you should still bring your own blankets/sleeping bags/plushies/etc.
                                        These areas will be specified on our website closer to the event and also denoted with signs. Hopkins students may return to their dorms to sleep,
                                        but may not hack outside of the designated HopHacks buildings.
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

                            {/* <Card raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <b>Will I be able to participate in multiple virtual hackathons during the same weekend?</b>
                                    </Typography>

                                    <Typography >
                                        Yes! Because of the nature of virtual hackathons, you will be able to submit your project to multiple concurrent events.
                                        The project you create, however, must be new and <b>CANNOT</b> be worked on before the start of the hackathon.
                                    </Typography>
                                </CardContent>
                            </Card> */}

                            <Card raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <b>What about the FREE FOOD?</b>
                                    </Typography>

                                    <Typography >
                                        At registration, all participants will be given a wristband which MUST BE VISIBLE when you are getting food. If you do not have your wristband, you will not be able to get food. Also, we do not like people who come to HopHacks for the free food and then leave. We are watching you.
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <b>When can I pick up parking passes?</b>
                                    </Typography>

                                    <Typography >
                                        We will distribute parking passes to participants on the Sunday morning of HopHacks.
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <b>Will there be travel reimbursements?</b>
                                    </Typography>

                                    <Typography >
                                        We will not be offering individual travel reimbursements but are sponsoring other modes of transportation detailed above.
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <b>What if I have any other questions? </b>
                                    </Typography>

                                    <Typography >
                                        You can message us at our <a className="link-text" href="https://facebook.com/hophacks">Facebook</a> page and one of our team members will respond accordingly. Alternatively, you can email us at <a className="link-text" href="mailto:hophacks@gmail.com">hophacks@gmail.com</a>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                    <Team />
                </Box>
            </Container>
        </div>
    );

}
