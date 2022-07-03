import React from "react";

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles({

    title: {
        color: "#7289da",
        fontFamily: "VCR OSD Mono",
    },
    image: {
        width: "15%",
        justifyContent: "center",
        alignItems: "center",
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
            <Card>
                <CardContent>
                    {/*TODO material UI*/}
                    <Typography className={classes.title} variant="h4" gutterBottom>Sponsors</Typography>

                    <Grid container spacing={0} alignItems="center" justify="center">
                    <SponsorItem imgURL='Bloomberg' website='https://www.bloomberg.com/' imgSytle={{width: '100%', maxHeight: "100%"}}/>
                    </Grid>

                    <Grid container spacing={0} alignItems="center" justify="center">
                    <SponsorItem imgURL='yet' website='https://www.yetanalytics.com/' imgSytle={{width: '80%', maxHeight: "100%", marginTop: "0%"}}/>
                    </Grid>

                    <Grid container spacing={0} alignItems="center" justify="center">
                    <SponsorItem imgURL='apl' website='https://www.jhuapl.edu/' imgSytle={{width: '100%', maxHeight: "100%", marginTop: "5%"}}/>
                    </Grid>

                    <Grid container spacing={0} alignItems="center" justify="center">
                    <SponsorItem imgURL='one' website='https://www.capitalone.com/' imgSytle={{width: '70%', maxHeight: "100%", marginTop: "5%"}}/>
                    </Grid>

                    <Grid container spacing={0} alignItems="center" justify="center">
                    <SponsorItem imgURL='SIEMENS' website='https://www.siemens-healthineers.com/' imgSytle={{width: '80%', maxHeight: "100%", marginTop: "7%"}}/>
                    </Grid>

                    <Grid container spacing={0} alignItems="center" justify="center">
                    <SponsorItem imgURL='it' website='https://it.johnshopkins.edu/' imgSytle={{width: '100%', maxHeight: "100%", marginTop: "12%"}}/>
                    </Grid>

                    <Grid container spacing={0} alignItems="center" justify="center">
                    <SponsorItem imgURL='ffu' website='https://ventures.jhu.edu/programs-services/fastforward-u/' imgSytle={{width: '100%', maxHeight: "100%", marginTop: "5%"}}/>
                    </Grid>

                    <Grid container spacing={0} alignItems="center" justify="center" >
                    <SponsorItem imgURL='linode' website='https://www.linode.com/' imgSytle={{width: '60%', maxHeight: "100%", marginTop: "5%"}}/>
                    </Grid>
                    <Grid container spacing={0} alignItems="center" justify="center">
                    <SponsorItem imgURL='ground' website='https://www.groundcontrol.coffee/' imgSytle={{width: '35%', maxHeight: "100%", marginTop: "1%"}}/>
                    </Grid>
                    <Grid container spacing={0} alignItems="center" justify="center">

                        <SponsorItem imgURL='wolfram-alpha' website='https://www.wolframalpha.com/' imgSytle={{width: '100%', maxHeight: "100%", marginTop: "5%"}}/>
                    </Grid>
                    
                    <Grid container spacing={0} alignItems="center" justify="center">
                    <SponsorItem imgURL='Googlecloud' website='https://cloud.google.com/' imgSytle={{width: '100%', maxHeight: "100%", marginTop: "1%"}}/>
                    </Grid>



                </CardContent>
            </Card>
        </Box>
    )}
