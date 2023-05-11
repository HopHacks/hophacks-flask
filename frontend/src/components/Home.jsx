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
    backgroundColor: '#350225'
  },
  title: {
    color: '#ffffff',
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
  const [loading, setLoading] = useState(true);

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

  return (
    <div className={classes.colorBackground}>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div>
          <Cover />
          <Container fixed>
            <About />
            <Schedule />
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
