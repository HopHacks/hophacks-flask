import React, { useEffect } from "react";
import Box from '@material-ui/core/Box';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import { motion, useTransform, useViewportScroll } from 'framer-motion/dist/framer-motion';
import styled from "styled-components";

const useStyles = makeStyles({

  margin: {
    marginBottom: "13px",
  },
  color: {
    backgroundColor: "transparent",
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
    backgroundColor: "transparent",
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

});

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  font-family: Inter;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
`;

const Word = styled(motion.span)`
  display: inline-block;
  margin-right: 0.25em;
  white-space: nowrap;
`;

const Character = styled(motion.span)`
  display: inline-block;
  margin-right: -0.05em;
`;



export default function AboutTransition() {

  const classes = useStyles();
  function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
  };
  const { scrollY } = useViewportScroll();


  const scaleRight = useTransform(scrollY, [0, 500], [2, 1]);


  const xRight = useTransform(scrollY, [800, 0], ["-15%", "23vw"]);

  const xLeft = useTransform(scrollY, [800, 0], ["25%", "-20vw"]);

  const xLeft2 = useTransform(scrollY, [800, 300], ["25%", "-5vw"]);

  return (
    <div style={{position: "relative"}}>
    <Box className={classes.color} >
        <CardMedia
          component="img"
          className={classes.Media}
          image={img('About_Background.png')}
        />
        <motion.Typography
          className={classes.font1} style={{
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
    </Box>
    </div >
  );
}