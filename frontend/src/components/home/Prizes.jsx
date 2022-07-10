import React from "react";

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles({

    title: {
        fontFamily: "VCR OSD Mono",
    },

    prizetitle: {
        
        fontFamily: "VCR OSD Mono",
    },

    color: {
        backgroundColor: "#d1e9ff",
        
    },
    margin: {
        minWidth:"100px",
        width: "15%",
    },

    margin2: {
        minWidth:"100px",
        width: "20%",
    },

    margin3: {
        width: "50%",
    },
});



function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
}




export default function Sponsors() {


    const classes = useStyles();

    return (
        <Box py={2}>
        </Box>
    );
}
