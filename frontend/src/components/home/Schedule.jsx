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
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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



export default function Schedule() {


    const classes = useStyles();
    const [day, setDay] = React.useState("fri");

    const handleChange = (event, newDay) => {
        setDay(newDay);
    };

    return (
        <Box py={2}>

        <Card>
        <Paper className={classes.root} style={{ padding: '5px', marginBottom: '10px' }}>
        
        <Typography className={classes.title} variant="h4" gutterBottom>
            Schedule
        </Typography>


            <Tabs
              value={day}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
                <Tab label="Fri September 17th"  value="fri" />
                <Tab label="Sat September 18th" value="sat"/>
                <Tab label="Sun September 19th" value="sun"/>
        
            </Tabs>
                {day === "fri" && <Grid>
                    <TableRow className={classes.bodycolor}>
                    <TableCell width="40%">5:00 PM</TableCell>
                    <TableCell>Check-in Begins </TableCell>
                    <TableCell align="left"></TableCell>
                    </TableRow>
                    <TableRow className={classes.bodycolor}>
                    <TableCell width="40%">8:00 PM</TableCell>
                    <TableCell>Opening Ceremony</TableCell>
                    <TableCell align="left"><a href="https://twitch.tv/hophacks">Twitch</a></TableCell>
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
                </Grid>}

                {day === "sat" && <Grid>
                    <TableRow className={classes.bodycolor}>
                    <TableCell width="40%">9:00 AM</TableCell>
                    <TableCell>Devpost Checkpoint & Check-in Ends</TableCell>
                    <TableCell align="left"></TableCell>
                    </TableRow>

                    <TableRow className={classes.bodycolor}>
                    <TableCell width="40%">11:00 AM</TableCell>
                    <TableCell>MLH Event: Capture the Flag Presented by US Air Force</TableCell>
                    <TableCell align="left">Discord Livestream</TableCell>
                    </TableRow>

                    <TableRow className={classes.bodycolor}>
                    <TableCell width="40%">11:00 AM</TableCell>
                    <TableCell>Fast Forward U Workshop: Create Your Own Landing Page!</TableCell>
                    <TableCell align="left"><a href="https://zoom.us/my/startupxp">Zoom Link</a></TableCell>
                    </TableRow>

                    <TableRow className={classes.bodycolor}>
                    <TableCell width="40%">1:00 PM</TableCell>
                    <TableCell>Bloomberg Tech Talk: Detecting Gender Bias in Software UI design</TableCell>
                    <TableCell align="left"><a href="https://bloomberg.zoom.us/j/94547754929?pwd=OHVzQWFtNFRHRUhuWmFUU2Z6V1FMdz09">Zoom Link</a></TableCell>
                    </TableRow>

                    <TableRow className={classes.bodycolor}>
                    <TableCell width="40%">3:00 PM</TableCell>
                    <TableCell>Yet Analytics Workshop: IEEE Learning Technology Standards Committee Data Standards.</TableCell>
                    <TableCell align="left">TBD</TableCell>
                    </TableRow>
        
                    <TableRow className={classes.bodycolor}>
                    <TableCell width="40%">4:00 PM</TableCell>
                    <TableCell>HopHacks & HopAI Workshop: Generative Adversarial Networks</TableCell>
                    <TableCell align="left"><a href="https://jhubluejays.zoom.us/j/95919110259?pwd=cWRxZjVLT0ZZbXQvZ3NhZWlCWDVwQT09">Zoom Link</a></TableCell>
                    </TableRow>

                    <TableRow className={classes.bodycolor}>
                    <TableCell width="40%">8:00 PM</TableCell>
                    <TableCell>MLH Event: Bob Ross MS Paint</TableCell>
                    <TableCell align="left">Discord Livestream</TableCell>
                    </TableRow>

                    <TableRow className={classes.bodycolor}>
                    <TableCell width="40%">9:00 PM</TableCell>
                    <TableCell>Devpost Checkpoint</TableCell>
                    <TableCell align="left"></TableCell>
                    </TableRow>

                    <TableRow className={classes.bodycolor}>
                    <TableCell width="40%">10:00 PM</TableCell>
                    <TableCell>echoAR Workshop: How to Build a Cloud-Connected AR/VR App in 15 Minutes or Less</TableCell>
                    <TableCell align="left"><a href="https://twitch.tv/hophacks">Twitch Link</a></TableCell>
                    </TableRow>  
                </Grid>}

                {day === "sun" && <Grid>
                    <TableRow className={classes.bodycolor}>
                    <TableCell width="40%">8:45 AM</TableCell>
                    <TableCell>Submissions Due</TableCell>
                    <TableCell align="left"></TableCell>
                    </TableRow>

                    <TableRow className={classes.bodycolor}>
                    <TableCell width="40%">9:30 AM</TableCell>
                    <TableCell>Presentations Fair</TableCell>
                    <TableCell align="left"></TableCell>
                    </TableRow>

                    <TableRow className={classes.bodycolor}>
                    <TableCell width="40%">12:30 PM</TableCell>
                    <TableCell>Top 10 Demos & Judging</TableCell>
                    <TableCell align="left"><a href="https://twitch.tv/hophacks">Twitch Link</a></TableCell>
                    </TableRow>

                    <TableRow className={classes.bodycolor}>
                    <TableCell width="40%">2:30 PM</TableCell>
                    <TableCell>Awards & Closing Ceremony</TableCell>
                    <TableCell align="left"><a href="https://twitch.tv/hophacks">Twitch Link</a></TableCell>
                    </TableRow>
                </Grid>}
                
        </Paper>
        </Card>
        </Box>
    );
}
