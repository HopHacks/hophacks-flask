import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { motion, useScroll } from "framer-motion/dist/framer-motion"; // Needs to be added to requirements.txt

const useStyles = makeStyles({});

function img(url) {
  return "https://hophacks-website.s3.amazonaws.com" + "/images/" + url;
}

export default function Cover() {
  const [imageLoading, setImageLoading] = useState(true);
  const [pulsing, setPulsing] = useState(true);
  const preScroll = useRef(null);
  const elemRef = useRef(null);
  const [scale, setScale] = useState(1);

  const maxZoom=2
  const minZoom=0.5
  function newScale(scale)
  {
    if(scale*1.05>maxZoom)
    {
      return maxZoom;
    }
    else
    {
      return scale * 1.05;
    }
  }

  function newScale2(scale)
  {
    if(scale*.95<minZoom)
    {
      return minZoom;
    }
    else
    {
      return scale * .95;
    }
  }

  useEffect(()=> {
    console.log(scale);
  }, [scale]
  );
  useLayoutEffect(() => {
    const botPos = (element) => element.getBoundingClientRect().bottom;
    const onScroll = () => {
      const divBotPos = botPos(elemRef.current);
      const scrollPos = preScroll.current > window.scrollY;
      preScroll.current = window.scrollY;
      console.log(scrollPos)
      console.log(divBotPos + " " + window.innerHeight)

      if (scrollPos) {
        const number=scale*.95;
        setScale((scale)=> newScale2(scale));
        return;
      }
      else if (divBotPos < window.innerHeight) {
        setScale((scale)=> newScale(scale));
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const imageLoaded = () => {
    setImageLoading(false);
    setTimeout(() => setPulsing(false), 600);
  };

  const classes = useStyles();
  if (window.innerWidth <= 650) {
    return (
      <div>
        <div  >
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
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div ref={elemRef}>
          <img
            src={img("2023_theme.png")}
            style={{
              position: "absolute",
              top: "0%",
              left: "0%",
              width: "100%",
              height: "100%",
              transform: `scale(${scale})`,

            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
          </div>
        </div>
      </div>
    );
  }
}
