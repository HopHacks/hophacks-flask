import React, { useState, useEffect } from 'react';
import { withAdminAuthCheck } from '../../util/auth';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import SearchBar from 'material-ui-search-bar';
import axios from 'axios';
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
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  pagination: {
    marginTop: '3%',
    marginLeft: '40%'
  }
}));

const Admin = function () {
  const classes = useStyles();
  const [users, setusers] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [allUsers, setAllUsers] = useState([]);
  const [alphaOrder, setAlphaOrder] = useState('No');
  useEffect(() => {
    getUsers();
  }, []);

  async function handleResumeDownload(userid) {
    const response = await axios.get('/api/admin/resume?id=' + userid);
    const url = response.data['url'];
    window.open(url, '_blank');
  }

  async function handleVaccinationDownload(userid) {
    const response = await axios.get('/api/admin/vaccination?id=' + userid);
    const url = response.data['url'];
    window.open(url, '_blank');
  }

  async function getUsers() {
    const response = await axios.get('/api/admin/users' + '?query=');
    setAllUsers(response.data.users);
    setusers(response.data.users);
  }

  // async function sendAllRsvpEmails(){
  //   const response = await axios.post('/api/registrations/rsvp/info/all');
  //   alert("All Emails Sent")
  // }

  async function acceptUser(id) {
    await axios.post('/api/registrations/accept', {
      users: [id],
      event: 'Fall 2022'
    });
  }

  async function rejectUser(id) {
    await axios.post('/api/registrations/reject', {
      user: id,
      event: 'Fall 2022'
    });
  }

  async function checkInUser(id) {
    await axios.post('/api/registrations/check_in', {
      user: id,
      event: 'Fall 2022'
    });
  }

  function getStatus(user) {
    if (user.email_confirmed) {
      return user.registrations[0].status;
    } else {
      return 'email not confirmed';
    }
  }

  function handleNewStatus(value) {
    setStatus(value);
    performFiltering();
  }

  function handleNewSort(value) {
    setAlphaOrder(value);
    performFiltering();
  }
  function newQuery(value) {
    setQuery(value);
    performFiltering();
  }

  function performFiltering() {
    if (alphaOrder == 'Yes') {
      const sortedUsers = [...allUsers].sort((a, b) =>
        a.profile.first_name.localeCompare(b.profile.first_name)
      );
      if (query == '') {
        setusers(sortedUsers.filter((user) => filterUser(user)));
      } else {
        const searchedusers = sortedUsers.filter((user) => user.profile.first_name.includes(query));
        setusers(searchedusers);
      }
    } else {
      if (query == '') {
        setusers([...allUsers].filter((user) => filterUser(user)));
      } else {
        const searchedusers = [...allUsers].filter((user) =>
          user.profile.first_name.includes(query)
        );
        setusers(searchedusers);
      }
    }
  }

  function filterUser(user) {
    if (status == 'All') {
      return true;
    } else if (status == 'not') {
      if (user.email_confirmed) {
        return user.registrations[0].status != 'checked_in';
      } else {
        return true;
      }
    } else {
      if (user.email_confirmed) {
        return user.registrations[0].status == 'checked_in';
      } else {
        return false;
      }
    }
  }

  useEffect(() => {
    performFiltering();
  }, [alphaOrder, status, query]);

  function populateUsers() {
    return users.map((user, index) => (
      <TableRow key={index}>
        <TableCell component="th" scope="row">
          {user.username}
        </TableCell>
        <TableCell align="right">{user.profile.first_name}</TableCell>
        <TableCell align="right">{user.profile.last_name}</TableCell>
        <TableCell align="right">{user.profile.school}</TableCell>
        <TableCell align="right">{getStatus(user)}</TableCell>

        <TableCell>
          <Link
            onClick={() => handleResumeDownload(user.id)}
            style={{ fontSize: '15px', color: 'blue' }}
          >
            Download
          </Link>
        </TableCell>

        <TableCell>
          <Link
            onClick={() => handleVaccinationDownload(user.id)}
            style={{ fontSize: '15px', color: 'blue' }}
          >
            Download
          </Link>
        </TableCell>

        <TableCell align="right">
          <Button
            onClick={() => {
              acceptUser(user.id);
              getUsers();
            }}
          >
            Accept
          </Button>
        </TableCell>
        <TableCell align="right">
          <Button
            onClick={() => {
              rejectUser(user.id);
              getUsers();
            }}
          >
            Reject
          </Button>
        </TableCell>
        <TableCell align="right">
          <Button
            onClick={() => {
              checkInUser(user.id);
              getUsers();
            }}
          >
            Check in
          </Button>
        </TableCell>
      </TableRow>
    ));
  }

  const StatusPicker = (
    <FormControl variant="outlined" style={{ minWidth: 220 }}>
      <InputLabel>Status</InputLabel>
      <Select
        onChange={(e) => {
          handleNewStatus(e.target.value);
        }}
        defaultValue={'All'}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="not">Not checked in</MenuItem>
        <MenuItem value="checked_in">Checked in</MenuItem>
      </Select>
    </FormControl>
  );

  const OrderPicker = (
    <FormControl variant="outlined" style={{ minWidth: 220 }}>
      <InputLabel>Alphabetical Order</InputLabel>
      <Select
        onChange={(e) => {
          handleNewSort(e.target.value);
        }}
        defaultValue={'No'}
      >
        <MenuItem value="Yes">Yes</MenuItem>
        <MenuItem value="No">No</MenuItem>
      </Select>
    </FormControl>
  );

  const table = (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>email</TableCell>
              <TableCell align="right">First Name</TableCell>
              <TableCell align="right">Last Name</TableCell>
              <TableCell align="right">School</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Resume</TableCell>
              <TableCell align="right">Vaccination</TableCell>
              <TableCell align="right">Actions</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{populateUsers()}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  return (
    <Container fixed>
      <Box style={{ backgroundColor: 'white' }}>
        <div style={{ marginBottom: 20 }}>
          {/* <>
        <button onClick={() => sendAllRsvpEmails()}>Send Rsvp Email</button>
      </> */}
          <SearchBar
            value={query}
            onChange={(newValue) => newQuery(newValue)}
            /*onRequestSearch={() => getUsers()}*/
          />
        </div>
        {StatusPicker}
        {OrderPicker}
        <div>{populateUsers}</div>

        {table}
      </Box>
    </Container>
  );
};

export default withAdminAuthCheck(Admin);
