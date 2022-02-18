import React from "react";
import { Link } from "react-router-dom";
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    logo: {
        top: '25%',
        width: '60vw', // This is centered, 20 - 60 - 20
        left: '20vw',
        position: 'absolute',
        textAlign: 'center',
    },
    margin: {
        marginBottom: "13px",
    },
    color: {
        backgroundColor: "#eef7ff",
    },
    title: {
        color: "#7289da",
        fontFamily: "VCR OSD Mono",
    },

    button:{
        backgroundColor:"#FFFFFF", color: "#c8e7fa" , width: "50%", minHeight :"50px" ,border:"4px solid",
        "&:hover":{
            backgroundColor:"#c8e7fa",
        }
    }
});

export default function Announcements() {
    const classes = useStyles();

    // function img(url) {
    //     return process.env.PUBLIC_URL + '/images/' + url;
    // }



    return (
        <div>
            <a id="mlh-trust-badge" 
               style={{'display':'block','maxWidth':'100px','minWidth':'60px','position':'fixed', 'right':'30px','top':'0','width':'10%','zIndex':'10000'}} 
               href="https://mlh.io/seasons/2022/events?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2022-season&utm_content=gray" 
               target="_blank">
                <img src="https://s3.amazonaws.com/logged-assets/trust-badge/2022/mlh-trust-badge-2022-gray.svg" alt="Major League Hacking 2022 Hackathon Season" style={{"width":"100%"}}></img>
            </a>

            <Container fixed>
                <Box py={2}>
                    <Card>
                        <CardContent>
                            <Typography className={classes.title} variant="h4" gutterBottom>
                                About
                            </Typography>
                            <Typography >
                                HopHacks is a 36-hour biannual Hackathon held at the Johns Hopkins University that encourages engineers, designers, and entrepreneurs to explore new ideas and create new applications. Teams of up to 4 university students work on projects from scratch. At the end of the hackathon, teams present their projects to judges and compete for prizes!
                                <p>
                                    <b>
                                        Note: Due to the COVID-19 pandemic, we will be hosting HopHacks virtually via Discord and Zoom.
                                    </b>
                                </p>
                            </Typography>
                        </CardContent>
                    </Card>
                
                    
                </Box>
            </Container>
        </div>
    );

}
