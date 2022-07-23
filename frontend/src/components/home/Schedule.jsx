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

  margin: {
    marginBottom: "13px",
  },
  color: {
    backgroundColor: "transparent",
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
    backgroundColor: "transparent",
  },
  font: {
    fontFamily: "Inter",
    color: "rgba(255, 255, 255, 0.8)",
    backgroundColor: "transparent",
    fontWeight: "bold",
    "&.Mui-selected": {
      color: "rgba(255, 255, 255, 1)",
      fontWeight: "bold",
    },
    fontSize: '18px',
  },
  divFont: {
    fontFamily: "Inter",
    color: "rgba(255, 255, 255, 1)",
    height: "35px",
    fontSize: '17px',
    fontWeight: "bold",
  },
  indicator: {
    backgroundColor: 'white',
  },
  selected: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  Media: {
    position: "absolute",
    width: '300px',
    height: '200px',
    left: '170px',
    top: '200px',
    backgroundColor: "transparent",
  },

  Media2: {
    position: "absolute",
    width: '300px',
    height: '200px',
    backgroundColor: "transparent",
    left: '1050px',
    top: '500px',
  },
});



export default function Schedule() {

  function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
  }

  const classes = useStyles();
  const [day, setDay] = React.useState("fri");

  function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
  };

  const handleChange = (event, newDay) => {
    setDay(newDay);
  };

  return (
    <div style={{position: "relative", top: "800px"}}>
      <Box py={2}>
        <Grid container spacing={2} justify="center" alignItems="center" style={{ marginTop: "15%" }}>
          <Grid item xs={4}>
          </Grid>
          <Grid item xs={4}>
            <Typography className={classes.title} variant="h4" style={{ marginTop: "-30%" }} gutterBottom>
              Schedule
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <img style={{ marginLeft: "0%", marginTop: "-60%", width: "60%" }} src={img("home_bg/1_edit.png")} />
          </Grid>
        </Grid>


        <div className={classes.divFont} style={{ color: "#ffffff", fontWeight: "bold", fontSize: "150%", marginTop: "-10%" }} >All times in EDT (GMT-4)</div>

        <CardMedia
          component="img"
          className={classes.Media}
          image={img('schedule_png.png')}
        />

        <CardMedia
          component="img"
          className={classes.Media2}
          image={img('schedule_png_2.png')}
        />
        <TableContainer component={Paper} style={{ width: "100%", backgroundColor: "transparent" }} align="center" sx={{ maxHeight: 440 }}>

          <Tabs
            value={day}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
            fullWidth={true}
            className={classes.schedule}
            classes={{ indicator: classes.indicator, selected: classes.selected }}
            style={{ width: "100%", backgroundColor: "transparent", color: "white" }}
            variant="fullWidth"
          >
            <Tab label="Fri September 16th" value="fri" className={classes.font} />
            <Tab label="Sat September 17th" value="sat" className={classes.font} />
            <Tab label="Sun September 18th" value="sun" className={classes.font} />
          </Tabs>

          <Table className={classes.table} aria-label="simple table" sx={{
            height: "max-content",
            backgroundColor: "transparent"
          }}>
            <TableHead className={classes.schedule}>
              <TableRow>
                <TableCell className={classes.font} style={{ backgroundColor: "transparent" }}>Time</TableCell>
                <TableCell className={classes.font}>Event</TableCell>
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
            {day === "sun" && <TableBody className={classes.body}>
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
    </div>
  );
}
