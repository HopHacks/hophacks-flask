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
    inboxdescription: {
        display: "-webkit-box",
        boxOrient: "vertical",
        lineClamp: 2,
        wordBreak: "break-all",
        overflow: "hidden"
    },
});

export default function Announcements() {
    const classes = useStyles();
    
    const [page, setPage] = useState(1);
    const [announcements, setAnnouncements] = useState([]);
    const [first_important_announcement,setTopAnnouncement] = useState({});
    const [query, setQuery] = useState("");
    const [event, setEvent] = useState("Spring 2022");
    const [totalPage, setTotalPage] = useState(1);

    function img(url) {
        return process.env.PUBLIC_URL + '/images/' + url;
    }

    const handleChange = (event, value) => {
        getTopAnnouncements()
        setPage(value);
        getAnnouncements();
        
    };

    useEffect(() => {
      getTopAnnouncements()
      getAnnouncements()
    }, []);

    async function getTopAnnouncements(){
      try{
        const response1 = await axios.get('/api/announcements/important'+"?event=Spring_2022");
        setTopAnnouncement(response1.data.first_important_announcement);
      } catch (ex){
        console.log('Unable to get top announcement');
      }
      
    }

    async function getAnnouncements(){
      try{
        const response = await axios.get('/api/announcements'+"?event=Spring_2022");
        setAnnouncements(response.data.announcements);
      } catch (ex){
        console.log('Unable to get all announcements');
      }
    }

    function populateAnnouncements() {
        return (
          announcements.map((announcement, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
              {announcement.title}
              </TableCell>
              <TableCell align="right">
              {announcement.time} 
              </TableCell>
              <TableCell align="right">
              {announcement.contents} {/*# change or add importance later*/}
              </TableCell>
            </TableRow>
          ))
        )
      }

    const table = (
        <div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Title</TableCell>
                <TableCell align="left">Time</TableCell>
                <TableCell align="left">Details</TableCell>
                {/*<TableCell align="right">Importance</TableCell>*/}
              </TableRow>
            </TableHead>
            <TableBody>
              {populateAnnouncements}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
      )

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
            Important Announcement
            </Typography> 
            <img className={classes.imAnnouncementPic} src={img("hoplogo.png")} alt="default-img" />
            <Typography variant="h6" gutterBottom>
            Time
            </Typography>
            <Box className={classes.inboxdescription}>
                <Typography variant="h6" color="text.secondary">
                Description: esnvs jnvsd nvn disjvk jsdj vdjsvjdsj vdjfi mvsdkmvk snvkns kvjksdnv kdsfmk sdmvkj dsis nfkfkse fkjie sjfjseijf siejgvkzsjev gj esi jvijw sjvs ejv sjvzsjoz sjrv jks djfisovs irodj sfsd svndvi efjli zdsnz fzskei hv i zsjfesd bv ladh flsd hvldhs vhsilhv one two three one two three one two three one two three one two three
                </Typography>
            </Box>
        </CardContent>
        <CardActions>
        <Button size="small">Learn More</Button>
        </CardActions>
        </Card>
        );
    };

    function RecentEvent() {
        return (
        <Card>
        <CardContent>
        <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
            <img className={classes.announcementPic} src={img("hoplogo.png")} alt="default-img" />
            </Grid>

            <Grid item xs={12} sm container zeroMinWidth>
                <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                      <Typography gutterBottom variant="h5" component="div">
                        Announcement Title
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Time
                      </Typography>
                      <Box className={classes.inboxdescription}>
                        <Typography variant="body2" color="text.secondary">
                            Description: esnvs jnvsd nvn disjvk jsdj vdjsvjdsj vdjfi mvsdkmvk snvkns kvjksdnv kdsfmk sdmvkj dsis nfkfkse fkjie sjfjseijf siejgvkzsjev gj esi jvijw sjvs ejv sjvzsjoz sjrv jks djfisovs irodj sfsd svndvi efjli zdsnz fzskei hv i zsjfesd bv ladh flsd hvldhs vhsilhv one two three one two three one two three one two three one two three
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item>
                    <Button size="small">Learn More</Button>
                    </Grid>
                  </Grid>
            </Grid>
        </Grid>
        </CardContent>
        </Card>
        );
    };

    const threeRecentEvents = (
        <React.Fragment>
        <Grid container spacing={1}>
        {Array.from(Array(3)).map((_, index) => (
            <Grid item xs={12}>
                <RecentEvent />
            </Grid> 
        ))}
        </Grid>
        </React.Fragment>
    )

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
                    <ImportantEvent />
                    </Grid>
                    <Grid item xs={0.5}>
                    </Grid>
                    <Grid item xs={6}>
                    {threeRecentEvents}
                    </Grid>
                </Grid>

                <Grid item>
                    
                </Grid>

                <Grid item xs={12}>
                <Card>
                {table}
                
                <div className={classes.pagination}>
                <Pagination count={totalPage} page={page} onChange={handleChange} />
                </div>
                
                </Card>
                </Grid>
            </Grid>
            </Box>
        </Container>
        
    )
};
