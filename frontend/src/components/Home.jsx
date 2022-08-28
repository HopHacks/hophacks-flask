import React from "react";
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Team from './home/Team';
import Sponsors from "./home/Sponsors";
import Prizes from "./home/Prizes";
import Schedule from "./home/Schedule";
import About from "./home/About"
import Faq from "./home/Faq"
import Cover from "./home/Cover";
import LoadingAnimation from "./home/LoadingAnimation";
import { useState, useEffect } from "react";
import AboutTransition from "./home/AboutTransition";
import Footer from "./Footer"
import { motion, useScroll } from 'framer-motion/dist/framer-motion'// Needs to be added to requirements.txt


const useStyles = makeStyles({
    logo: {
        top: '25%',
        width: '60vw', // This is centered, 20 - 60 - 20
        left: '20vw',
        position: 'absolute',
        textAlign: 'center',
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
        backgroundColor: "#FFFFFF", color: "#c8e7fa", width: "50%", minHeight: "50px", border: "4px solid",
        "&:hover": {
            backgroundColor: "#c8e7fa",
        }
    },
    gradient: {
        backgroundImage: "linear-gradient(#15ABFB, #f179c8)",
    },

    blank: {
        padding: "30px",
        backgroundColor: "#c8e7fa"
    },
}
);

export default function Home() {
    const [loading, setLoading] = useState(true);

    const classes = useStyles();

    function img(url) {
        return process.env.PUBLIC_URL + '/images/' + url;
    }

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });



    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000);

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

    }, [])

    const CoverAnimate = {
        offscreen: { y: 0, opacity: 0.7 },
        onscreen: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                bounce: 0.0
            }
        }
    }

    if (window.innerWidth <= 650) {
        return (
            <div>

                <div className={classes.gradient}>
                    <div>
                        <a id="mlh-trust-badge"
                            style={{ 'display': 'block', 'maxWidth': '100px', 'minWidth': '60px', 'position': 'fixed', 'right': '30px', 'top': '0', 'width': '10%', 'zIndex': '10000' }}
                            href="https://mlh.io/seasons/2022/events?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2022-season&utm_content=gray"
                            target="_blank">
                            <img src="https://s3.amazonaws.com/logged-assets/trust-badge/2022/mlh-trust-badge-2022-gray.svg" alt="Major League Hacking 2022 Hackathon Season" style={{ "width": "100%" }}></img>
                        </a>
                        <div>
                            {loading
                                ? (<LoadingAnimation />)
                                : (
                                    <>
                                        <Container fixed>
                                            <Cover />
                                            <AboutTransition />
                                            <About />
                                            <Schedule />
                                            <Prizes />
                                            <Sponsors />
                                            <Faq />
                                            <span STYLE="font-size:300%" >&nbsp;&nbsp;</span>
                                            {/* <Team /> */}

                                        </Container>
                                        <Footer />

                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={classes.gradient}>
                <div>
                    <div id="parallax" className="parallax">
                        <div className="parallax-body">
                            <main className="site-wrapper">
                                <div className="content">
                                    <div className="slide-wrapper">
                                        <div className="slide-item">
                                            <img src={img("cover2.png")} className="slide-item__image"></img>
                                        </div>
                                        <div className="slide-item">
                                            <img src={img("transparent.png")} className="slide-item__image"></img>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
    
                    <div>
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
                                {/* <Team /> */}
                                <Footer />
                            </Container>)
                        }
                    </div>
                </div>
            </div>
        );
    }

}

