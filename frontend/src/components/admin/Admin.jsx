import React, { useState, useEffect } from 'react';
import { withAdminAuthCheck } from '../../util/auth';
import { makeStyles } from '@mui/styles';
import Select from '@mui/material/Select';
import axios from 'axios';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { InputAdornment, TableCell, TextField, Tooltip } from '@mui/material';
import { withStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  pagination: {
    marginTop: '3%',
    marginLeft: '40%'
  }
}));

const StyledTableCell = withStyles({
  root: {
    color: '#122F4C'
  }
})(TableCell);

const HeaderTableCell = withStyles({
  root: {
    color: '#122F4C',
    fontSize: '1.1rem'
  }
})(TableCell);

const event = 'Fall 2025';

const Admin = function () {
  const myVariable = process.env.REACT_APP_BACKENDURL;

  if (myVariable != '') {
    axios.defaults.baseURL = myVariable;
  }
  const classes = useStyles();
  const [users, setusers] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [allUsers, setAllUsers] = useState([]);
  const [alphaOrder, setAlphaOrder] = useState('No');
  useEffect(() => {
    getUsers();
    //performFiltering();
  }, []);

  async function handleResumeDownload(userid) {
    const response = await axios.get('/api/admin/resume?id=' + userid);
    const url = response.data['url'];
    window.open(url, '_blank');
  }

  async function handleRSVPAndAcceptedResumeDownload() {
    users.forEach(async (user) => {
      for (let i = 0; i < user.registrations.length; i++) {
        if (user.registrations[i].event === event) {
          if (
            user.email_confirmed &&
            (user.registrations[i].status == 'rsvped' || user.registrations[i].status == 'accepted')
          ) {
            const response = await axios.get('/api/admin/resume?id=' + user.id);
            const url = response.data['url'];
            window.open(url, '_blank');
          }
        }
      }
    });
  }

  async function handleCheckedInResumeDownload() {
    users.forEach(async (user) => {
      for (let i = 0; i < user.registrations.length; i++) {
        if (user.registrations[i].event === event) {
          if (user.email_confirmed && user.registrations[i].status == 'checked_in') {
            const response = await axios.get('/api/admin/resume?id=' + user.id);
            const url = response.data['url'];
            window.open(url, '_blank');
          }
        }
      }
    });
  }

  // async function handleVaccinationDownload(userid) {
  //   const response = await axios.get('/api/admin/vaccination?id=' + userid);
  //   const url = response.data['url'];
  //   window.open(url, '_blank');
  // }

  async function getUsers() {
    const response = await axios.get('/api/admin/users' + '?query=');
    setAllUsers(response.data.users);
    setusers(performFiltering2(response.data.users));
    //setusers(response.data.users);
  }

  // async function sendAllRsvpEmails(){
  //   const response = await axios.post('/api/registrations/rsvp/info/all');
  //   alert("All Emails Sent")
  // }

  async function acceptUser(id) {
    await axios.post('/api/registrations/accept', {
      users: [id],
      event: event
    });
  }

  async function rejectUser(id) {
    await axios.post('/api/registrations/reject', {
      user: id,
      event: event
    });
  }

  async function checkInUser(id) {
    await axios.post('/api/registrations/check_in', {
      user: id,
      event: event
    });
  }

  function getStatus(user) {
    if (user.email_confirmed) {
      for (let i = 0; i < user.registrations.length; i++) {
        if (user.registrations[i].event === event) {
          return user.registrations[i].status;
        }
      }
      return 'Unknown';
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

  function performFiltering2(allUsersInput) {
    if (alphaOrder == 'Yes') {
      const sortedUsers = [...allUsersInput].sort((a, b) =>
        a.profile.first_name.localeCompare(b.profile.first_name)
      );
      if (query == '') {
        return sortedUsers.filter((user) => filterUser(user));
      } else {
        const searchedusers = sortedUsers.filter((user) => user.profile.first_name.includes(query));
        return searchedusers;
      }
    } else {
      if (query == '') {
        return [...allUsersInput].filter((user) => filterUser(user));
      } else {
        const searchedusers = [...allUsers].filter((user) =>
          user.profile.first_name.includes(query)
        );
        return searchedusers;
      }
    }
  }

  function filterUser(user) {
    if (status == 'All') {
      return true;
    } else if (status == 'not') {
      if (user.email_confirmed) {
        for (let i = 0; i < user.registrations.length; i++) {
          if (user.registrations[i].event === event) {
            return user.registrations[i].status != 'checked_in';
          }
        }
        return user.registrations[0].status != 'checked_in';
      } else {
        return true;
      }
    } else if (status == 'email not confirmed') {
      return !user.email_confirmed;
    } else {
      if (user.email_confirmed) {
        for (let i = 0; i < user.registrations.length; i++) {
          if (user.registrations[i].event === event) {
            return user.registrations[i].status == status;
          }
        }
        return user.registrations[0].status == status;
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
        <StyledTableCell component="th" scope="row">
          {user.username}
        </StyledTableCell>
        <StyledTableCell>{user.profile.first_name}</StyledTableCell>
        <StyledTableCell>{user.profile.last_name}</StyledTableCell>
        <StyledTableCell>{user.profile.school}</StyledTableCell>
        <StyledTableCell>{getStatus(user)}</StyledTableCell>

        <StyledTableCell>
          <Button
            onClick={() => {
              acceptUser(user.id);
              getUsers();
            }}
            variant="contained"
            style={{ backgroundColor: '#289B50', color: 'white' }}
          >
            Accept
          </Button>
        </StyledTableCell>
        <StyledTableCell>
          <Button
            onClick={() => {
              rejectUser(user.id);
              getUsers();
            }}
            variant="contained"
            style={{ backgroundColor: '#B2392E', color: 'white' }}
          >
            Reject
          </Button>
        </StyledTableCell>
        <StyledTableCell align="right">
          <Button
            onClick={() => {
              checkInUser(user.id);
              getUsers();
            }}
            variant="contained"
            style={{ backgroundColor: '#172759', color: 'white' }}
          >
            Check in
          </Button>
        </StyledTableCell>
        <StyledTableCell>
          <Tooltip title="Resume">
            <Button onClick={() => handleResumeDownload(user.id)}>
              <InsertDriveFileOutlinedIcon
                style={{
                  color: '#24292F'
                }}
              />
            </Button>
          </Tooltip>
        </StyledTableCell>

        <StyledTableCell>
          <Tooltip title="LinkedIn">
            <Button onClick={() => window.open(user.profile.linkedIn, '_blank')}>
              <AssignmentOutlinedIcon
                style={{
                  color: '#0A66C2' // Optional: change to LinkedIn blue
                }}
              />
            </Button>
          </Tooltip>
        </StyledTableCell>
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
        style={{
          backgroundColor: 'rgba(219, 226, 237, 0.50)',
          borderRadius: '10px',
          height: '50px'
        }}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="applied">Applied</MenuItem>
        <MenuItem value="accepted">Accepted</MenuItem>
        <MenuItem value="not">Not checked in</MenuItem>
        <MenuItem value="checked_in">Checked in</MenuItem>
        <MenuItem value="email not confirmed">Email not Confirmed</MenuItem>
        <MenuItem value="rsvped">Rsvped</MenuItem>
        <MenuItem value="rejected">Rejected</MenuItem>
      </Select>
    </FormControl>
  );

  const OrderPicker = (
    <FormControl variant="outlined" style={{ minWidth: 220 }}>
      <InputLabel>Sort</InputLabel>
      <Select
        onChange={(e) => {
          handleNewSort(e.target.value);
        }}
        defaultValue={'No'}
        style={{
          backgroundColor: 'rgba(219, 226, 237, 0.50)',
          borderRadius: '10px',
          height: '50px'
        }}
      >
        <MenuItem value="Yes">A - Z</MenuItem>
        <MenuItem value="No">No</MenuItem>
      </Select>
    </FormControl>
  );

  const table = (
    <div>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <HeaderTableCell>Email</HeaderTableCell>
              <HeaderTableCell
                style={{
                  minWidth: 130
                }}
              >
                First Name
              </HeaderTableCell>
              <HeaderTableCell
                style={{
                  minWidth: 130
                }}
              >
                Last Name
              </HeaderTableCell>
              <HeaderTableCell>School</HeaderTableCell>
              <HeaderTableCell>Status</HeaderTableCell>
              <HeaderTableCell>Actions</HeaderTableCell>
              <HeaderTableCell></HeaderTableCell>
              <HeaderTableCell
                style={{
                  minWidth: 130
                }}
              ></HeaderTableCell>
              <HeaderTableCell></HeaderTableCell>
              <HeaderTableCell></HeaderTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{populateUsers()}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  return (
    <Container fixed style={{ marginTop: '80px' }}>
      <Box style={{ backgroundColor: 'white' }} padding="1rem">
        {/* <>
        <button onClick={() => sendAllRsvpEmails()}>Send Rsvp Email</button>
      </> */}
        <Box display="flex" gap="1rem" marginBottom="1rem">
          <button
            onClick={handleRSVPAndAcceptedResumeDownload}
            style={{
              backgroundColor: '#003366',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Download Accepted and RSVP Resumes
          </button>
          <button
            onClick={handleCheckedInResumeDownload}
            style={{
              backgroundColor: '#003366',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Download Checked In Resumes
          </button>
        </Box>
        Number of users: {users.length}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <TextField
            value={query}
            label="Search"
            onChange={(e) => newQuery(e.target.value)}
            variant="outlined"
            style={{
              width: '60%',
              backgroundColor: 'rgba(219, 226, 237, 0.50)',
              borderRadius: '10px',
              height: '50px'
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
              style: {
                borderRadius: 'inherit',
                height: 'inherit'
              }
            }}
          />
          {OrderPicker}
          {StatusPicker}
        </Box>
        <div>{populateUsers}</div>
        {table}
      </Box>
    </Container>
  );
};

export default withAdminAuthCheck(Admin);
