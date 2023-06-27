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
    padding: '2% 0',
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
    marginBottom: '1em', // or whatever value you see fit to bring it closer to the search bar
    marginLeft: '5%', // adjust this value to move the title to the left as needed
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
    flexDirection: 'column',
    width: props.isMobile ? '90vw' : '75vw',
  }),

  teamRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  
  cardContainer: props => ({
    width: props.isMobile ? '100%' : 'calc(50% - 10px)',
  }),
});

export default function TeamMatchingPage({ isMobile }) {
  const classes = useStyles({ isMobile });

  const sampleData = [
    // ... your sample data
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
        {
        teamName: 'Team Alpha',
        intro: "Intro of Team Alpha...",
        lookingFor: 'We are looking for a full-stack developer',
        recruit_info: "Recruitment info for Team Alpha....We are looking for a full-stack developer.We are looking for a full-stack developer.We are looking for a full-stack developer.We are looking for a full-stack developer.",
        tags: ['Full-stack', 'React', 'Python'],
      },
      {
        teamName: 'Team Alpha',
        intro: "Intro of Team Alpha...",
        lookingFor: 'We are looking for a full-stack developer',
        recruit_info: "Recruitment info for Team Alpha....We are looking for a full-stack developer.We are looking for a full-stack developer.We are looking for a full-stack developer.We are looking for a full-stack developer.",
        tags: ['Full-stack', 'React', 'Python'],
      },
      {
        teamName: 'Team Alpha',
        intro: "Intro of Team Alpha...",
        lookingFor: 'We are looking for a full-stack developer.We are looking for a full-stack developer.We are looking for a full-stack developer.We are looking for a full-stack developer.We are looking for a full-stack developer.',
        recruit_info: "Recruitment info for Team Alpha...",
        tags: ['Full-stack', 'React', 'Python'],
      },
  
  ];

  const [teams, setTeams] = useState(sampleData);

  useEffect(() => {
    // your axios request
  }, []);

  const teamRows = [];
  if(isMobile) {
    for(let i = 0; i < teams.length; i++) {
      teamRows.push(
        <Box className={classes.teamRow} key={i}>
          <Box className={classes.cardContainer}>
            <TeamCard {...teams[i]} />
          </Box>
        </Box>
      );
    }
  } else {
    for(let i = 0; i < teams.length; i += 2) {
      teamRows.push(
        <Box className={classes.teamRow} key={i}>
          <Box className={classes.cardContainer}>
            <TeamCard {...teams[i]} />
          </Box>
          {teams[i + 1] && (
            <Box className={classes.cardContainer}>
              <TeamCard {...teams[i + 1]} />
            </Box>
          )}
        </Box>
      );
    }
  }

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
        {teamRows}
      </Box>
    </Box>
  );
}



