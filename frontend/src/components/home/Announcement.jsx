import React from "react";
import { Link } from "react-router-dom";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';

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

export default function Announcement() {
    const classes = useStyles();
    return (
        <Card raised="true" className={`${classes.margin}`}>
            <CardContent>
                <Typography className={classes.title} variant="h4" gutterBottom>
                    Announcements
                </Typography>
                <MuiAccordion className={classes.button} variant="outlined"  href="https://forms.gle/Znzy2aFq7Bwwx7P4A">
                    <Typography style = {{"color":"#202c63",fontSize: '2.8em',fontFamily: "VCR OSD Mono"}}>
                        <strong>Fetch New Announcement</strong>
                    </Typography>
                </MuiAccordion>
            </CardContent>
        </Card>
    );
}