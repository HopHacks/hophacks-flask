import React, { useState, useEffect } from 'react';
import { withAdminAuthCheck } from '../../util/auth';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import axios from 'axios';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import { Link } from 'react-router-dom';
import { InputAdornment, TableCell, TextField, Tooltip, withStyles } from '@material-ui/core';

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

  async function handleRSVPResumeDownload() {
    users.forEach(async (user) => {
      if (user.email_confirmed && user.registrations[0].status == 'rsvped') {
        await axios.get('/api/admin/resume?id=' + user.id);
        const url = response.data['url'];
        window.open(url, '_blank');
      }
    });
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
      event: 'Fall 2023'
    });
  }

  async function rejectUser(id) {
    await axios.post('/api/registrations/reject', {
      user: id,
      event: 'Fall 2023'
    });
  }

  async function checkInUser(id) {
    await axios.post('/api/registrations/check_in', {
      user: id,
      event: 'Fall 2023'
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
    } else if (status == 'email not confirmed') {
      return !user.email_confirmed;
    } else {
      if (user.email_confirmed) {
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
            <Link onClick={() => handleResumeDownload(user.id)}>
              <InsertDriveFileOutlinedIcon
                style={{
                  color: '#24292F'
                }}
              />
            </Link>
          </Tooltip>
        </StyledTableCell>

        <StyledTableCell>
          <Tooltip title="Vaccine">
            <Link onClick={() => handleVaccinationDownload(user.id)}>
              <AssignmentOutlinedIcon
                style={{
                  color: '#24292F'
                }}
              />
            </Link>
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
        <MenuItem value="not">Not checked in</MenuItem>
        <MenuItem value="checked_in">Checked in</MenuItem>
        <MenuItem value="email not confirmed">Email not Confirmed</MenuItem>
        <MenuItem value="rsvped">Rsvped</MenuItem>
        <MenuItem value="rejected">Rejected</MenuItem>
        <MenuItem value="accepted">Accepted</MenuItem>
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
    <Container fixed>
      <Box style={{ backgroundColor: 'white' }} padding="1rem">
        {/* <>
        <button onClick={() => sendAllRsvpEmails()}>Send Rsvp Email</button>
      </> */}
        {
          <>
            <button onClick={() => handleRSVPResumeDownload()}>Download RSVP resumes</button>
          </>
        }
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
