import React, { useEffect } from "react";
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { motion, useTransform, useViewportScroll, useAnimation } from 'framer-motion/dist/framer-motion';
import { useInView } from "react-intersection-observer";
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
    // comment
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



export default function About() {
  const classes = useStyles();
  function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
  }
  const { scrollY } = useViewportScroll();

  const introText = 'HopHacks is a 36-hour biannual Hackathon held at the Johns Hopkins University that encourages engineers, designers, and entrepreneurs to explore new ideas and create new applications. Teams of up to 4 university students work on projects from scratch. At the end of the hackathon, teams present their projects to judges and compete for prizes ($1024, $512, $256 for top 3 winners and sponsor specific prizes)!'
  const ctrls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      ctrls.start("visible");
    }
    if (!inView) {
      ctrls.start("hidden");
    }
  }, [ctrls, inView]);

  const wordAnimation = {
    hidden: {},
    visible: {},
  };

  const characterAnimation = {
    hidden: {
      opacity: 0,
      y: `0.25em`,
    },
    visible: {
      opacity: 1,
      y: `0em`,
      transition: {
        duration: 1,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  const scaleRight = useTransform(scrollY, [0, 500], [2, 1]);
  const yRight = useTransform(scrollY, [0, 500], ["25vh", "0vh"]);
  const xRight = useTransform(scrollY, [1500, 300], ["15%", "-23vw"]);

  const xLeft = useTransform(scrollY, [1500, 300], ["-25%", "20vw"]);

  const xLeft2 = useTransform(scrollY, [1500, 300], ["5%", "100vw"]);


  return (
    <div style={{ position: "relative" }}>
      <Box className={classes.color} >
          <Title aria-label={introText} role="heading">
            {introText.split(" ").map((word, index) => {
              return (
                <Word
                  ref={ref}
                  aria-hidden="true"
                  key={index}
                  initial="hidden"
                  animate={ctrls}
                  variants={wordAnimation}
                  transition={{
                    delayChildren: index * 0.03,
                    staggerChildren: 0.05,
                  }}>
                  {word.split("").map((character, index) => {
                    return (
                      <Character
                        aria-hidden="true"
                        key={index}
                        variants={characterAnimation}
                      >
                        {character}
                      </Character>
                    );
                  })}
                </Word>
              );
            })}
          </Title>
      </Box>
    </div>
  );
}
