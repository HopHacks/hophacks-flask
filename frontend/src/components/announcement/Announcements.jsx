import React from "react";

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pagination from '@material-ui/lab/Pagination';
import Paper from '@material-ui/core/Paper';

import axios from "axios";

import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from "react";

import { Link } from 'react-router-dom';

const useStyles = makeStyles({

  title: {
    color: "#7289da",
    fontFamily: "VCR OSD Mono",
    marginLeft: '20px',
  },

  titlebox: {
    height: '60px',
    width: '100%',
    marginTop: '20px',
    marginBottom: '20px',
    marginLeft: '10px',
    marginRight: '10px',
    marginBottom: '20px',
    textAlign: 'left',
  },

  announcementPic: {
    width: '150px',
    height: '150px',
  },

  imAnnouncementPic: {
    width: '60%',
    height: '60%',
    marginLeft: '20%',
    marginRight: '20%',
  },

  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 10,
  },

  card: {
    padding: 12,
  },

  container: {
    maxWidth: '55%',
  },

  topAnnouncementContent: {
    display: "-webkit-box",
    boxOrient: "vertical",
    lineClamp: 3,
    wordBreak: "break-all",
    overflow: "hidden"
  },

  recentFourAnnouncementContent: {
    display: "-webkit-box",
    boxOrient: "vertical",
    lineClamp: 2,
    wordBreak: "break-all",
    overflow: "hidden"
  },

  historyAnnouncementContent: {
    display: "-webkit-box",
    boxOrient: "vertical",
    lineClamp: 1,
    wordBreak: "break-all",
    overflow: "hidden",
    maxWidth: "500px"
  },
});

export default function Announcements() {
  const classes = useStyles();

  const [page, setPage] = useState(1);
  const [historyAnnouncements, setHistoryAnnouncements] = useState([]);
  const [topAnnouncement, setTopAnnouncement] = useState({});
  const [recentFourAnnouncements, setRecentFourAnnouncements] = useState([]);
  const [query, setQuery] = useState("");
  const [event, setEvent] = useState("Fall 2022");

  async function getTopAnnouncement() {
    try {
      const response = await axios.get('/api/announcements/important' + "?event=" + event);
      setTopAnnouncement(response.data);
    } catch (ex) {
      console.log('Unable to get top announcement');
    }
  }

  async function getRecentFourAnnouncements() {
    try {
      const response = await axios.get('/api/announcements/recent' + "?event=" + event);
      setRecentFourAnnouncements(response.data.announcements);
    } catch (ex) {
      console.log('Unable to get recent four announcements');
    }
  }

  async function getHistoryAnnouncements() {
    try {
      const response = await axios.get('/api/announcements/history' + "?event=" + event);
      setHistoryAnnouncements(response.data.announcements);
    } catch (ex) {
      console.log('Unable to get history announcements');
    }
  }

  const handlePageChange = (page) => {
    setPage(page);
  }

  useEffect(() => {
    getTopAnnouncement()
    getRecentFourAnnouncements()
    getHistoryAnnouncements()
  }, []);

  function highlightImportance(title, importance) {
    if (!importance) {
      return(
      <Typography>
        {title} 
      </Typography>
      );
    }
    return (
      <Typography style={{ fontWeight : "bold" }}>
        {title} 
      </Typography>
    );
  }

  function populateAnnouncements() {
    return (
      historyAnnouncements.filter((announcement, index) => index >= page * 10 - 10 && index < page * 10).map((announcement, index) => (
        <TableRow key={index}>
          <TableCell component="th" scope="row">
            {highlightImportance(announcement.title, announcement.importance)}
          </TableCell>
          <TableCell component="th" scope="row">
            {shortenTime(announcement.created_time)}
          </TableCell>
          <TableCell component="th" scope="row">
            <Box className={classes.historyAnnouncementContent}>
              {announcement.content} <Link to={{
                pathname: `/announcements/detail/${announcement.title}`,
                state: announcement
              }}>[more]</Link>
            </Box>
          </TableCell>
        </TableRow>
      ))
    )
  }

  function table() {
    return (
      <div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Title</TableCell>
                <TableCell align="left">Time</TableCell>
                <TableCell align="left">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {populateAnnouncements()}
            </TableBody>
          </Table>
          <Pagination count={Math.ceil(historyAnnouncements.length / 10)} page={page} className={classes.pagination} onChange={(e, p) => handlePageChange(p)} />
        </TableContainer>
      </div>
    );
  }

  // const title = (
  //   <Card className={classes.titlebox}>
  //     <Typography className={classes.title} gutterBottom style={{ fontSize: '30px' }}>
  //       Announcements
  //     </Typography>
  //   </Card>
  // )

  function ImportantEvent() {
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography gutterBottom variant="h4" component="div">
            {topAnnouncement.title}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {shortenTime(topAnnouncement.created_time)}
          </Typography>
          <Box className={classes.topAnnouncementContent}>
            <Typography variant="h6" color="text.secondary">
              {topAnnouncement.content}
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          <Button size="small">
            <Link to={{
              pathname: `/announcements/detail/${topAnnouncement.title}`,
              state: topAnnouncement
            }}>Learn More</Link>
          </Button>
        </CardActions>
      </Card>
    );
  };

  function RecentEvent(announcement) {
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {announcement.title}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {shortenTime(announcement.created_time)}
          </Typography>
          <Box className={classes.recentFourAnnouncementContent}>
            <Typography variant="body2" color="text.secondary">
              {announcement.content}
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          <Button size="small">
            <Link to={{
              pathname: `/announcements/detail/${announcement.title}`,
              state: announcement
            }}>Learn More</Link>
          </Button>
        </CardActions>
      </Card>
    );
  };

  function fourRecentEvents() {
    return (
      <Grid container spacing={2}>
        {recentFourAnnouncements.map((announcement, index) => (
          <Grid item xs={6}>
            {RecentEvent(announcement)}
          </Grid>
        ))}
      </Grid>
    );
  }

  function shortenTime(time) {
    if (typeof time !== 'undefined'){
      return time.substring(0,10);
    }
    return "";
  }

  return (
    <div style={{
      backgroundImage: `url("${process.env.PUBLIC_URL}/images/2022_theme.png")`,
      backgroundSize: 'cover',
      height: "100vh"
    }}>
      <Container fixed className={classes.container} >
      <Box py={2}>
        <Grid container spacing={4}>
          {/* <Grid item>
            {title}
          </Grid> */}

          <Grid container spacing={2}>
            <Grid item xs={0.5}>
            </Grid>
            <Grid item xs={12}>
              {ImportantEvent()}
            </Grid>
            <Grid item xs={12}>
              {fourRecentEvents()}
            </Grid>
          </Grid>

          <Grid item>
          </Grid>

          <Grid container>
            <Grid item xs={12}>
              {table()}
            </Grid>
          </Grid>

          <Grid item>
          </Grid>
        </Grid>
      </Box>
    </Container>
    </div>
    
  );
};

