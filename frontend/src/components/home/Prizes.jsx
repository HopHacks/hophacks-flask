import React from "react";

import Box from '@material-ui/core/Box';
import CardMedia from '@material-ui/core/CardMedia';
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
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({

    title: {
        color: "#ffffff",
        fontFamily: "Inter",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "375%"
    },

    firstTitle: {
        fontFamily: "Inter",
        position: 'relative',
        top: -1275,
        bottom: 0,
        left: 5,
        right: 0,
        color: "white",
    },

    secondTitle: {
        fontFamily: "Inter",
        position: 'relative',
        top: -840,
        bottom: 0,
        left: 265,
        right: 0,
        color: "white",
    },
    secondSubTitle: {
        fontFamily: "Inter",
        position: 'relative',
        top: -840,
        bottom: 0,
        left: 295,
        right: 0,
        color: "white",
    },

    thirdTitle: {
        fontFamily: "Inter",
        position: 'relative',
        top: -1235,
        bottom: 0,
        left: 845,
        right: 0,
        color: "white",
    },

    thirdSubTitle: {
        fontFamily: "Inter",
        position: 'relative',
        top: -1235,
        bottom: 0,
        left: 870,
        right: 0,
        color: "white",
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
    birds: {
        backgroundColor: "transparent",
        position: "relative",
        left: -15,

    },

    chatBox1: {
        backgroundColor: "transparent",
        marginLeft: "0%", 
        marginTop: "0%", 
        width: "18%",
        position: 'relative',
        top: -700,
        bottom: 0,
        left: 210,
        right: 0,
    },

    chatBox2: {
        backgroundColor: "transparent",
        marginLeft: "0%", 
        marginTop: "0%", 
        width: "18%",
        position: 'relative',
        top: -1135,
        bottom: 0,
        left: 512,
        right: 0,
    },

    chatBox3: {
        backgroundColor: "transparent",
        marginLeft: "0%", 
        marginTop: "0%", 
        width: "18%",
        position: 'relative',
        top: -1095,
        bottom: 0,
        left: 785,
        right: 0,
    },
    
});



function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
}




export default function Sponsors() {


    const classes = useStyles();

    return (
        <Box py={1} >
            <Grid container spacing={2}  alignItems="center" style={{ marginTop:"10%"}}>
                <Grid item xs={4}>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.title} variant="h4" style={{marginTop: "-18%", marginBottom: "0"}} gutterBottom>
                Prizes
              </Typography>
            </Grid>              
            </Grid>
            <CardMedia
                component="img"
                className={classes.birds}
                image={img('Birds.png')}
            />
             
            <div>
                <CardMedia
                    component="img"
                    className={classes.chatBox1}
                    image={img('chatbox_above_birds.png')}
                />
                <Typography variant="h5" className={classes.secondTitle}  gutterBottom>
                    <b>2nd Place </b>
                    </Typography>
                <Typography variant="h6" className={classes.secondSubTitle} >
                    $512
                </Typography>
            </div>  
            
            <div> 
                <CardMedia
                    component="img"
                    className={classes.chatBox2}
                    image={img('chatbox_above_birds.png')}
                />
                <Typography variant="h5" className={classes.firstTitle} align="center" gutterBottom>
                    <b>1st Place </b>
                    </Typography>
                <Typography variant="h6" className={classes.firstTitle} align="center">
                    $1024
                </Typography>
            </div>
            <div>
                <CardMedia
                    component="img"
                    className={classes.chatBox3}
                    image={img('chatbox_above_birds.png')}
                />
                <Typography variant="h5" className={classes.thirdTitle}  gutterBottom>
                    <b>3rd Place </b>
                    </Typography>
                <Typography variant="h6" className={classes.thirdSubTitle} >
                    $256
                </Typography>
            </div>        
        </Box>
    );
}
