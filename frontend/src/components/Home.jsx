import React from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Team from "./home/Team";
import Sponsors from "./home/Sponsors";
import Prizes from "./home/Prizes";
import Schedule from "./home/Schedule";
import About from "./home/About";
import Faq from "./home/Faq";
import Cover from "./home/Cover";
import LoadingAnimation from "./home/LoadingAnimation";
import { useState, useEffect } from "react";
import AboutTransition from "./home/AboutTransition";
import Footer from "./Footer";
import { motion, useScroll } from "framer-motion/dist/framer-motion"; // Needs to be added to requirements.txt

const useStyles = makeStyles({
  logo: {
    top: "25%",
    width: "60vw", // This is centered, 20 - 60 - 20
    left: "20vw",
    position: "absolute",
    textAlign: "center",
  },
  margin: {
    marginBottom: "13px",
  },
  color: {
    //backgroundColor: "#2195ea",
    backgroundColor: "#376efa",
  },
  colorBackground: {
    backgroundColor: "#376eea",
  },
  title: {
    color: "#ffffff",
    fontFamily: "VCR OSD Mono",
  },

  button: {
    backgroundColor: "#FFFFFF",
    color: "#c8e7fa",
    width: "50%",
    minHeight: "50px",
    border: "4px solid",
    "&:hover": {
      backgroundColor: "#c8e7fa",
    },
  },
  gradient: {
    backgroundImage: "linear-gradient(#15ABFB, #f179c8)",
  },

  blank: {
    padding: "30px",
    backgroundColor: "#c8e7fa",
  },
});

export default function Home() {
  const [loading, setLoading] = useState(true);

  const classes = useStyles();

  function img(url) {
    return process.env.PUBLIC_URL + "/images/" + url;
  }

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    function handleWindowResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    return (
        <div className={classes.gradient}>
            {loading ? (<LoadingAnimation />)
                : (<Container fixed>
                <motion.div class={classes.logos}
                    initial={"onscreen"}
                    whileInView={"offscreen"}
                    variants={CoverAnimate}
                    viewport={{ once: false }}>
                <Cover />
                </motion.div>
                <AboutTransition />
                <About />
                <Schedule />
                <Prizes />
                <Sponsors />
                <Faq />
                <span STYLE="font-size:300%" >&nbsp;&nbsp;</span>
                <Footer />
                </Container>)
            }
        </div>
    );
}
