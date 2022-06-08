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
            <Card>
                <CardContent>
                    {/*TODO material UI*/}
                    <Typography  className={classes.title} variant="h4" gutterBottom>Prizes</Typography>
                    
                    <Grid container spacing={1} mx={20} alignItems="center" justify="center">
                    <Card style={{display: 'inline-block'}} raised="true" className={`${classes.margin} ${classes.color}`} >
                                <CardContent>
                                    <Typography variant="h5" className={classes.prizetitle} align="center" gutterBottom>
                                        <b>1st Place </b>
                                    </Typography>

                                    <Typography variant="h6" className={classes.prizetitle} align="center">
                                        $1024
                                    </Typography>
                                </CardContent>
                    </Card>

                    <Card style={{display: 'inline-block'}} raised="true" className={`${classes.margin} ${classes.color}`} >
                                <CardContent>
                                    <Typography variant="h5" className={classes.prizetitle} align="center" gutterBottom>
                                       <b> 2nd Place </b>
                                    </Typography >

                                    <Typography  variant="h6" className={classes.prizetitle} align="center">
                                        $768
                                    </Typography>
                                </CardContent>
                    </Card>

                    <Card style={{display: 'inline-block'}} raised="true" className={`${classes.margin} ${classes.color}`} >
                                <CardContent>
                                    <Typography variant="h5"  className={classes.prizetitle} align="center" gutterBottom>
                                       <b> 3rd Place </b>
                                    </Typography>

                                    <Typography variant="h6" className={classes.prizetitle} align="center">
                                        $512
                                    </Typography>
                                </CardContent>
                    </Card>
                    </Grid>

                    <Grid container spacing={1} mx={20} alignItems="center" justify="center">
                    <Card style={{display: 'inline-block'}} raised="true" className={`${classes.margin} ${classes.color}`} >
                                <CardContent>
                                    <Typography variant="h5" className={classes.prizetitle} align="center" gutterBottom>
                                       <b> 4th Place </b>
                                    </Typography>

                                    <Typography variant="h6" className={classes.prizetitle} align="center">
                                        $384
                                    </Typography>
                                </CardContent>
                    </Card>

                    <Card style={{display: 'inline-block'}} raised="true" className={`${classes.margin} ${classes.color}`} >
                                <CardContent>
                                    <Typography variant="h5" className={classes.prizetitle} align="center" gutterBottom>
                                       <b> 5th Place </b>
                                    </Typography >

                                    <Typography  variant="h6" className={classes.prizetitle} align="center">
                                        $256
                                    </Typography>
                                </CardContent>
                    </Card>

                
                    </Grid>

                    <Grid container spacing={1} mx={20} alignItems="center" justify="center">
                    

                    <Card style={{display: 'inline-block'}} raised="true" className={`${classes.margin2} ${classes.color}`} >
                                <CardContent>
                                    <Typography variant="h5" className={classes.prizetitle} align="center" gutterBottom>
                                       <b> 6th - 10th Place </b>
                                    </Typography >

                                    <Typography  variant="h6" className={classes.prizetitle} align="center">
                                        $128 each
                                    </Typography>
                                </CardContent>
                    </Card>

                
                    </Grid>

                    <Grid container spacing={1} mx={20} alignItems="center" justify="center">
                    

                    <Card style={{display: 'inline-block'}} raised="true" className={`${classes.margin3} ${classes.color}`} >
                                <CardContent>
                                    <Typography variant="h5" className={classes.prizetitle} align="center" gutterBottom>
                                       <b> Sponsor Prizes</b>
                                    </Typography >

                                    <Typography   align="center">
                                    In addition to the HopHacks cash prizes, there will also be several branded prizes offered by our sponsors! The full list of prizes will be on our Devpost, which will be linked when available.
                                    </Typography>
                                </CardContent>
                    </Card>

                
                    </Grid>

                    
                </CardContent>
            </Card>
        </Box>
    );
}
