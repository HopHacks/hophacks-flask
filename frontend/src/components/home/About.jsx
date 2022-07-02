import React from "react";
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles({

    margin: {
        marginBottom: "13px",
    },
    color: {
        backgroundColor: "#278be2",
    },
    title: {
        color: "#7289da",
        fontFamily: "VCR OSD Mono",
    },
    Media: {
        // height: '50%',
        // width: '55%',
        // objectFit: 'cover', 
        // justifyContent:'center'
        width: '65%',
        marginLeft: '33%',
        backgroundColor: "#278be2",
    },
    font1: {
        position: "absolute",
        width: '1127.38px',
        height: '353.64px',
        left: '415px',
        top: '110px',
        color: "rgba(255, 255, 255, 0.6)",
        backgroundColor: "none",
        fontFamily: "Inter",
        fontWeight: '700',
        fontStyle: 'italic',
        fontSize: '251.02px',
        lineHeight: '304px'

    }, 

    font2: {
        position: "absolute",
        width: '1127.38px',
        height: '353.64px',
        left: '200px',
        top: '400px',
        color: "rgba(255, 255, 255)",
        backgroundColor: "none",
        fontFamily: "Inter",
        fontWeight: '700',
        fontStyle: 'italic',
        fontSize: '251.02px',
        lineHeight: '304px'

    }, 

    font3: {
        position: "absolute",
        width: '1127.38px',
        height: '353.64px',
        left: '0px',
        top: '690px',
        color: "rgba(255, 255, 255, 0.6)",
        backgroundColor: "none",
        fontFamily: "Inter",
        fontWeight: '700',
        fontStyle: 'italic',
        fontSize: '251.02px',
        lineHeight: '304px'

    }, 

});

export default function About() {
    const classes = useStyles();
    function img(url) {
        return process.env.PUBLIC_URL + '/images/' + url;
    }
    return (
    <div style={{ position: "relative" }}>
        <Card className={classes.color} >
            <CardContent>
            <CardMedia
                component="img"
                className={classes.Media}
                image={img('About_Background.png')}
            />
            {/* <img src={img('About_Background.png')} style={{
                // 'width': '14vw',
            }} /> */}
            <Typography
                className={classes.font1}>
                About
            </Typography>
            <Typography
                className={classes.font2}>
                About
            </Typography>
            <Typography
                className={classes.font3}>
                About
            </Typography>
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
    </div>
    );
}