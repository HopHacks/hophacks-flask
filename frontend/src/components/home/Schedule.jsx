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
    backgroundColor: "#eef7ff",
  },
  font: {
    fontFamily: "Inter",
    color: "#000000",
  },
  divFont: {
    fontFamily: "Inter",
    color: "#000000"
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


          <Typography className={classes.title} variant="h4" style={{ marginTop:"0%"}} gutterBottom>
            Schedule
          </Typography>

          <div className={classes.divFont} style={{ color: "#ffffff", fontWeight: "bold", fontSize: "150%"}} >All times in EDT (GMT-4)</div>

          <TableContainer component={Paper} style={{ width: "100%", backgroundColor:"#eef7ff"}} align="center" sx={{ maxHeight: 440 }}>

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
              <Tab label="Fri September 16th" value="fri" className={classes.font}/>
              <Tab label="Sat September 17th" value="sat" className={classes.font}/>
              <Tab label="Sun September 18th" value="sun" className={classes.font}/>
            </Tabs>

            <Table className={classes.table} aria-label="simple table" sx={{
              height: "max-content"
            }}>
              <TableHead className={classes.schedule}>
                <TableRow>
                  <TableCell className={classes.font}>Time</TableCell>
                  <TableCell  className={classes.font}>Event</TableCell>
                  <TableCell className={classes.font}>Location</TableCell>
                </TableRow>
              </TableHead>
              {day === "fri" && <TableBody className={classes.body}>
                <TableRow className={classes.font}>
                  <TableCell width="40%" className={classes.font}>6:30 PM</TableCell>
                  <TableCell className={classes.font}>Check-in Begins </TableCell>
                  <TableCell align="left" className={classes.font}>Hodson Hall</TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>6:30 PM</TableCell>
                  <TableCell className={classes.font}>Dinner</TableCell>
                  <TableCell align="left" className={classes.font}>Hodson Hall</TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>7:30 PM</TableCell>
                  <TableCell className={classes.font}>Both Buses Arrive</TableCell>
                  <TableCell align="left" className={classes.font}>Mason Hall Loop</TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>9:00 PM</TableCell>
                  <TableCell className={classes.font}>Team Building</TableCell>
                  <TableCell align="left" className={classes.font}>Hodson Hall</TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>9:00 PM</TableCell>
                  <TableCell className={classes.font}> Sponsor Hall Opens & Hacking Begins!</TableCell>
                  <TableCell align="left" className={classes.font}>Hodson Hall</TableCell>
                </TableRow>
              </TableBody>}

              {day === "sat" && <TableBody className={classes.body}>
                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>9:00 AM</TableCell>
                  <TableCell className={classes.font}>Breakfast</TableCell>
                  <TableCell align="left" className={classes.font}>Hodson Hall</TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>1:00 PM</TableCell>
                  <TableCell className={classes.font}>Lunch</TableCell>
                  <TableCell align="left" className={classes.font}>Hodson Hall</TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>6:00 PM</TableCell>
                  <TableCell className={classes.font}>Dinner</TableCell>
                  <TableCell align="left" className={classes.font}>Hodson Hall</TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>9:00 PM</TableCell>
                  <TableCell className={classes.font}>Fun (video game tournament, movie night, etc)</TableCell>
                  <TableCell align="left" className={classes.font}>Hodson Hall</TableCell>
                </TableRow>
              </TableBody>}
              {day === "sun" &&<TableBody className={classes.body}>
                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>8:30 AM</TableCell>
                  <TableCell className={classes.font}>Submissions Due</TableCell>
                  <TableCell align="left" className={classes.font}>Devpost</TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>9:00 AM</TableCell>
                  <TableCell className={classes.font}>Breakfast</TableCell>
                  <TableCell align="left" className={classes.font}>Hodson Hall</TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>10:00 AM</TableCell>
                  <TableCell className={classes.font}>Presentations Fair</TableCell>
                  <TableCell align="left" className={classes.font}>Hodson Hall</TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>12:00 PM</TableCell>
                  <TableCell className={classes.font}>Lunch</TableCell>
                  <TableCell align="left" className={classes.font}>Hodson Hall</TableCell>
                </TableRow>

                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>12:30 PM</TableCell>
                  <TableCell className={classes.font}>Top 10 Demos & Judging</TableCell>
                  <TableCell align="left" className={classes.font}>Hodson Hall</TableCell>
                </TableRow>
                          
                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>1:45 PM</TableCell>
                  <TableCell className={classes.font}>Awards & Closing Ceremony</TableCell>
                  <TableCell align="left" className={classes.font}>Hodson Hall</TableCell>
                </TableRow>

                
                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>2:45 PM</TableCell>
                  <TableCell className={classes.font}>Buses Load</TableCell>
                  <TableCell align="left" className={classes.font}>Mason Hall Loop</TableCell>
                </TableRow>
                
                <TableRow className={classes.bodycolor}>
                  <TableCell width="40%" className={classes.font}>3:00 PM</TableCell>
                  <TableCell className={classes.font}>Buses Leave</TableCell>
                  <TableCell align="left" className={classes.font}>Mason Hall Loop</TableCell>
                </TableRow>

              </TableBody>}
            </Table>
          </TableContainer>

    </Box>
  );
}
