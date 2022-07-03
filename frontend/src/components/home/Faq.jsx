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
import { ParallaxBanner } from 'react-scroll-parallax';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import "@fontsource/rosarivo" 
import '../../stylesheets/home.css'

const useStyles = makeStyles({
    margin: {
        borderTop: "1",
        borderBottom: "1"
    },
    marginBot: {
        borderTop: "1",
        borderBottom: "20"
    },
    color: {
        //backgroundColor: "#2195ea",
        backgroundColor: "#376eea",

    },
    colorBackground: {
        backgroundColor: "#376eea",
    },
    title: {
        color: "#ffffff",
        fontFamily: "Inter",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "375%"
    },

    button: {
        backgroundColor: "#FFFFFF", color: "#c8e7fa", width: "50%", minHeight: "50px", border: "4px solid",
        "&:hover": {
            backgroundColor: "#c8e7fa",
        }
    },
    text: {
        color: "#ffffff",
        fontFamily: "Rosarivo",
        flexDirection: "column",
        marginBottom: "0px"
    },
    MuiAccordionroot: {
        "&.MuiAccordion-root:before": {
          backgroundColor: "#376eea",
          flexDirection: "column",
        },
        "&.MuiAccordion-root.Mui-expanded:last-child": {
           marginTop: "1px",
           marginBottom: "25px",
        },
        "&.MuiAccordionSummary-content": {
            margin: "0",
        },
        

    },
    expanded: {},
    content: {
        '&$expanded': {
        margin: "0",
        minHeight: "0",
        },
        margin: "0",
    },
    MuiAccordionDetailroot: {
        padding: "0px 16px 0px",
        flexDirection: "column",
    },
    expand_icon : {
        color: "white"
    }
});

