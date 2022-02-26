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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
                
                <MuiAccordion>
                <MuiAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                <Typography style = {{"color":"#202c63",fontSize: '2.8em',fontFamily: "VCR OSD Mono"}}>
                        Recenet Announcements
                </Typography>
                </MuiAccordionSummary>
                <MuiAccordionDetails>
                <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                </Typography>
                </MuiAccordionDetails>
                </MuiAccordion>
            </CardContent>
        </Card>
    );
}