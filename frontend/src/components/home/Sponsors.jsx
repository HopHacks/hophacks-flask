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
});



function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
}

function SponsorItem(props) {

    return (
        <Grid item xs={6}>

                <picture >
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
                    
                    <Grid container spacing={3}>
                        <SponsorItem imgURL='Bloomberg' website='https://www.bloomberg.com/' imgSytle={{width: '100%', maxHeight: "100%"}}/>
                        <SponsorItem imgURL='SIEMENS' website='https://www.siemens-healthineers.com/' imgSytle={{width: '100%', maxHeight: "100%", marginTop:"5%"}}/>
                        <SponsorItem imgURL='ffu' website='https://ventures.jhu.edu/programs-services/fastforward-u/' imgSytle={{width: '80%', maxHeight: "100%", marginTop: "8%", marginLeft: "10%"}}/>
                        <SponsorItem imgURL='linode' website='https://www.linode.com/' imgSytle={{width: '80%', maxHeight: "100%"}}/>
                        <SponsorItem imgURL='Googlecloud' website='https://cloud.google.com/' imgSytle={{width: '100%', maxHeight: "100%"}}/>
                        <SponsorItem imgURL='wolfram-alpha' website='https://www.wolframalpha.com/' imgSytle={{width: '100%', maxHeight: "100%", marginTop: "5%"}}/>
                    </Grid>

                </CardContent>
            </Card>
        </Box>
    );
}
