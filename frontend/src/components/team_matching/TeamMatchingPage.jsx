import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, TextField, IconButton, Select, MenuItem, Typography, InputLabel, FormControl, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import SearchIcon from '@material-ui/icons/Search';
import TeamCard from './TeamCard';
import '../../stylesheets/teammatch.css';

function img(url) {
  return 'https://hophacks-website.s3.amazonaws.com/images/' + url;
}

const useStyles = makeStyles({
  container: {
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '5% 0',
    backgroundImage: `url(${img('team_matching_bkg.jpg')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  title: {
    fontFamily: 'Proxima Nova',
    color: '#F3F6FB',
    fontSize: '48px',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: '2em',
  },
  searchBar: props => ({
    backgroundColor: '#F3F6FB',
    marginBottom: '2em',
    padding: '1em',
    width: props.isMobile ? '90vw' : '75vw',
  }),
  textField: {
    flex: 1,
  },
  formControl: {
    marginLeft: '1em',
    minWidth: 120,
  },
  teamsContainer: props => ({
    display: 'flex',
    flexDirection: props.isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    width: props.isMobile ? '90vw' : '75vw',
  }),
});

export default function TeamMatchingPage({ isMobile }) {
  const classes = useStyles({ isMobile });

  const sampleData = [
    {
      teamName: 'Team Alpha',
      intro: "Intro of Team Alpha...",
      lookingFor: 'We are looking for a full-stack developer.',
      recruit_info: "Recruitment info for Team Alpha...",
      tags: ['Full-stack', 'React', 'Python'],
    },
    {
      teamName: 'Team Alpha',
      intro: "Intro of Team Alpha...",
      lookingFor: 'We are looking for a full-stack developer.',
      recruit_info: "Recruitment info for Team Alpha...",
      tags: ['Full-stack', 'React', 'Python'],
    },
    {
      teamName: 'Team Alpha',
      intro: "Intro of Team Alpha...",
      lookingFor: 'We are looking for a full-stack developer.',
      recruit_info: "Recruitment info for Team Alpha...",
      tags: ['Full-stack', 'React', 'Python'],
    },
    // ... add 4 more sample teams
  ];

  const [teams, setTeams] = useState(sampleData);

  useEffect(() => {
    // axios.get('your-endpoint-url')
    //   .then(res => {
    //     const data = res.data;
    //     setTeams(data);
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
  }, []);

  return (
    <Box className={classes.container}>
      <Typography className={classes.title}>Find Your Team(mates)!</Typography>
      <AppBar position="static" color="transparent" className={classes.searchBar}>
        <Toolbar style={{flexDirection: isMobile ? 'column' : 'row'}}>
          <TextField className={classes.textField} label="Search" variant="outlined" fullWidth />
          <IconButton>
            <SearchIcon />
          </IconButton>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Sort</InputLabel>
            <Select>
              <MenuItem value="az">A-Z</MenuItem>
              <MenuItem value="za">Z-A</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Status</InputLabel>
            <Select>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>
      <Box className={classes.teamsContainer}>
        {teams.map((team, index) => (
          <>
            <TeamCard key={index} {...team} />
            {!isMobile && index < teams.length - 1 && <Box width="20px" />}
          </>
        ))}
      </Box>
    </Box>
  );
}





