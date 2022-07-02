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
    backgroundColor: "#278be2",
  },
  body: {
    maxHeight: "150px",
    overflow: "auto",
  },
  title: {
    color: "#ffffff",
    fontFamily: "Inter",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "375%"
  },
  schedule: {
    backgroundColor: "#278be2",
  
  },
  font: {
    fontFamily: "Inter",
    color: "#ffffff",
  }
});



export default function Schedule() {


  const classes = useStyles();
  const [day, setDay] = React.useState("fri");

  const handleChange = (event, newDay) => {
    setDay(newDay);
  };

  return (
    <Box py={2}>

      <Card className={classes.color}>
        {/* <Paper className={classes.root} style={{ padding: '5px', marginBottom: '10px' }}> */}
        <CardContent>
          <Typography className={classes.title} variant="h4" gutterBottom>
            Schedule
          </Typography>
          <div className={classes.font}>All times in EDT (GMT-4)</div>

          <TableContainer component={Paper} style={{ width: "100%", backgroundColor:"#278be2"}} align="center" sx={{ maxHeight: 440 }}>

            <Tabs
              value={day}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
              fullWidth={true}
              className={classes.schedule}
              variant="fullWidth"
            >
              <Tab label="Fri September 17th" value="fri" className={classes.font}/>
              <Tab label="Sat September 18th" value="sat" className={classes.font}/>
              <Tab label="Sun September 19th" value="sun" className={classes.font}/>
            </Tabs>

            <Table className={classes.table} aria-label="simple table" sx={{
              height: "max-content"
            }}>
              <TableHead className={classes.color}>
                <TableRow>
                  <TableCell className={classes.font}>Time</TableCell>
                  <TableCell  className={classes.font}>Event</TableCell>
                  <TableCell className={classes.font}>Location/Link</TableCell>
                </TableRow>
              </TableHead>
              {day === "fri" && <TableBody className={classes.body}>
                <TableRow className={classes.font}>
                  <TableCell width="40%" className={classes.font}>5:00 PM</TableCell>
                  <TableCell className={classes.font}>Check-in Begins </TableCell>
                  <TableCell align="left" className={classes.font}></TableCell>
                </TableRow>
                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>8:00 PM</TableCell>
                  <TableCell className={classes.font}>Opening Ceremony</TableCell>
                  <TableCell align="left" className={classes.font}><a href="https://twitch.tv/hophacks">Twitch</a></TableCell>
                </TableRow>
                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>9:00 PM</TableCell>
                  <TableCell className={classes.font}>Team Building</TableCell>
                  <TableCell align="left" className={classes.font}></TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>9:00 PM</TableCell>
                  <TableCell className={classes.font}> Sponsor Hall Opens & Hacking Begins!</TableCell>
                  <TableCell align="left" className={classes.font}></TableCell>
                </TableRow>
              </TableBody>}

              {day === "sat" && <TableBody className={classes.body}>
                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>9:00 AM</TableCell>
                  <TableCell className={classes.font}>Devpost Checkpoint & Check-in Ends</TableCell>
                  <TableCell align="left" className={classes.font}></TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>11:00 AM</TableCell>
                  <TableCell className={classes.font}>MLH Event: Capture the Flag Presented by US Air Force</TableCell>
                  <TableCell align="left" className={classes.font}>Discord Livestream</TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>11:00 AM</TableCell>
                  <TableCell className={classes.font}>Fast Forward U Workshop: Create Your Own Landing Page!</TableCell>
                  <TableCell align="left" className={classes.font}><a href="https://zoom.us/my/startupxp">Zoom Link</a></TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>1:00 PM</TableCell>
                  <TableCell className={classes.font}>Bloomberg Tech Talk: Detecting Gender Bias in Software UI design</TableCell>
                  <TableCell align="left" className={classes.font}><a href="https://bloomberg.zoom.us/j/94547754929?pwd=OHVzQWFtNFRHRUhuWmFUU2Z6V1FMdz09">Zoom Link</a></TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>3:00 PM</TableCell>
                  <TableCell className={classes.font}>Yet Analytics Workshop: IEEE Learning Technology Standards Committee Data Standards.</TableCell>
                  <TableCell align="left" className={classes.font}>TBD</TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>4:00 PM</TableCell>
                  <TableCell className={classes.font}>HopHacks & HopAI Workshop: Generative Adversarial Networks</TableCell>
                  <TableCell align="left" className={classes.font}><a href="https://jhubluejays.zoom.us/j/95919110259?pwd=cWRxZjVLT0ZZbXQvZ3NhZWlCWDVwQT09">Zoom Link</a></TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>8:00 PM</TableCell>
                  <TableCell className={classes.font}>MLH Event: Bob Ross MS Paint</TableCell>
                  <TableCell align="left" className={classes.font}>Discord Livestream</TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>9:00 PM</TableCell>
                  <TableCell className={classes.font}>Devpost Checkpoint</TableCell>
                  <TableCell align="left" className={classes.font}></TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>10:00 PM</TableCell>
                  <TableCell className={classes.font}>echoAR Workshop: How to Build a Cloud-Connected AR/VR App in 15 Minutes or Less</TableCell>
                  <TableCell align="left" className={classes.font}><a href="https://twitch.tv/hophacks">Twitch Link</a></TableCell>
                </TableRow>
              </TableBody>}

              {day === "sun" &&<TableBody className={classes.body}>
                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>8:45 AM</TableCell>
                  <TableCell className={classes.font}>Submissions Due</TableCell>
                  <TableCell align="left" className={classes.font}></TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>9:30 AM</TableCell>
                  <TableCell className={classes.font}>Presentations Fair</TableCell>
                  <TableCell align="left" className={classes.font}></TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>12:30 PM</TableCell>
                  <TableCell className={classes.font}>Top 10 Demos & Judging</TableCell>
                  <TableCell align="left" className={classes.font}><a href="https://twitch.tv/hophacks">Twitch Link</a></TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>2:30 PM</TableCell>
                  <TableCell className={classes.font}>Awards & Closing Ceremony</TableCell>
                  <TableCell align="left" className={classes.font}><a href="https://twitch.tv/hophacks">Twitch Link</a></TableCell>
                </TableRow>
              </TableBody>}
            </Table>
          </TableContainer>
          
        </CardContent>
      </Card>
    </Box>
  );
}
