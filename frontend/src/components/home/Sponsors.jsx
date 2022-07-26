import React, { useState, useEffect } from 'react'

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion/dist/framer-motion'// Needs to be added to requirements.txt


const config = { mass: 2, tension: 2000, friction: 200 };

const useStyles = makeStyles({

    title: {
        color: "#ffffff",
        fontFamily: "Inter",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "375%"
    },
    contact: {
        color: "#ffffff",
        fontFamily: "Inter",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "100%"
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

    const gold = 0.6;
    const sable = 0.5;
    const blue = 0.4;
    const starter = 0.3;

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        function handleWindowResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    const textAnimate = {
        offscreen: { y: 0, opacity: 0 },
        onscreen: {
            y: 0,
            opacity: 1,
            duration: 3,
            transition: {
                type: "spring",
                bounce: 0.0,
                duration: 6
            }
        }
    }

    const imageAnimate = {
        offscreen: { x: -50, opacity: 0 },
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

    return (
        <motion.div>
            <Box py={2}>
                <div>
                    <Grid container spacing={2} justify="center" alignItems="center">
                        <Grid item xs={4}>
                            <img style={{ marginLeft: "40%", marginBottom: "0%", width: "60%" }} src={img("home_bg/4_edit.png")} />
                        </Grid>
                        <Grid item xs={4}>
                            <h4 className={classes.title} style={{ marginTop: "30%" }} >Sponsors</h4>
                            <h5 className={classes.contact} gutterBottom>Interested in sponsoring us? Email us at {<a href={`mailto:hophacks.sponsors@gmail.com`}>hophacks.sponsors@gmail.com</a>}</h5>
                        </Grid>
                        <Grid item xs={4}></Grid>
                    </Grid>

                    <Divider style={{ marginBottom: "3%" }} />
                </div>
                <motion.div class={classes.logos}
                    initial={"offscreen"}
                    whileInView={"onscreen"}
                    variants={imageAnimate}>
                    <Grid container spacing={2} justify="center" alignItems="center">
                        <SponsorItem imgURL='it_hori_brush' website='https://it.johnshopkins.edu/' imgSytle={{ width: windowSize.width * sable, maxHeight: "100%", marginTop: "5%", marginBottom: "5%" }} />
                        <SponsorItem imgURL='scm_hori_brush' website='https://www.scm-lp.com' imgSytle={{ width: windowSize.width * blue, maxHeight: "100%", marginTop: "5%", marginBottom: "5%", marginLeft: "5%" }} />
                    </Grid>
                </motion.div>
                <motion.div class={classes.logos}
                    initial={"offscreen"}
                    whileInView={"onscreen"}
                    variants={imageAnimate}>
                    <Grid container spacing={2} justify="center" alignItems="center">
                        <SponsorItem imgURL='wolfram_alpha_brush' website='https://www.wolframalpha.com/' imgSytle={{ width: windowSize.width * starter, maxHeight: "100%", marginTop: "2%" }} />
                        <SponsorItem imgURL='google_cloud_brush' website='https://cloud.google.com/' imgSytle={{ width: windowSize.width * starter, maxHeight: "100%", marginTop: "0%", marginLeft: "5%" }} />
                    </Grid>
                </motion.div>
                <Divider style={{ marginTop: "3%", marginBottom: "3%" }} />
                {/*
                        <motion.div
                            initial={"offscreen"}
                            whileInView={"onscreen"}
                            variants={textAnimate}>
                            <Typography className={classes.minititle} gutterBottom>Gold</Typography>
                        </motion.div>
                        <motion.div class={classes.logos}
                            initial={"offscreen"}
                            whileInView={"onscreen"}
                            variants={imageAnimate}>
                            <Grid container spacing={2} justify="center" alignItems="center">
                                <Grid item xs={6}>
                                    <SponsorItem imgURL='Bloomberg' website='https://www.bloomberg.com/' imgSytle={{ width: windowSize.width * gold}} />
                                </Grid>
                                <Grid item xs={6}>
                                    <SponsorItem imgURL='yet' website='https://www.yetanalytics.com/' imgSytle={{ width: windowSize.width * gold, marginTop: "4%"}} />
                                </Grid>
                            </Grid>
                        </motion.div>
                        
                        <motion.div
                            initial={"offscreen"}
                            whileInView={"onscreen"}
                            variants={textAnimate}>
                            <Typography className={classes.minititle} gutterBottom>Sable</Typography>
                        </motion.div>
                        <motion.div class={classes.logos}
                            initial={"offscreen"}
                            whileInView={"onscreen"}
                            variants={imageAnimate}>
                            <Grid container spacing={2} justify="center" alignItems="center">
                                <Grid item xs={6}>
                                    <SponsorItem imgURL='apl' website='https://www.jhuapl.edu/' imgSytle={{ width: windowSize.width * sable * 1.5 , maxHeight: "100%", marginTop: "5%" }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <SponsorItem imgURL='one' website='https://www.capitalone.com/' imgSytle={{ width: windowSize.width * sable, maxHeight: "100%", marginTop: "5%" }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <SponsorItem imgURL='SIEMENS' website='https://www.siemens-healthineers.com/' imgSytle={{ width: windowSize.width * sable, maxHeight: "100%", marginTop: "7%" }} />
                                </Grid>
                                    <SponsorItem imgURL='it' website='https://it.johnshopkins.edu/' imgSytle={{ width: windowSize.width * sable / 1.4, maxHeight: "100%", marginTop: "5%" , marginBottom: "5%"}} />
                                
                            </Grid>
                        </motion.div>
                        <motion.div
                            initial={"offscreen"}
                            whileInView={"onscreen"}
                            variants={textAnimate}>
                            <Typography className={classes.minititle} gutterBottom>Blue</Typography>
                        </motion.div>
                        <motion.div class={classes.logos}
                            initial={"offscreen"}
                            whileInView={"onscreen"}
                            variants={imageAnimate}>
                            <Grid container spacing={2} justify="center" alignItems="center">
                                
                                <Grid item xs={6}>
                                    <SponsorItem imgURL='ffu' website='https://ventures.jhu.edu/programs-services/fastforward-u/' imgSytle={{ width: windowSize.width * blue * 2, maxHeight: "100%", marginTop: "5%"}} />
                                </Grid>
                                 
                                    <SponsorItem imgURL='scm' website='https://www.scm-lp.com' imgSytle={{ width: windowSize.width * blue * 0.7, maxHeight: "100%", marginTop: "5%", marginBottom: "5%"}} />
                                
                            </Grid>
                        </motion.div>
                        <motion.div
                            initial={"offscreen"}
                            whileInView={"onscreen"}
                            variants={textAnimate}>
                            <Typography className={classes.minititle} gutterBottom>Starter</Typography>
                        </motion.div>
                        <motion.div class={classes.logos}
                            initial={"offscreen"}
                            whileInView={"onscreen"}
                            variants={imageAnimate}>
                            <Grid container spacing={2} justify="center" alignItems="center">
                                
                                <Grid item xs={3}>
                                    <SponsorItem imgURL='linode' website='https://www.linode.com/' imgSytle={{ width: windowSize.width * starter, maxHeight: "100%", marginTop: "5%" }} />
                                </Grid>
                                <Grid item xs={3}>
                                    <SponsorItem imgURL='ground' website='https://www.groundcontrol.coffee/' imgSytle={{width: windowSize.width * starter * 0.75, maxHeight: "100%", marginTop: "1%"}}/>
                                </Grid>
                                
                                
                                <Grid item xs={6}>
                                    <SponsorItem imgURL='wolfram-alpha' website='https://www.wolframalpha.com/' imgSytle={{width: windowSize.width * starter*1.4, maxHeight: "100%", marginTop: "2%"}}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <SponsorItem imgURL='Googlecloud' website='https://cloud.google.com/' imgSytle={{width: windowSize.width * starter*1.4, maxHeight: "100%", marginTop: "0%"}}/>
                                </Grid>
                                
                            </Grid>
                            <br></br>
                        </motion.div>
                        */}

            </Box >
        </motion.div>

    );
}
