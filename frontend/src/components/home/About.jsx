import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { motion, useAnimation } from 'framer-motion/dist/framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import {Typography} from "@material-ui/core";

const useStyles = makeStyles({
  margin: {
    marginBottom: '13px'
  },
  color: {
    backgroundColor: 'transparent'
  },
  title: {
    color: '#7289da',
    fontFamily: 'VCR OSD Mono'
  },
  Media: {
    // comment
    // height: '50%',
    // width: '55%',
    // objectFit: 'cover',
    // justifyContent:'center'
    width: '65%',
    marginLeft: '33%',
    backgroundColor: '#278be2'
  },
  font1: {
    position: 'absolute',
    width: '1127.38px',
    height: '353.64px',
    left: '415px',
    top: '110px',
    color: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'none',
    fontFamily: 'Inter',
    fontWeight: '700',
    fontStyle: 'italic',
    fontSize: '251.02px',
    lineHeight: '304px'
  },

  font2: {
    position: 'absolute',
    width: '1127.38px',
    height: '353.64px',
    left: '200px',
    top: '400px',
    color: 'rgba(255, 255, 255)',
    backgroundColor: 'none',
    fontFamily: 'Inter',
    fontWeight: '700',
    fontStyle: 'italic',
    fontSize: '251.02px',
    lineHeight: '304px'
  },

  font3: {
    position: 'absolute',
    width: '1127.38px',
    height: '353.64px',
    left: '0px',
    top: '690px',
    color: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'none',
    fontFamily: 'Inter',
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
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'none',
    fontFamily: 'Inter',
    fontWeight: '400',
    fontStyle: 'normal',
    fontSize: '36px',
    lineHeight: '58px',
    textAlign: 'center',
    letterSpacing: '0.11em'
  }
});

const Title = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  font-family: Inter;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
`;

function img(url) {
  return process.env.PUBLIC_URL + '/images/' + url;
}
function AboutIm(props) {
  return (
    <a href={`${props.website}`}>
      <img srcSet={img(`team/img/${props.imgURL}.jpg`)} style={props.imgSytle} />
    </a>
  );
}
function AboutLogo(props) {
  return (
    <a href={`${props.website}`}>
      <img srcSet={img(`${props.imgURL}.png`)} style={props.imgSytle} />
    </a>
  );
}

const Word = styled(motion.span)`
  display: inline-block;
  margin-right: 0.25em;
  white-space: nowrap;
`;

const Character = styled(motion.span)`
  display: inline-block;
  margin-right: -0.05em;
`;

export default function About() {
  const classes = useStyles();

  const introText =
    'HopHacks is a 36-hour biannual Hackathon held at the Johns Hopkins University that encourages engineers, designers, and entrepreneurs to explore new ideas and create new applications. Teams of up to 4 university students work on projects from scratch. At the end of the hackathon, teams present their projects to judges and compete for prizes ($1024, $512, $256 for top 3 winners and sponsor specific prizes)!';
  const ctrls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.6,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      ctrls.start('visible');
    }
    if (!inView) {
      ctrls.start('hidden');
    }
  }, [ctrls, inView]);

  const wordAnimation = {
    hidden: {},
    visible: {}
  };

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

  return (
    <div style={{ position: 'relative', marginTop: windowSize.height * 1.1 }}>
      {/*<Grid container alightItems="center" justify="center">*/}
      {/*  <Grid xs={6}>*/}
      {/*    <AboutLogo*/}
      {/*      imgURL="hoplogo"*/}
      {/*      imgSytle={{*/}
      {/*        maxHeight: '50%',*/}
      {/*        maxWidth: '50%'*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </Grid>*/}
      {/*</Grid>*/}
      <Box className={classes.color}>
        <Grid
          container
          spacing={4}
          justify="space-evenly"
          alignItems="center"
          style={{ marginTop: '2%' }}
        >
          <Grid item xs={12}>
            <AboutLogo
                imgURL="hoplogo"
                imgSytle={{
                  maxHeight: '20%',
                  maxWidth: '20%'
                }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h3" style={{ color: 'white', marginBottom: '20px'}}>About</Typography>
            <Typography variant="body1" paragraph style={{ color: 'white' }}>
              HopHacks is a 36-hour biannual Hackathon held at the Johns Hopkins University that encourages engineers, designers, and entrepreneurs to explore new ideas and create new applications.
              <br/>
              <br/>
              Teams of up to 4 university students work on projects from scratch. At the end of the hackathon, teams present their projects to judges and compete for prizes ($1024, $512, $256 for top 3 winners and sponsor specific prizes)!
            </Typography>
            {/*<Title aria-label={introText} role="heading">*/}
            {/*  {introText.split(' ').map((word, index) => {*/}
            {/*    return (*/}
            {/*      <Word*/}
            {/*        ref={ref}*/}
            {/*        aria-hidden="true"*/}
            {/*        key={index}*/}
            {/*        initial="hidden"*/}
            {/*        animate={ctrls}*/}
            {/*        variants={wordAnimation}*/}
            {/*        transition={{*/}
            {/*          delayChildren: index * 0.03,*/}
            {/*          staggerChildren: 0.05*/}
            {/*        }}*/}
            {/*      >*/}
            {/*        {word.split('').map((character, index) => {*/}
            {/*          return <Character key={index}>{character}</Character>;*/}
            {/*        })}*/}
            {/*      </Word>*/}
            {/*    );*/}
            {/*  })}*/}
            {/*</Title>*/}
          </Grid>
          <Grid item xs={6}>
            <AboutIm
              imgURL="AkhilDeo"
              imgSytle={{
                maxHeight: '85%',
                maxWidth: '85%',

              }}
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
