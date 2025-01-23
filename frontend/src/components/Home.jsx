/* eslint-disable react/no-unknown-property */
import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Sponsors from './home/Sponsors';
import Schedule from './home/Schedule';
import About from './home/About';
import Faq from './home/Faq';
import Cover from './home/Cover';
import LoadingAnimation from './home/LoadingAnimation';
import { useState, useEffect } from 'react';
import Footer from './Footer';
import Prizes from './home/Prizes';
import Tracks from './home/Tracks';
// import { motion, useScroll } from 'framer-motion/dist/framer-motion'; // Needs to be added to requirements.txt
// import { Parallax, ParallaxLayer } from "@react-spring/parallax";

// CODE QUALITY: need to standardize styling
const useStyles = makeStyles({
  logo: {
    top: '25%',
    width: '60vw', // This is centered, 20 - 60 - 20
    left: '20vw',
    position: 'absolute',
    textAlign: 'center'
  },
  margin: {
    marginBottom: '13px'
  },
  colorBackground: {
    backgroundColor: '#bfeafc'
  },
  title: {
    color: '#061A40',
    fontFamily: 'VCR OSD Mono'
  },

  button: {
    backgroundColor: '#FFFFFF',
    color: '#c8e7fa',
    width: '50%',
    minHeight: '50px',
    border: '4px solid',
    '&:hover': {
      backgroundColor: '#c8e7fa'
    }
  },
  blank: {
    padding: '30px',
    backgroundColor: '#c8e7fa'
  }
});

export default function Home() {
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const [, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 0);

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

  // const CoverAnimate = {
  //   offscreen: { y: 0, opacity: 1 },
  //   onscreen: {
  //     y: 0,
  //     opacity: 0.7,
  //     transition: {
  //       type: "spring",
  //       bounce: 0.0,
  //     },
  //   },
  // };
  return (
    <div className={classes.colorBackground}>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div>
          <Cover />
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <Container fixed>
            <About />
            <Prizes />
            <Schedule />
            <Tracks />
            <Sponsors />
            <Faq />
          </Container>
          <br></br>
          <br></br>
          <br></br>
          <Footer />
        </div>
      )}
    </div>
  );
}
