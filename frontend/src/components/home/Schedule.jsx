import React from "react";

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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

const useStyles = makeStyles({

    margin: {
        marginBottom: "13px",
    },
    color: {
        backgroundColor: "#d1e9ff",
    },
    bodycolor:{

    },
    title: {
        color: "#7289da",
        fontFamily: "VCR OSD Mono",
    },

});



export default function Sponsors() {


    const classes = useStyles();

    return (
        <Box py={2}>





        <Card>
            <CardContent>
                <Typography className={classes.title} variant="h4" gutterBottom>
                    Schedule
                </Typography>

                <Typography variant="h6">
                (All times in EDT (GMT-4))
                <br></br>
                <br></br>
                        </Typography>



                <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">



        <TableBody>

        <TableRow className={classes.color}>
            <TableCell width="40%"><b>Friday (September 17th)</b></TableCell>
            <TableCell><b>Event</b></TableCell>
            <TableCell align="left"><b>Event Link</b></TableCell>
          </TableRow>

        <TableRow className={classes.bodycolor}>
            <TableCell width="40%">5:00 PM</TableCell>
            <TableCell>Check-in Begins</TableCell>
            <TableCell align="left"></TableCell>
        </TableRow>

        <TableRow className={classes.bodycolor}>
            <TableCell width="40%">8:00 PM</TableCell>
            <TableCell>Opening Ceremony</TableCell>
            <TableCell align="left">TBD</TableCell>
        </TableRow>

        <TableRow className={classes.bodycolor}>
            <TableCell width="40%">9:00 PM</TableCell>
            <TableCell>Team Building</TableCell>
            <TableCell align="left"></TableCell>
        </TableRow>

        <TableRow className={classes.bodycolor}>
            <TableCell width="40%">9:00 PM</TableCell>
            <TableCell> Sponsor Hall Opens & Hacking Begins!</TableCell>
            <TableCell align="left"></TableCell>
        </TableRow>

        <TableRow className={classes.bodycolor}>
            <TableCell width="40%">11:00 PM</TableCell>
            <TableCell>echoAR Workshop</TableCell>
            <TableCell align="left">TBD</TableCell>
        </TableRow>

        <TableRow className={classes.color}>
            <TableCell width="40%"><b>Saturday (September 18th)</b></TableCell>
            <TableCell><b>Event</b></TableCell>
            <TableCell align="left"><b>Event Link</b></TableCell>
          </TableRow>

          <TableRow className={classes.bodycolor}>
            <TableCell width="40%">9:00 AM</TableCell>
            <TableCell>Devpost Checkpoint & Check-in Ends</TableCell>
            <TableCell align="left"></TableCell>
        </TableRow>

        <TableRow className={classes.bodycolor}>
            <TableCell width="40%">11:00 AM</TableCell>
            <TableCell>Fast Forward U Workshop</TableCell>
            <TableCell align="left">TBD</TableCell>
        </TableRow>

        <TableRow className={classes.bodycolor}>
            <TableCell width="40%">1:00 PM</TableCell>
            <TableCell>Bloomberg Workshop</TableCell>
            <TableCell align="left">TBD</TableCell>
        </TableRow>

        <TableRow className={classes.bodycolor}>
            <TableCell width="40%">4:00 PM</TableCell>
            <TableCell>HopHacks & HopAI Workshop: Generative Adversarial Networks</TableCell>
            <TableCell align="left">TBD</TableCell>
        </TableRow>

        <TableRow className={classes.bodycolor}>
            <TableCell width="40%">9:00 PM</TableCell>
            <TableCell>Devpost Checkpoint</TableCell>
            <TableCell align="left"></TableCell>
        </TableRow>


          <TableRow className={classes.color}>
            <TableCell width="40%"><b>Sunday (September 19th)</b></TableCell>
            <TableCell><b>Event</b></TableCell>
            <TableCell align="left"><b>Event Link</b></TableCell>
          </TableRow>

          <TableRow className={classes.bodycolor}>
            <TableCell width="40%">8:45 AM</TableCell>
            <TableCell>Submissions Due</TableCell>
            <TableCell align="left"></TableCell>
        </TableRow>

        <TableRow className={classes.bodycolor}>
            <TableCell width="40%">10:00 AM</TableCell>
            <TableCell>Presentations Fair</TableCell>
            <TableCell align="left"></TableCell>
        </TableRow>

        <TableRow className={classes.bodycolor}>
            <TableCell width="40%">12:30 PM</TableCell>
            <TableCell>Top 10 Demos & Judging</TableCell>
            <TableCell align="left"></TableCell>
        </TableRow>

        <TableRow className={classes.bodycolor}>
            <TableCell width="40%">2:30 PM</TableCell>
            <TableCell>Awards & Closing Ceremony</TableCell>
            <TableCell align="left"></TableCell>
        </TableRow>




        </TableBody>
      </Table>
    </TableContainer>


            </CardContent>
        </Card>
        </Box>
    );
}