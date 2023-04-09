import React from 'react';
import Box from '@material-ui/core/Box';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import { motion, useTransform, useViewportScroll } from 'framer-motion/dist/framer-motion';
import { useState, useEffect } from 'react';

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
    width: '65%',
    marginLeft: '33%',
    backgroundColor: 'transparent'
  },
  moveDown: {
    top: 'px'
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
    fontSize: '188px',
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
    fontSize: '188px',
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
    fontSize: '188px',
    lineHeight: '304px'
  }
});

export default function AboutTransition() {
  const classes = useStyles();
  function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
  }
  const { scrollY } = useViewportScroll();

  const xRight = useTransform(scrollY, [800, 0], ['-15%', '23vw']);

  const xLeft = useTransform(scrollY, [800, 0], ['25%', '-15vw']);

  const xLeft2 = useTransform(scrollY, [800, 0], ['45%', '25vw']);

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
    <div style={{ position: 'relative', marginTop: windowSize.height * 0.93 }}>
      <Box className={classes.color}>
        {/* <div className={classes.moveDown}> */}
        <CardMedia component="img" className={classes.Media} image={img('About_Background.png')} />
        <motion.Typography
          className={classes.font1}
          style={{
            x: xLeft
          }}
        >
          About
        </motion.Typography>
        <motion.Typography
          className={classes.font2}
          style={{
            x: xRight
          }}
        >
          About
        </motion.Typography>
        <motion.Typography
          className={classes.font3}
          style={{
            x: xLeft2
          }}
        >
          About
        </motion.Typography>
        {/* </div> */}
      </Box>
    </div>
  );
}
