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
                <img src={img('fade_in.png')} style={{ position: "absolute", top: "0%", left: "0%", width: "100%", height: "100%" }} />
                <Button onClick={() => {
                    window.location = "/register";
                }}
                    color="inherit"
                    style={{ position: "absolute", top: "75%", left: "39.50%", width: "20%", height: "10%" }}
                >
                    <img src={img('../register-button.png')}  style = {{width: "150%", height: "150%"}} />
                </Button>
            </div>
        </div>

    );
}