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
import {useState,useEffect} from "react";

import { Link } from 'react-router-dom';




const useStyles = makeStyles({

    title: {
        color: "#7289da",
        fontFamily: "VCR OSD Mono",
        marginLeft:'20px',
    },

    titlebox:{
        height: '60px',
        width:'100%',
        marginTop:'20px',
        marginBottom:'20px',
        marginLeft:'10px',
        marginRight:'10px',
        marginBottom:'20px',
        textAlign: 'left',
    },

    announcementPic: {
        width:'150px',
        height: '150px',
    },

    imAnnouncementPic: {
        width:'60%',
        height:'60%',
        marginLeft: '20%',
        marginRight: '20%',
    },

    pagination: {
        marginTop: "3%",
        marginLeft: "40%",
    },

    topAnnouncementContent: {
        display: "-webkit-box",
        boxOrient: "vertical",
        lineClamp: 3,
        wordBreak: "break-all",
        overflow: "hidden"
    },

    recentThreeAnnouncementContent: {
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
    const [topAnnouncement,setTopAnnouncement] = useState({});
    const [recentThreeAnnouncements, setRecentThreeAnnouncements] = useState([]);
    const [query, setQuery] = useState("");
    const [event, setEvent] = useState("Fall_2022");
    const [totalPage, setTotalPage] = useState(1);

    function img(url) {
        return process.env.PUBLIC_URL + '/images/' + url;
    }

    async function getTopAnnouncement(){
      try{
        const response = await axios.get('/api/announcements/important'+"?event="+event);
        setTopAnnouncement(response.data);
      } catch (ex){
        console.log('Unable to get top announcement');
      }
    }

    async function getRecentThreeAnnouncements(){
      try{
        const response = await axios.get('/api/announcements/recent'+"?event="+event);
        setRecentThreeAnnouncements(response.data.announcements);
      } catch (ex){
        console.log('Unable to get recent three announcements');
      }
    }

    async function getHistoryAnnouncements(){
      try{
        const response = await axios.get('/api/announcements/history'+"?event="+event);
        setHistoryAnnouncements(response.data.announcements);
      } catch (ex){
        console.log('Unable to get history announcements');
      }
    }

    const handleChange = (event, value) => {
        setTopAnnouncement({});
        getTopAnnouncement();
        setRecentThreeAnnouncements([]);
        getRecentThreeAnnouncements();
        setHistoryAnnouncements([]);
        getHistoryAnnouncements();
        setPage(value);
    };

    useEffect(() => {
      getTopAnnouncement()
      getRecentThreeAnnouncements()
      getHistoryAnnouncements()
    }, []);

    function getImportance(announcement) {
      if(announcement.importance){
        return "True";
      }
      return "False";
    }

    function populateAnnouncements() {
        return (
          historyAnnouncements.map((announcement, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {announcement.title}
              </TableCell>
              <TableCell component="th" scope="row">
                {announcement.time} 
              </TableCell>
              <TableCell component="th" scope="row">
                <Box className={classes.historyAnnouncementContent}>
                  {announcement.content} <Link to={{ 
                        pathname: `/announcements/detail/${announcement.title}`, 
                        state: announcement
                      }}>[more]</Link>
                </Box>
              </TableCell>
              <TableCell component="th" scope="row">
                {getImportance(announcement)}
              </TableCell>
            </TableRow>
          ))
        )
    }

     function table(){
       return(
        <div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Title</TableCell>
                <TableCell align="left">Time</TableCell>
                <TableCell align="left">Details</TableCell>
                <TableCell align="left">Importance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {populateAnnouncements()}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
        );
      }

    const title = (
        <Card className={classes.titlebox}>
        <Typography className={classes.title} gutterBottom style={{ fontSize: '30px' }}>
        Announcements
        </Typography>
        </Card>
    )

    function ImportantEvent() {
        return (
        <Card>
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
            {topAnnouncement.title}
            </Typography> 
            <img className={classes.imAnnouncementPic} src={img(topAnnouncement.image)} alt="default-img" />
            <Typography variant="h6" gutterBottom>
            {topAnnouncement.time}
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
        <Card>
        <CardContent>
        <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
            <img className={classes.announcementPic} src={img(announcement.image)} alt="default-img" />
            </Grid>

            <Grid item xs={12} sm container zeroMinWidth>
                <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                      <Typography gutterBottom variant="h5" component="div">
                        {announcement.title}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {announcement.time}
                      </Typography>
                      <Box className={classes.recentThreeAnnouncementContent}>
                        <Typography variant="body2" color="text.secondary">
                          {announcement.content}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item>
                    <Button size="small">
                      <Link to={{ 
                        pathname: `/announcements/detail/${announcement.title}`, 
                        state: announcement
                      }}>Learn More</Link>
                    </Button>
                    </Grid>
                  </Grid>
            </Grid>
        </Grid>
        </CardContent>
        </Card>
        );
    };

    function threeRecentEvents() {
      return (
        <Grid container spacing={1}>
        {recentThreeAnnouncements.map((announcement, index) => (
            <Grid item xs={12}>
              {RecentEvent(announcement)}
            </Grid> 
        ))}
        </Grid>
      );
    }


    return(
        <Container fixed>
            <Box py={2}>
            <Grid container spacing = {3}>
                <Grid item>
                    {title}
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={0.5}>
                    </Grid>
                    <Grid item xs={5}>
                      {ImportantEvent()}
                    </Grid>
                    <Grid item xs={0.5}>
                    </Grid>
                    <Grid item xs={6}>
                      {threeRecentEvents()}
                    </Grid>
                </Grid>

                <Grid item>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    {table()}
                    <div className={classes.pagination}>
                      <Pagination count={totalPage} page={page} onChange={handleChange} />
                    </div>  
                  </Card>
                </Grid>
            </Grid>
            </Box>
        </Container>
        
    );
};
