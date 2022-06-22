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
        backgroundColor: "#eef7ff",
    },
    title: {
        color: "#7289da",
        fontFamily: "VCR OSD Mono",
    },

    button:{
        backgroundColor:"#FFFFFF", color: "#c8e7fa" , width: "50%", minHeight :"50px" ,border:"4px solid",
        "&:hover":{
            backgroundColor:"#c8e7fa",
        }
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

            
            <Button className={classes.button} variant="outlined"  href="https://forms.gle/Znzy2aFq7Bwwx7P4A">
                
                <Typography style = {{"color":"#202c63",fontSize: '2.8em',fontFamily: "VCR OSD Mono"}}>

                <strong>Join the team!</strong>
                </Typography>
                </Button>
            
        </div>
    );

    return (
        <div>
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
                <About/>
               <Schedule/>
                    <Prizes/>
                    <Sponsors />
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
                </Box>
            </Container>
        </div>
    );

}
