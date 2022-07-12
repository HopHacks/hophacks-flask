import React from "react";
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Team from './home/Team';
import Sponsors from "./home/Sponsors";
import Prizes from "./home/Prizes";
import Schedule from "./home/Schedule";
import About from "./home/About"
import Faq from "./home/Faq"
import '../stylesheets/home.css'
import { useState, useEffect } from "react";
import AboutTransition from "./home/AboutTransition";
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Footer from "./Footer"


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
  }
}
);

export default function Home() {
  const [loading, setLoading] = useState(true);

  const classes = useStyles();

  function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000);
    const script1 = document.createElement("script");
    const script2 = document.createElement("script");
    const script3 = document.createElement("script");
    const script4 = document.createElement("script");

    script1.src = "pixi.min.js";
    script1.async = false;

    script2.src = "TweenMax.min.js";
    script2.async = false;

    script3.src = "main.js";
    script3.async = false;

    script4.src = "home.js";
    script4.async = false;

    document.body.appendChild(script1);
    document.body.appendChild(script2);
    document.body.appendChild(script3);
    document.body.appendChild(script4);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
      document.body.removeChild(script3);
      document.body.removeChild(script4);
    }

  }, [])

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
            <div id="parallax" className="parallax">
              <div className="parallax-body">
                <main className="site-wrapper">
                  <div className="content">
                    <div className="slide-wrapper">
                      <div className="slide-item">
                        <img src={img("team-page.png")} className="slide-item__image"></img>
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
              {loading
                ? (<div>
                  <img src={img('dark_blue_bg.jpg')} style={{ position: "fixed", bottom: "0%", right: "0%", width: "100%", height: "100%" }} />
                  <img src={img('footer/bluejay-icon.png')} style={{ position: "fixed", bottom: "50%", right: "40%", width: "15%" }} />
                  <LinearProgress color="secondary" style={{ position: "fixed", bottom: "50%", right: "25%", width: "50%" }} />
                </div>)
                : (
                  <>
                    <Container fixed>
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
      <div>
        <div className={classes.gradient}>
          <div>
            <a id="mlh-trust-badge"
              style={{ 'display': 'block', 'maxWidth': '100px', 'minWidth': '60px', 'position': 'fixed', 'right': '30px', 'top': '0', 'width': '10%', 'zIndex': '10000' }}
              href="https://mlh.io/seasons/2022/events?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2022-season&utm_content=gray"
              target="_blank">
              <img src="https://s3.amazonaws.com/logged-assets/trust-badge/2022/mlh-trust-badge-2022-gray.svg" alt="Major League Hacking 2022 Hackathon Season" style={{ "width": "100%" }}></img>
            </a>
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
              {loading
                ? (<div>
                  <img src={img('dark_blue_bg.jpg')} style={{ position: "fixed", bottom: "0%", right: "0%", width: "100%", height: "100%" }} />
                  <img src={img('footer/bluejay-icon.png')} style={{ position: "fixed", bottom: "50%", right: "40%", width: "15%" }} />
                  <LinearProgress color="secondary" style={{ position: "fixed", bottom: "50%", right: "25%", width: "50%" }} />
                </div>)
                : (
                  <>

                    <Container fixed>
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
  }

}

