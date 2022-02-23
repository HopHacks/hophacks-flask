import React, { useState, useEffect } from "react";
import { withAdminAuthCheck } from "../../util/auth";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import Select from '@material-ui/core/Select';
import SearchBar from "material-ui-search-bar";
import axios from "axios";
import SchoolAutocomplete from '../account/SchoolAutocomplete'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({

  pagination: {
    marginTop: "3%",
    marginLeft: "40%",
  },

  margin: {
    marginBottom: "13px",
  },
  color: {
    backgroundColor: "#d1e9ff",
  },
  bodycolor: {

  },
  title: {
    color: "#7289da",
    fontFamily: "VCR OSD Mono",
  },

}));

const Admin = function () {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [users, setusers] = useState([]);
  const [query, setQuery] = useState("");
  const [event, setEvent] = useState("fall_2021");
  const [status, setStatus] = useState("All");
  const [totalPage, setTotalPage] = useState(1);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  // const [announcementSubmitMsg, setAnnouncementSubmitMsg] = useState("");

  const handleChange = (event, value) => {
    setPage(value);
    setusers([]);
    getUsers();
  };

  async function getUsers() {
    const response = await axios.get('/api/admin/users' + '?page_num=' + page + '&query=' + query + "&status=" + status);
    setusers(response.data.users);
    setTotalPage(response.data.totalPage);
  }

  async function acceptUser(id) {
    const response = await axios.post('/api/registrations/accept',
      {
        "users": [id],
        "event": "Fall 2021"
      });
  }

  async function rejectUser(id) {
    const response = await axios.post('/api/registrations/reject',
      {
        "user": id,
        "event": "Fall 2021"
      });
  }

  async function checkInUser(id) {
    const response = await axios.post('/api/registrations/check_in',
      {
        "user": id,
        "event": "Fall 2021"
      });
  }

  function getStatus(user) {
    if (user.email_confirmed) {
      return user.registrations[0].status
    }
    else {
      return "email not confirmed"
    }
  }

  useEffect(() => {
    getUsers()
  }, []);

  function populateUsers() {
    return (
      users.map((user, index) => (
        <TableRow key={index}>
          <TableCell component="th" scope="row">
            {user.id}
          </TableCell>
          <TableCell align="right">
            {user.profile.first_name}
          </TableCell>
          <TableCell align="right">
            {user.profile.last_name}
          </TableCell>
          <TableCell align="right">
            {getStatus(user)}
          </TableCell>
          <TableCell align="right">
            <Button onClick={() => {
              acceptUser(user.id)
              getUsers()
            }
            }>Accept</Button>
          </TableCell>
          <TableCell align="right">
            <Button onClick={() => {
              rejectUser(user.id)
              getUsers()
            }}>Reject</Button>
          </TableCell>
          <TableCell align="right">
            <Button onClick={() => {
              checkInUser(user.id)
              getUsers()
            }}>Check in</Button>
          </TableCell>
        </TableRow>
      ))
    )
  }

  const StatusPicker = (
    <FormControl variant="outlined" style={{ minWidth: 220 }}>
      <InputLabel >Status</InputLabel>
      <Select
        onChange={(e) => {
          setStatus(e.target.value);
          getUsers();
        }}

        defaultValue={"All"}
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="email_not_comfirmed">Email not confirmed</MenuItem>
        <MenuItem value="applied">Applied</MenuItem>
        <MenuItem value="accepted">Accepted</MenuItem>
        <MenuItem value="rejected">Rejected</MenuItem>
        <MenuItem value="rsvped">Rsvp</MenuItem>
        <MenuItem value="checked_in">Checked in</MenuItem>

      </Select>
    </FormControl>
  )

  const table = (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell align="right">First Name</TableCell>
              <TableCell align="right">Last Name</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {populateUsers()}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )

  async function handleAnnouncementSubmit() {
    // if (title.length === 0 || body.length === 0) {
    //   setAnnouncementSubmitMsg("* Required field cannot be empty.")
    //   return;
    // }

    try {
      await axios.post('/api/announcements/create', {
        "title": title,
        "body": body
      })
    }
    catch (e) {
      return;
    }
  };

  return (
    <Container fixed>
      <Box style={{ backgroundColor: "white" }}>
        <SearchBar
          value={query}
          onChange={(newValue) => setQuery(newValue)}
          onRequestSearch={() => getUsers()}
        />

        {StatusPicker}

        {populateUsers}

        {table}

        <div className={classes.pagination}>
          <Pagination count={totalPage} page={page} onChange={handleChange} />
        </div>
      </Box>
      <Box style={{ backgroundColor: "white" }}>
        <Card raised="true" className={`${classes.margin} ${classes.color}`} >
          <Typography className={classes.title} variant="h4" gutterBottom>Announcements</Typography>
          <Grid container direction={"column"} spacing={2}>
            <Grid item>
              <TextField required id="standard-basic" variant="outlined" label="Title" />
            </Grid>
            <Grid item>
              <FormControl required variant="outlined" style={{ minWidth: 500 }}>
                <TextField required id="standard-basic" variant="outlined" label="Body" />
              </FormControl>
            </Grid>
          </Grid>
          {/* <Typography style={{ color: "red" }}>
          {announcmentSubmitMsg}
        </Typography> */}
        <div className={classes.actionsContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleAnnouncementSubmit();
              }}
              className={classes.button}
            >
              Submit
            </Button>
          </div>
        </Card>
      </Box>

    </Container>

  );
};

export default withAdminAuthCheck(Admin);
