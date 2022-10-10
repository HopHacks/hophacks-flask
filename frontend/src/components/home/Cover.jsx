import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { motion, useScroll } from "framer-motion/dist/framer-motion"; // Needs to be added to requirements.txt

const useStyles = makeStyles({});

function img(url) {
  return process.env.PUBLIC_URL + "/images/" + url;
}

export default function Cover() {
  const [imageLoading, setImageLoading] = useState(true);
  const [pulsing, setPulsing] = useState(true);

  const imageLoaded = () => {
    setImageLoading(false);
    setTimeout(() => setPulsing(false), 600);
  };

  const classes = useStyles();
  if (window.innerWidth <= 650) {
    return (
      <div>
        <div>
          <img
            src={img("team-page.png")}
            style={{
              position: "absolute",
              top: "7.5%",
              left: "0%",
              width: "100%",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              style={{
                position: "absolute",
                top: "36%",
                width: "40%",
              }}
            >
              <a href="https://tinyurl.com/hophacksapp" target="_blank">
                <img src={img("join_the_team.png")} style={{ width: "100%" }} />
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div>
          <img
            src={img("cover2.png")}
            style={{
              position: "absolute",
              top: "0%",
              left: "0%",
              width: "100%",
              height: "100%",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              style={{
                position: "absolute",
                top: "70%",
                width: "25%",
              }}
            >
              <a href="https://tinyurl.com/hophacksapp" target="_blank">
                <img src={img("join_the_team.png")} style={{ width: "100%" }} />
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