export default function Faq() {

    const classes = useStyles();


   

    return (
        <Card className={`${classes.colorBackground}`}>
                        <CardContent>
                            <Typography className={classes.title} variant="h4" gutterBottom>
                            Frequently Asked Questions
                            </Typography>

                            <Box raised="true" className= "MuiAccordion-root.Mui-expanded" border={4} borderLeft={0} borderRight={0} borderBottom={0} borderColor="#ffffff">
                                <Accordion className={`${classes.colorBackground} ${classes.text}`} border={0} elevation={0} classes={{root: classes.MuiAccordionroot}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon className={classes.expand_icon} />} classes={{ root: classes.content, content: classes.content, expanded: classes.expanded }} >
                                        <Typography variant="h6" gutterBottom > 
                                            <b> Who can participate? </b>
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails classes= {{root: classes.MuiAccordionDetailroot}}>
                                        <Typography className={classes.text}>
                                            Any <b>university student</b> enrolled in any undergraduate or graduate program may participate. High school students may <b>NOT</b> participate.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>

                            <Box raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} border={4} borderLeft={0} borderRight={0} borderBottom={0} borderColor="#ffffff" >
                                <Accordion className={`${classes.colorBackground} ${classes.text}`} border={0} elevation={0} classes={{root: classes.MuiAccordionroot}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon className={classes.expand_icon} />} classes={{ root: classes.content, content: classes.content, expanded: classes.expanded }}>
                                        <Typography variant="h6" gutterBottom>
                                            <b>Where will HopHacks take place?</b>
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails classes= {{root: classes.MuiAccordionDetailroot}}>
                                        <Typography className={classes.text}>
                                            HopHacks is held at the Johns Hopkins Homewood Campus in Baltimore, MD. A campus map can be found <a className="link-text" href="https://www.jhu.edu/assets/uploads/2014/10/homewood_campus_map.pdf" target="_blank">here</a>, and you can navigate to us on <a className="link-text" href="https://www.google.com/maps/place/Johns+Hopkins+University/@39.3299013,-76.6227117,17z/data=!3m1!4b1!4m5!3m4!1s0x89c804df8502f88d:0x303d58494fa04c66!8m2!3d39.3299013!4d-76.6205177" target="_blank">Google Maps</a>.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>

                            <Box raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} border={4} borderLeft={0} borderRight={0} borderBottom={0} borderColor="#ffffff" >
                                <Accordion className={`${classes.colorBackground} ${classes.text}`} border={0} elevation={0} classes={{root: classes.MuiAccordionroot}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon className={classes.expand_icon} />} classes={{ content: classes.content, expanded: classes.expanded }}>
                                        <Typography variant="h6" gutterBottom>
                                            <b>How do I get to HopHacks?</b>
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails classes= {{root: classes.MuiAccordionDetailroot}} >
                                        <Typography className={classes.text}>
                                            To get to us, we offer two bus routes. The North Bus will pick up students from New York City, Rutgers, and Philadelphia; the South Bus will pick up students from Georgetown, UMDCP, and UMDBC. More information on the exact pickup locations of these busses will be posted and sent out shortly to those who indicate interest in their registration.
                                        </Typography>

                                        <Typography className={classes.text}>
                                            If none of those options are for you, here are more ways to get to the party:
                                            <ul>
                                                <li>For students from local Baltimore schools, we recommend the <a className="link-text" href="https://baltimorecollegetown.org/shuttle/" target="_blank">Collegetown Shuttle</a>.</li>
                                                <li>For students from DC who are not taking our South/DC/Maryland Bus, we recommend taking the <a className="link-text" href="https://www.mta.maryland.gov/schedule?type=marc-train" target="_blank">MARC</a> train to Baltimore Penn Station, and then taking the <a className="link-text" href="https://ts.jhu.edu/Shuttles/" target="_blank">JHMI</a> shuttle or an Uber/Lyft/Taxi to Hopkins (if you do this, be sure to specify that you’re going to the Homewood campus!).</li>
                                                <li>For other students, we recommend taking the <a className="link-text" href="https://www.flixbus.com/" target="_blank">FlixBus</a>, which stops near Baltimore Penn station so you can take the JHMI or Uber/Lyft/Taxi to Hopkins as stated in the previous bullet.</li>
                                                <li>Finally, for those of you who are driving, free parking will be available in the <a className="link-text" href="https://www.google.com/maps/place/JHU+South+Garage/@39.3266548,-76.6240642,17z/data=!4m5!3m4!1s0x89c805322769c3db:0x83520ffde4dbcc7!8m2!3d39.325966!4d-76.6221276" target="_blank">South Garage</a>. Come see us in the HQ for a parking pass!</li>
                                            </ul>
                                        </Typography>

                                        <Typography className={classes.text}>
                                            <b>Note:</b> We will not be offering individual travel reimbursements.
                                        </Typography>
                                        </AccordionDetails>
                                </Accordion>
                            </Box>

                            <Box raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} border={4} borderLeft={0} borderRight={0} borderBottom={0} borderColor="#ffffff">
                                <Accordion className={`${classes.colorBackground} ${classes.text}`} border={0} elevation={0} classes={{root: classes.MuiAccordionroot}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon className={classes.expand_icon} />} classes={{ root: classes.content, content: classes.content, expanded: classes.expanded }}>
                                        <Typography variant="h6" gutterBottom>
                                            <b>Who will be there?</b>
                                        </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails classes= {{root: classes.MuiAccordionDetailroot}}>
                                        <Typography className={classes.text}>
                                            In addition to students in attendance, representatives from many of our sponsor companies will be there to mentor the participants.
                                        </Typography>
                                        </AccordionDetails>
                                </Accordion>
                            </Box>

                            <Box raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} border={4} borderLeft={0} borderRight={0} borderBottom={0} borderColor="#ffffff" >
                                <Accordion className={`${classes.colorBackground} ${classes.text}`} border={0} elevation={0} classes={{root: classes.MuiAccordionroot}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon className={classes.expand_icon} />} classes={{ root: classes.content, content: classes.content, expanded: classes.expanded }}>
                                        <Typography variant="h6" gutterBottom>
                                            <b> Who are the judges? </b>
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails classes= {{root: classes.MuiAccordionDetailroot}}>
                                    <Typography className={classes.text}>
                                        The judges will be a mix of local tech professionals and JHU faculty.
                                    </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>

                            <Box raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} border={4} borderLeft={0} borderRight={0} borderBottom={0} borderColor="#ffffff" >
                                <Accordion className={`${classes.colorBackground} ${classes.text}`} border={0} elevation={0} classes={{root: classes.MuiAccordionroot}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon className={classes.expand_icon} />} classes={{ root: classes.content, content: classes.content, expanded: classes.expanded }}>
                                        <Typography variant="h6" gutterBottom>
                                            <b>Can I sleep?</b>
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails classes= {{root: classes.MuiAccordionDetailroot}}>
                                    <Typography className={classes.text}>
                                        No. Real hackers are hardcore.
                                    </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>

                            <Box raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} border={4} borderLeft={0} borderRight={0} borderBottom={0} borderColor="#ffffff" >
                                <Accordion className={`${classes.colorBackground} ${classes.text}`} border={0} elevation={0} classes={{root: classes.MuiAccordionroot}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon className={classes.expand_icon} />} classes={{ root: classes.content, content: classes.content, expanded: classes.expanded }}>
                                        <Typography variant="h6" gutterBottom>
                                            <b>Are you serious?</b>
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails classes= {{root: classes.MuiAccordionDetailroot}}>
                                    <Typography className={classes.text}>
                                        Lol no. Sleeping rooms will be set aside for visiting students, although you should still bring your own blankets/sleeping bags/plushies/etc.
                                        These areas will be specified on our website closer to the event and also denoted with signs. Hopkins students may return to their dorms to sleep,
                                        but may not hack outside of the designated HopHacks buildings.
                                    </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>


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

                            <Box raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} border={4} borderLeft={0} borderRight={0} borderBottom={0} borderColor="#ffffff" >
                                <Accordion className={`${classes.colorBackground} ${classes.text}`} border={0} elevation={0} classes={{root: classes.MuiAccordionroot}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon className={classes.expand_icon} />} classes={{ root: classes.content, content: classes.content, expanded: classes.expanded }}>
                                        <Typography variant="h6" gutterBottom>
                                            <b>What about the FREE FOOD?</b>
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails classes= {{root: classes.MuiAccordionDetailroot}}>
                                        <Typography className={classes.text}>
                                            At registration, all participants will be given a wristband which MUST BE VISIBLE when you are getting food. If you do not have your wristband, you will not be able to get food. Also, we do not like people who come to HopHacks for the free food and then leave. We are watching you.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>

                            <Box raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} border={4} borderLeft={0} borderRight={0} borderBottom={0} borderColor="#ffffff" >
                                <Accordion className={`${classes.colorBackground} ${classes.text}`} border={0} elevation={0} classes={{root: classes.MuiAccordionroot}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon className={classes.expand_icon} />} classes={{ root: classes.content, content: classes.content, expanded: classes.expanded }}>
                                        <Typography variant="h6" gutterBottom>
                                            <b>When can I pick up parking passes?</b>
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails classes= {{root: classes.MuiAccordionDetailroot}}>
                                    <Typography className={classes.text}>
                                        We will distribute parking passes to participants on the Sunday morning of HopHacks.
                                    </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>

                            <Box raised="true" className={`${classes.margin} ${classes.color} ${classes.text}`} border={4} borderLeft={0} borderRight={0} borderBottom={0} borderColor="#ffffff" >
                                <Accordion className={`${classes.colorBackground} ${classes.text}`} border={0} elevation={0} classes={{root: classes.MuiAccordionroot}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon className={classes.expand_icon} />} classes={{ root: classes.content, content: classes.content, expanded: classes.expanded }}>
                                        <Typography variant="h6" gutterBottom>
                                            <b>Will there be travel reimbursements?</b>
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails classes= {{root: classes.MuiAccordionDetailroot}}>
                                    <Typography className={classes.text}>
                                        We will not be offering individual travel reimbursements but are sponsoring other modes of transportation detailed above.
                                    </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>

                            <Box raised="true" className={`${classes.color} ${classes.text}`} border={4} borderLeft={0} borderRight={0} borderColor="#ffffff" sx={{height: "800px"}} >
                                <Accordion className={`${classes.colorBackground} ${classes.text}`} border={0} elevation={0} classes={{root: classes.MuiAccordionroot}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon className={classes.expand_icon} />} classes={{ root: classes.content, content: classes.content, expanded: classes.expanded }}>
                                        <Typography variant="h6" gutterBottom>
                                            <b>What if I have any other questions? </b>
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails classes= {{root: classes.MuiAccordionDetailroot}}>
                                        <Typography className={classes.text}>
                                            You can message us at our <a className="link-text" href="https://facebook.com/hophacks">Facebook</a> page and one of our team members will respond accordingly. Alternatively, you can email us at <a className="link-text" href="mailto:hophacks@gmail.com">hophacks@gmail.com</a>
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        </CardContent>
                    </Card>

    );
}