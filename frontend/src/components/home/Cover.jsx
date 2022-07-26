import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { motion, useScroll } from 'framer-motion/dist/framer-motion'// Needs to be added to requirements.txt



const useStyles = makeStyles({});

function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
}



export default function Cover() {
    const [imageLoading, setImageLoading] = useState(true);
    const [pulsing, setPulsing] = useState(true);

    const imageLoaded = () => {
        setImageLoading(false);
        setTimeout(() => setPulsing(false), 600);
    };


    const classes = useStyles();
    return (
        <div>
            <div>
                <img src={img('cover2.png')} style={{ position: "absolute", top: "0%", left: "0%", width: "100%", height: "100%" }} />
                 {/* <img src={img('logo2022.png')} style={{ position: "absolute", top: "25%", left: "40%", width: "22.5%", height: "50%" }} /> */}
                <Button onClick={() => {
                    window.location = "/register";
                }}
                    color="inherit"
                    style={{ position: "absolute", top: "75%", left: "39.50%", width: "20%", height: "10%" }}
                >
                    <img src={img('../register-button.png')} />
                </Button>
            </div>
            {/* <motion.img
                initial={{ height: "16rem", opacity: 0 }}
                // style={{ height: imageLoading ? "6rem" : "auto" }}
                animate={{
                    height: imageLoading ? "16rem" : "auto",
                    opacity: imageLoading ? 0 : 1
                }}
                transition={
                    ({ height: { delay: 0, duration: 0.4 } },
                        { opacity: { delay: 0.5, duration: 0.4 } })
                }
                onLoad={imageLoaded}
                width="100%"
                src={img('cover.png')} style={{ position: "absolute", top: "0%", left: "0%", width: "100%", height: "100%" }}
            />
            <img src={img('logo2022.png')} style={{ position: "absolute", top: "25%", left: "40%", width: "22.5%", height: "50%" }} />
                <Button onClick={() => {
                    window.location = "/register";
                }}
                    color="inherit"
                    style={{ position: "absolute", top: "75%", left: "41.25%", width: "20%", height: "10%" }}
                >
                    <img src={img('../register-button.png')} />
                </Button> */}
        </div>

    );
}