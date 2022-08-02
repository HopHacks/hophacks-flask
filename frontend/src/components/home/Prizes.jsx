import React, { useState, useEffect }from "react";

import Box from '@material-ui/core/Box';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { motion, useTransform, useViewportScroll, useAnimation } from 'framer-motion/dist/framer-motion'
import { useInView } from "react-intersection-observer";
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({

    title: {
        color: "#ffffff",
        fontFamily: "Inter",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "375%"
    },

    color: {
        backgroundColor: "#d1e9ff",
        
    },

    birds: {
        backgroundColor: "transparent",
        width: "80%",
        left: "10%",
        position: "relative"
    },

    card: {
        position: "relative",
        border: "none", 
        boxShadow: "none",
        backgroundColor: "transparent",
        left: "-22px"
    },

    chatBox1: {
        backgroundColor: "transparent",
        position: 'absolute',
        top: "25%",
        left: "25%",
        width: "15.5%",
    },

    chatBox2: {
        backgroundColor: "transparent",
        position: 'absolute',
        top: "4%",
        left: "43.7%",
        width: "15.5%",
    },

    chatBox3: {
        backgroundColor: "transparent",
        position: 'absolute',
        top: "33%",
        left: "60%",
        width: "15.5%",
    },
    
});



function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
}




export default function Prizes() {

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


      const imageAnimate = {
        offscreen: { x: -30, opacity: 0 },
        onscreen: {
            x: 0,
            opacity: 1,
            duration: 3,
            transition: {
                type: "spring",
                bounce: 0.3,
                duration: 3
            }
        }
    }

    const classes = useStyles();

    return (
        <Box py={1} >
            <Grid container spacing={2}  alignItems="center" style={{ marginTop:"14%"}}>
                <Grid item xs={4}>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.title} variant="h4" style={{marginTop: "-18%", marginBottom: "0"}} gutterBottom>
                Prizes
              </Typography>
            </Grid>              
            </Grid>
            <Card className={classes.card}>
                <motion.div
                    initial={"offscreen"}
                    whileInView={"onscreen"}
                    variants={imageAnimate}>
                    <CardMedia
                        component="img"
                        className={classes.birds}
                        image={img('Birds.png')}
                    />
                
                    <div>
                        <CardMedia
                            component="img"
                            image={img('2nd_chatbox.png')}
                            className={classes.chatBox1}
                        />
                    </div>
                    <div>
                        <CardMedia
                            component="img"
                            image={img('1st_chatbox.png')}
                            className={classes.chatBox2}
                        />
                    </div>
                    <div>
                        <CardMedia
                            component="img"
                            image={img('3rd_chatbox.png')}
                            className={classes.chatBox3}
                        />
                    </div>  
                </motion.div>                   
            </Card>
        </Box>
    );
}
