import React from "react";

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles({

    title: {
        color: "#ffffff",
        fontFamily: "Inter",
        fontWeight: "bold",
        // fontStyle: "italic",
        textAlign: "left",
        fontSize: "375%"
    },
    minititle: {
        color: "#ffffff",
        fontFamily: "Inter",
        fontWeight: "bold",
        // fontStyle: "italic",
        textAlign: "center",
        fontSize: "250%",
    },

    image: {
        width: "15%",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: "#278be2",
    }
});



function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
}

function SponsorItem(props) {
    const classes = useStyles();
    return (
        <Grid container xs={6} alignItems="center" justify="center" className={classes.image} style={{ width: "15%" }}>

            <picture align="center" >
                <a href={`${props.website}`}><img srcSet={img(`sponsor/png/${props.imgURL}.png`)} style={props.imgSytle} /></a>
            </picture>
        </Grid>
    );

}


export default function Sponsors() {


    const classes = useStyles();

    return (
        <Box py={2}>
            <Card className={classes.card}>
                <CardContent>
                    {/*TODO material UI*/}
                    <Typography className={classes.title} variant="h4" gutterBottom>Sponsors</Typography>
                    <Typography className={classes.minititle} gutterBottom>Gold</Typography> {/* Will Style Better Later */}

                     {/* Carousel Goes Here! */}

                    <Typography className={classes.minititle} gutterBottom>Sable</Typography> {/* Will Style Better Later */}

                     {/* Carousel Goes Here! */}

                    <Typography className={classes.minititle} gutterBottom>Blue</Typography> {/* Will Style Better Later */}

                     {/* Carousel Goes Here! */}

                    <Typography className={classes.minititle} gutterBottom>Starter</Typography> {/* Will Style Better Later */}

                     {/* Carousel Goes Here! */}



                    {/* <Grid container spacing={0} alignItems="center" justify="center">
                    <SponsorItem imgURL='Bloomberg' website='https://www.bloomberg.com/' imgSytle={{width: '100%', maxHeight: "100%"}}/>
                    </Grid>
                    
                    <Grid container spacing={0} alignItems="center" justify="center">
                    <SponsorItem imgURL='Googlecloud' website='https://cloud.google.com/' imgSytle={{width: '100%', maxHeight: "100%", marginTop: "1%"}}/>
                    </Grid> */}



                </CardContent>
            </Card>
        </Box>
    );
}
