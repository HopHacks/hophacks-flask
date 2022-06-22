import React from "react";

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ReactDOM from "react-dom";
import { Controller, Scene } from "react-scrollmagic";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import { useWindowSize } from "react-use";
import { useTrail, animated } from "react-spring";

const config = { mass: 2, tension: 2000, friction: 200 };

const useStyles = makeStyles({

    title: {
        color: "#ffffff",
        fontFamily: "Inter",
        fontWeight: "bold",
        // fontStyle: "italic",
        textAlign: "left",
        fontSize: "375%"
    },
    minititle: {
        color: "#ffffff",
        fontFamily: "Inter",
        fontWeight: "bold",
        // fontStyle: "italic",
        textAlign: "center",
        fontSize: "250%",
    },
    card: {
        backgroundColor: "#278be2",
    },
});

const goldList = [
    {name: 'Bloomberg', 
    imgURL: 'Bloomberg',
    website: 'https://www.bloomberg.com/'},
    {name: 'Yet Analytics', 
    imgURL: 'yet',
    website: 'https://www.yetanalytics.com/'},
    {name: 'Bloomberg', 
    imgURL: 'Bloomberg',
    website: 'https://www.bloomberg.com/'},
]

function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
}

function SponsorItem(props) {
    return (
        <a href={`${props.website}`}><img srcSet={img(`sponsor/png/${props.imgURL}.png`)} style={props.imgSytle} /></a>
    );
}

function Carousel(tier, datalist) {
    const size = useWindowSize();
    const sideRef = React.useRef(null);
    const controllerRef = React.useRef(null);

    const [scrollWidth, setScrollWidth] = React.useState(0);

    React.useLayoutEffect(() => {
        if (sideRef.current) {
          let boxWidth = 0;
    
          [...sideRef.current.children].forEach(c => {
            const childBox = c.getBoundingClientRect();
            boxWidth = boxWidth + childBox.width;
          });
    
          const w =
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
    
          const totalScrollWidth = boxWidth > w ? boxWidth - w : 0;
    
          setScrollWidth(totalScrollWidth);
        }
      }, [size.height, size.width]);

    return (
        <ParallaxProvider>
            <Controller ref={controllerRef}>
                <Scene
                    duration={scrollWidth}
                    pin
                    triggerHook={0.25}
                    enabled={size.width > 768}
                >
                    {progress => {
                    return (
                        <div>
                        <div
                            className="cnt"
                            style={{
                            transform: `translate3d(-${scrollWidth *
                                progress}px, 0, 0)`
                            }}
                        >
                            <div
                            className="content"
                            ref={sideRef}
                            style={{ width: scrollWidth }}
                            >
                            <div style={{ height: "100%", width: "2480px" }}>
                                <SponsorItem imgURL='Bloomberg' website='https://www.bloomberg.com/' imgSytle={{width: size.width * tier, maxHeight: "100%"}}/>            
                                <SponsorItem imgURL='Googlecloud' website='https://cloud.google.com/' imgSytle={{width: size.width * tier, maxHeight: "100%"}}/>
                                <SponsorItem imgURL='Bloomberg' website='https://www.bloomberg.com/' imgSytle={{width: size.width * tier, maxHeight: "100%"}}/>            
                            </div>
                            </div>
                        </div>
                        </div>
                    );
                    }}
                </Scene>
            </Controller>
        </ParallaxProvider>
    );
}

export default function Sponsors() {


    const classes = useStyles();

    const gold = 0.3;
    const sable = 0.25;
    const blue = 0.2;
    const starter = 0.15;

    return (
        <Box py={2}>
            <Card className={classes.card}>
                <CardContent>
                    {/*TODO material UI*/}
                    <Typography className={classes.title} variant="h4" gutterBottom>Sponsors</Typography>
                    <Typography className={classes.minititle} gutterBottom>Gold</Typography> {/* Will Style Better Later */}
                    {Carousel(gold, goldList)}

                    <Typography className={classes.minititle} gutterBottom>Sable</Typography> {/* Will Style Better Later */}
                    
                    <Typography className={classes.minititle} gutterBottom>Blue</Typography> {/* Will Style Better Later */}
                    
                    
                    <Typography className={classes.minititle} gutterBottom>Starter</Typography> {/* Will Style Better Later */}
                   

                    {/* <Grid container spacing={0} alignItems="center" justify="center">
                    <SponsorItem imgURL='Bloomberg' website='https://www.bloomberg.com/' imgSytle={{width: '100%', maxHeight: "100%"}}/>
                    </Grid>
                    
                    <Grid container spacing={0} alignItems="center" justify="center">
                    <SponsorItem imgURL='Googlecloud' website='https://cloud.google.com/' imgSytle={{width: '100%', maxHeight: "100%", marginTop: "1%"}}/>
                    </Grid> */}



                </CardContent>
            </Card>
        </Box>
    );
}
