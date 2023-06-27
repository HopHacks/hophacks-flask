import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, TextField, IconButton, Select, MenuItem, Typography, InputLabel, FormControl, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import SearchIcon from '@material-ui/icons/Search';
import TeamCard from './TeamCard';
import '../../stylesheets/teammatch.css';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2% 0',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  title: (props) => ({
    fontFamily: 'Proxima Nova',
    color: '#F3F6FB',
    fontSize: props.isMobile ? '24px' : '48px',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: '1em',
    marginLeft: '5%',
  }),
  searchBar: (props) => ({
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
  teamsContainer: (props) => ({
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
  cardContainer: (props) => ({
    width: props.isMobile ? '100%' : 'calc(50% - 10px)',
  }),
}));

export default function TeamMatchingPage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchBarVisible, setSearchBarVisible] = useState(true);
  const classes = useStyles({ isMobile });


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const sampleData = [
    {
        teamName: 'Team Alpha',
        intro: "Intro of Team Alpha...",
        lookingFor: 'We are looking for a full-stack developer.',
        recruit_info: "Recruitment info for Team Alpha...",
        tags: ['Full-stack', 'React', 'Python'],
        status: "open",
      },
      {
        teamName: 'Team Alpha',
        intro: "Intro of Team Alpha...",
        lookingFor: 'We are looking for a full-stack developer.',
        recruit_info: "Recruitment info for Team Alpha...",
        tags: ['Full-stack', 'React', 'Python'],
        status: "open",
      },
      {
          teamName: 'Team Alpha',
          intro: "Intro of Team Alpha...",
          lookingFor: 'We are looking for a full-stack developer.',
          recruit_info: "Recruitment info for Team Alpha...",
          tags: ['Full-stack', 'React', 'Python'],
          status: "open",
        },
        {
        teamName: 'Team Alpha',
        intro: "Intro of Team Alpha...",
        lookingFor: 'We are looking for a full-stack developer',
        recruit_info: "Recruitment info for Team Alpha....We are looking for a full-stack developer.We are looking for a full-stack developer.We are looking for a full-stack developer.We are looking for a full-stack developer.",
        tags: ['Full-stack', 'React', 'Python'],
        status: "open",
      },
      {
        teamName: 'Team Alpha',
        intro: "Intro of Team Alpha...",
        lookingFor: 'We are looking for a full-stack developer',
        recruit_info: "Recruitment info for Team Alpha....We are looking for a full-stack developer.We are looking for a full-stack developer.We are looking for a full-stack developer.We are looking for a full-stack developer.",
        tags: ['Full-stack', 'React', 'Python'],
        status: "open",
      },
      {
        teamName: 'Team Alpha',
        intro: "Intro of Team Alpha...",
        lookingFor: 'We are looking for a full-stack developer.We are looking for a full-stack developer.We are looking for a full-stack developer.We are looking for a full-stack developer.We are looking for a full-stack developer.',
        recruit_info: "Recruitment info for Team Alpha...",
        tags: ['Full-stack', 'React', 'Python'],
        status: "open",
      },
  
  ];

  const [teams, setTeams] = useState(sampleData);

  useEffect(() => {
    // axios.get('https://your-api-url.com/api/teams')
    //     .then(response => {
    //         setTeams(response.data);
    //     })
    //     .catch(error => {
    //         console.error('There was an error!', error);
    //     });
  }, []);

  const teamRows = [];
  if(isMobile) {
    for(let i = 0; i < teams.length; i++) {
      teamRows.push(
        <Box className={classes.teamRow} key={i}>
          <Box className={classes.cardContainer}>
            <TeamCard {...teams[i]} isMobile={isMobile}/>
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
              <TeamCard {...teams[i + 1]} isMobile={isMobile}/>
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



