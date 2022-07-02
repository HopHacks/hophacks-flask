import React from "react";
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { motion, useMotionValue, useTransform, useViewportScroll } from 'framer-motion/dist/framer-motion';


const useStyles = makeStyles({

    margin: {
        marginBottom: "13px",
    },
    color: {
        backgroundColor: "#278be2",
    },
    title: {
        color: "#7289da",
        fontFamily: "VCR OSD Mono",
    },
    Media: {
        // height: '50%',
        // width: '55%',
        // objectFit: 'cover', 
        // justifyContent:'center'
        width: '65%',
        marginLeft: '33%',
        backgroundColor: "#278be2",
    },
    font1: {
        position: "absolute",
        width: '1127.38px',
        height: '353.64px',
        left: '415px',
        top: '110px',
        color: "rgba(255, 255, 255, 0.6)",
        backgroundColor: "none",
        fontFamily: "Inter",
        fontWeight: '700',
        fontStyle: 'italic',
        fontSize: '251.02px',
        lineHeight: '304px'

    }, 

    font2: {
        position: "absolute",
        width: '1127.38px',
        height: '353.64px',
        left: '200px',
        top: '400px',
        color: "rgba(255, 255, 255)",
        backgroundColor: "none",
        fontFamily: "Inter",
        fontWeight: '700',
        fontStyle: 'italic',
        fontSize: '251.02px',
        lineHeight: '304px'

    }, 

    font3: {
        position: "absolute",
        width: '1127.38px',
        height: '353.64px',
        left: '0px',
        top: '690px',
        color: "rgba(255, 255, 255, 0.6)",
        backgroundColor: "none",
        fontFamily: "Inter",
        fontWeight: '700',
        fontStyle: 'italic',
        fontSize: '251.02px',
        lineHeight: '304px'

    }, 

    intro: {
        // position: "absolute",
        // width: '1127.38px',
        // height: '353.64px',
        left: '58px',
        top: '1407px',
        color: "rgba(255, 255, 255, 0.8)",
        backgroundColor: "none",
        fontFamily: "Inter",
        fontWeight: '400',
        fontStyle: 'normal',
        fontSize: '36px',
        lineHeight: '58px',
        textAlign: 'center',
        letterSpacing: "0.11em",
    }, 

});



export default function About() {
    const classes = useStyles();
    function img(url) {
        return process.env.PUBLIC_URL + '/images/' + url;
    }
    const { scrollY } = useViewportScroll();

    const scaleRight = useTransform(scrollY, [0, 500], [2, 1]);
    const yRight = useTransform(scrollY, [0, 500], ["25vh", "0vh"]);
    const xRight = useTransform(scrollY, [800, 100], ["15%", "-23vw"]);

    const xLeft = useTransform(scrollY, [800,100], ["-25%", "20vw"]);

    const xLeft2 = useTransform(scrollY, [1500,300], ["5%", "100vw"]);
 

    return (
    <div style={{ position: "relative" }}>
        <Card className={classes.color} >
            <CardContent>
            <CardMedia
                component="img"
                className={classes.Media}
                image={img('About_Background.png')}
            />
            {/* <img src={img('About_Background.png')} style={{
                // 'width': '14vw',
            }} /> */}
            <motion.Typography
                className={classes.font1}  style={{
                    x: xLeft,
                }}>
                
                About
            </motion.Typography>
            <motion.Typography
                className={classes.font2} style={{
                    x: xRight,
                }}>
                About
            </motion.Typography>
            <motion.Typography
                className={classes.font3} style={{
                    x: xLeft2,
                }}>
                About
            </motion.Typography>
                    <Typography className={classes.intro}>
                        HopHacks is a 36-hour biannual Hackathon held at the Johns Hopkins University that encourages engineers, designers, and entrepreneurs to explore new ideas and create new applications. Teams of up to 4 university students work on projects from scratch. At the end of the hackathon, teams present their projects to judges and compete for prizes!
                            
                    </Typography>
            </CardContent>
        </Card>
    </div>
    );
}