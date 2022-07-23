import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles({});

function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
}

export default function Cover() {
    const classes = useStyles();
    return (
        <div>
        <img src={img('cover.png')} style={{ position: "absolute", top: "0%", left: "0%", width: "100%", height: "100%"}} />
            <img src={img('logo2022.png')} style={{ position: "absolute", top: "25%", left: "40%", width: "22.5%", height: "50%"}} />
            <Button onClick={() => {
                  window.location = "/register";
                }} 
                color="inherit"
                style={{ position: "absolute", top: "75%", left: "41.25%", width: "20%", height: "10%"}}
                >
                <img src={img('../register-button.png')}/>
            </Button>
        </div>
    ); 
}