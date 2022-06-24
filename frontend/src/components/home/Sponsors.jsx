import React from "react";
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ReactDOM from "react-dom";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import { useWindowSize } from "react-use";
import { motion, Variants } from 'framer-motion/dist/framer-motion'// Needs to be added to requirements.txt
import { FormHelperText } from "@material-ui/core";


const config = { mass: 2, tension: 2000, friction: 200 };

const useStyles = makeStyles({

    title: {
        color: "#ffffff",
        fontFamily: "Inter",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "375%"
    },
    minititle: {
        color: "#ffffff",
        fontFamily: "Inter",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "300%",
        alignItems: "center",
        justifyItems: "center"
    },
    logos: {
        color: "#ffffff",
        fontFamily: "Inter",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "250%",
        alignItems: "center",
        justifyItems: "center"

    },
    card: {
        backgroundColor: "#278be2",
    },
});

function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
}

function SponsorItem(props) {
    return (
        <a href={`${props.website}`}><img srcSet={img(`sponsor/png/${props.imgURL}.png`)} style={props.imgSytle} /></a>
    );
}

export default function Sponsors() {


    const classes = useStyles();

    const gold = 0.3;
    const sable = 0.25;
    const blue = 0.15;
    const starter = 0.15;

    const textAnimate = {
        offscreen: { y: 0, opacity: 0 },
        onscreen: {
            y: 0,
            opacity: 1,
            duration: 4,

            transition: {
                type: "spring",
                bounce: 0.0,
                duration: 2
            }
        }
    }

    const imageAnimate = {
        offscreen: { x: -750, opacity: 0 },
        onscreen: {
            x: 0,
            opacity: 1,
            duration: 3,
            transition: {
                type: "spring",
                bounce: 0.0,
                duration: 4
            }
        }
    }
    const size = useWindowSize();


    return (
        <motion.div>
            <Box py={2}>
                <Card className={classes.card}>
                    <CardContent>
                        <div>
                            <h4 className={classes.title} gutterBottom>Sponsors</h4>
                        </div>
                        <div>
                            <Typography className={classes.minititle} gutterBottom>Gold</Typography>
                        </div>
                        <motion.div class={classes.logos}
                            initial={"offscreen"}
                            whileInView={"onscreen"}
                            variants={imageAnimate}>
                            <span alignItems="center">
                                <SponsorItem imgURL='Bloomberg' website='https://www.bloomberg.com/' imgSytle={{ width: size.width * gold, maxHeight: "100%", height: 150, alignItems: "center" }} />
                                <SponsorItem imgURL='yet' website='https://www.yetanalytics.com/' imgSytle={{ width: size.width * gold, maxHeight: "100%", height: 125, alignItems: "center" }} />
                            </span>
                        </motion.div>
                        <div>
                            <Typography className={classes.minititle} gutterBottom>Sable</Typography>
                        </div>
                        <motion.div class={classes.logos}
                            initial={"offscreen"}
                            whileInView={"onscreen"}
                            variants={imageAnimate}>
                            <SponsorItem imgURL='apl' website='https://www.jhuapl.edu/' imgSytle={{ width: size.width * sable , maxHeight: "100%", marginTop: "5%" }} />
                            <SponsorItem imgURL='one' website='https://www.capitalone.com/' imgSytle={{ width: size.width * sable, maxHeight: "100%", marginTop: "5%" }} />
                            <br></br>
                            <SponsorItem imgURL='SIEMENS' website='https://www.siemens-healthineers.com/' imgSytle={{ width: size.width * sable, maxHeight: "100%", marginTop: "7%" }} />
                            <SponsorItem imgURL='it' website='https://it.johnshopkins.edu/' imgSytle={{ width: size.width * sable / 1.5, maxHeight: "100%", marginTop: "12%" }} />

                        </motion.div>
                        <div>
                            <Typography className={classes.minititle} gutterBottom>Blue</Typography>
                        </div>
                        <motion.div class={classes.logos}
                            initial={"offscreen"}
                            whileInView={"onscreen"}
                            variants={imageAnimate}>
                            <SponsorItem imgURL='ffu' website='https://ventures.jhu.edu/programs-services/fastforward-u/' imgSytle={{ width: size.width * blue * 1.5, maxHeight: "100%", marginTop: "5%" }} />
                        </motion.div>
                        <div>
                            <Typography className={classes.minititle} gutterBottom>Starter</Typography>
                        </div>
                        <motion.div class={classes.logos}
                            initial={"offscreen"}
                            whileInView={"onscreen"}
                            variants={imageAnimate}>
                            <SponsorItem imgURL='linode' website='https://www.linode.com/' imgSytle={{ width: size.width * starter * 1.25, maxHeight: "100%", marginTop: "5%" }} />
                            <SponsorItem imgURL='ground' website='https://www.groundcontrol.coffee/' imgSytle={{width: size.width * starter, maxHeight: "100%", marginTop: "1%"}}/>
                            <br></br>
                            <SponsorItem imgURL='wolfram-alpha' website='https://www.wolframalpha.com/' imgSytle={{width: size.width * starter * 2, maxHeight: "100%", marginTop: "5%"}}/>
                            <SponsorItem imgURL='Googlecloud' website='https://cloud.google.com/' imgSytle={{width: size.width * starter * 1.75, maxHeight: "100%", marginTop: "1%"}}/>
                        </motion.div>
                    </CardContent>
                </Card>
            </Box >
        </motion.div>

    );
}
