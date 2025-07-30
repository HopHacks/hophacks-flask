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
import { InputAdornment, TableCell, TextField, Tooltip, withStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  pagination: {
    marginTop: '3%',
    marginLeft: '40%'
  },
  table: {
    width: '100%',
    tableLayout: 'fixed'
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
  const [dateSort, setDateSort] = useState('No'); // New state for date sorting
  
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

  async function getUsers() {
    const response = await axios.get('/api/admin/users' + '?query=');
    setAllUsers(response.data.users);
    setusers(performFiltering2(response.data.users));
    //setusers(response.data.users);
  }

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

  function handleNewDateSort(value) {
    setDateSort(value);
    performFiltering();
  }

  function newQuery(value) {
    setQuery(value);
    performFiltering();
  }

  function performFiltering() {
    let filteredUsers = [...allUsers];

    // Apply status filter
    filteredUsers = filteredUsers.filter((user) => filterUser(user));

    // Apply search query
    if (query !== '') {
      filteredUsers = filteredUsers.filter((user) =>
        user.profile.first_name.toLowerCase().includes(query.toLowerCase()) ||
        user.profile.last_name.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply sorting
    if (alphaOrder === 'Yes') {
      filteredUsers.sort((a, b) =>
        a.profile.first_name.localeCompare(b.profile.first_name)
      );
    } else if (dateSort === 'Newest') {
      filteredUsers.sort((a, b) => {
        const dateA = a.fall2025_apply_at ? new Date(a.fall2025_apply_at) : new Date(0);
        const dateB = b.fall2025_apply_at ? new Date(b.fall2025_apply_at) : new Date(0);
        return dateB - dateA; // Newest first
      });
    } else if (dateSort === 'Oldest') {
      filteredUsers.sort((a, b) => {
        const dateA = a.fall2025_apply_at ? new Date(a.fall2025_apply_at) : new Date(0);
        const dateB = b.fall2025_apply_at ? new Date(b.fall2025_apply_at) : new Date(0);
        return dateA - dateB; // Oldest first
      });
    }

    setusers(filteredUsers);
  }

  function performFiltering2(allUsersInput) {
    let filteredUsers = [...allUsersInput];

    // Apply status filter
    filteredUsers = filteredUsers.filter((user) => filterUser(user));

    // Apply search query
    if (query !== '') {
      filteredUsers = filteredUsers.filter((user) =>
        user.profile.first_name.toLowerCase().includes(query.toLowerCase()) ||
        user.profile.last_name.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply sorting
    if (alphaOrder === 'Yes') {
      filteredUsers.sort((a, b) =>
        a.profile.first_name.localeCompare(b.profile.first_name)
      );
    } else if (dateSort === 'Newest') {
      filteredUsers.sort((a, b) => {
        const dateA = a.fall2025_apply_at ? new Date(a.fall2025_apply_at) : new Date(0);
        const dateB = b.fall2025_apply_at ? new Date(b.fall2025_apply_at) : new Date(0);
        return dateB - dateA; // Newest first
      });
    } else if (dateSort === 'Oldest') {
      filteredUsers.sort((a, b) => {
        const dateA = a.fall2025_apply_at ? new Date(a.fall2025_apply_at) : new Date(0);
        const dateB = b.fall2025_apply_at ? new Date(b.fall2025_apply_at) : new Date(0);
        return dateA - dateB; // Oldest first
      });
    }

    return filteredUsers;
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
  }, [alphaOrder, status, query, dateSort]); // Added dateSort to dependency array

  function populateUsers() {
    return users.map((user, index) => (
      <TableRow key={index}>
        <StyledTableCell component="th" scope="row" style={{ width: '15%' }}>
          {user.username}
        </StyledTableCell>
        <StyledTableCell style={{ width: '12%' }}>{user.profile.first_name}</StyledTableCell>
        <StyledTableCell style={{ width: '12%' }}>{user.profile.last_name}</StyledTableCell>
        <StyledTableCell style={{ width: '15%' }}>{user.profile.school}</StyledTableCell>
        <StyledTableCell style={{ width: '12%' }}>{getStatus(user)}</StyledTableCell>
        <StyledTableCell style={{ width: '12%' }}>
          {user.fall2025_apply_at
            ? new Date(user.fall2025_apply_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            : 'N/A'}
        </StyledTableCell>

        <StyledTableCell style={{ width: '8%' }}>
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
        <StyledTableCell style={{ width: '8%' }}>
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
        <StyledTableCell style={{ width: '8%' }}>
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
        <StyledTableCell style={{ width: '4%' }}>
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

        <StyledTableCell style={{ width: '4%' }}>
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
      <InputLabel>Sort by Name</InputLabel>
      <Select
        onChange={(e) => {
          handleNewSort(e.target.value);
          if (e.target.value === 'Yes') {
            setDateSort('No'); // Reset date sort when name sort is selected
          }
        }}
        value={alphaOrder}
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

  const DateSortPicker = (
    <FormControl variant="outlined" style={{ minWidth: 220 }}>
      <InputLabel>Sort by Date</InputLabel>
      <Select
        onChange={(e) => {
          handleNewDateSort(e.target.value);
          if (e.target.value !== 'No') {
            setAlphaOrder('No'); // Reset name sort when date sort is selected
          }
        }}
        value={dateSort}
        style={{
          backgroundColor: 'rgba(219, 226, 237, 0.50)',
          borderRadius: '10px',
          height: '50px'
        }}
      >
        <MenuItem value="No">No</MenuItem>
        <MenuItem value="Newest">Newest First</MenuItem>
        <MenuItem value="Oldest">Oldest First</MenuItem>
      </Select>
    </FormControl>
  );

  const table = (
    <div>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <HeaderTableCell style={{ width: '15%' }}>Email</HeaderTableCell>
              <HeaderTableCell style={{ width: '12%' }}>First Name</HeaderTableCell>
              <HeaderTableCell style={{ width: '12%' }}>Last Name</HeaderTableCell>
              <HeaderTableCell style={{ width: '15%' }}>School</HeaderTableCell>
              <HeaderTableCell style={{ width: '12%' }}>Status</HeaderTableCell>
              <HeaderTableCell style={{ width: '12%' }}>Applied At</HeaderTableCell>
              <HeaderTableCell style={{ width: '8%' }}>Accept</HeaderTableCell>
              <HeaderTableCell style={{ width: '8%' }}>Reject</HeaderTableCell>
              <HeaderTableCell style={{ width: '8%' }}>Check In</HeaderTableCell>
              <HeaderTableCell style={{ width: '4%' }}>Resume</HeaderTableCell>
              <HeaderTableCell style={{ width: '4%' }}>LinkedIn</HeaderTableCell>
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
        <Box display="flex" alignItems="center" justifyContent="space-between" gap="1rem">
          <TextField
            value={query}
            label="Search"
            onChange={(e) => newQuery(e.target.value)}
            variant="outlined"
            style={{
              width: '40%',
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
          {DateSortPicker}
          {StatusPicker}
        </Box>
        <div>{populateUsers}</div>
        {table}
      </Box>
    </Container>
  );
};

export default withAdminAuthCheck(Admin);