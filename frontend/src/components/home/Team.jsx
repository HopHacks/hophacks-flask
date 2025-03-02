import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import {
  Tab,
  Tabs,
  Typography,
  MenuItem,
  Select,
  FormControl,
  TextField,
  Grid,
  Container,
  Box
} from '@material-ui/core';
import { OrganizerCard } from './team/OrganizerCard';
import { AlumniCard } from './team/AlumniCard';
import theme from './team/teamTheme';
import useStyles from './team/TeamStyles';
import { nameToURL, filterTeamMembers, sortAlumni } from './team/teamHelpers';
import '../../stylesheets/team.css';

export default function TeamPage() {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);
  const [teams, setTeams] = useState({});
  const [alumni, setAlumni] = useState([]);
  const [view, setView] = useState('Current Organizers');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch data
  useEffect(() => {
    fetch('/data/teams.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch organizers data');
        }
        return response.json();
      })
      .then((data) => setTeams(data.teams))
      .catch(() => console.error('Error fetching organizers'));

    fetch('/data/alumni.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch alumni data');
        }
        return response.json();
      })
      .then((data) => setAlumni(data.alumni))
      .catch(() => console.error('Error fetching alumni'));
  }, []);

  // Handle tab switching based on search
  useEffect(() => {
    if (view === 'Current Organizers' && searchQuery && teams[tabIndex]) {
      // Check if there are matches in current tab
      let matchesInCurrentTab = filterTeamMembers(teams[tabIndex].members, searchQuery);

      // If no matches in current tab, search other tabs
      if (matchesInCurrentTab.length === 0) {
        for (let i = 0; i < Object.keys(teams).length; i++) {
          if (i !== tabIndex && teams[i]) {
            const matchesInOtherTab = filterTeamMembers(teams[i].members, searchQuery);
            if (matchesInOtherTab.length > 0) {
              setTabIndex(i); // Switch to the tab with matches
              break;
            }
          }
        }
      }
    }
  }, [searchQuery, teams, tabIndex, view]);

  const handleSetTabIndex = (newIndex, clear) => {
    if (clear) {
      setSearchQuery('');
    }
    setTabIndex(newIndex);
  };

  // Filter teams based on search query
  const filteredTeams = teams[tabIndex]?.members
    ? filterTeamMembers(teams[tabIndex].members, searchQuery)
    : [];

  // Filter and sort alumni
  const filteredAlumni = alumni ? filterTeamMembers(alumni, searchQuery) : [];
  const sortedAlumni = sortAlumni(filteredAlumni, sortOrder);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        {/* Header */}
        <div className={classes.header}>
          <Typography variant="h3" className={classes.title}>
            Our team
          </Typography>
          <Typography className={classes.subtitle}>
            Meet the team that organizes HopHacks
          </Typography>
        </div>

        {/* Filters */}
        <Box className={classes.dropdownContainer}>
          <FormControl className={classes.formControl} variant="outlined">
            <Select
              value={view}
              onChange={(e) => setView(e.target.value)}
              MenuProps={{
                classes: { paper: classes.selectMenu },
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left'
                },
                getContentAnchorEl: null
              }}
              inputProps={{
                style: { color: '#e1f5fe' }
              }}
            >
              <MenuItem value="Current Organizers">Current Organizers</MenuItem>
              <MenuItem value="Alumni">Alumni</MenuItem>
            </Select>
          </FormControl>

          <TextField
            placeholder="I'm looking for..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={classes.textField}
            InputProps={{
              style: { color: '#e1f5fe' }
            }}
          />

          {view === 'Alumni' && (
            <FormControl className={classes.formControl} variant="outlined">
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                MenuProps={{
                  classes: { paper: classes.selectMenu },
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left'
                  },
                  getContentAnchorEl: null
                }}
                inputProps={{
                  style: { color: '#e1f5fe' }
                }}
              >
                <MenuItem value="asc">Year (Ascending)</MenuItem>
                <MenuItem value="desc">Year (Descending)</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>

        {/* Tabs */}
        {view === 'Current Organizers' && (
          <Box className={classes.tabsContainer}>
            <Tabs
              value={tabIndex}
              onChange={(e, newIndex) => handleSetTabIndex(newIndex, true)}
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Directors" />
              <Tab label="Design" />
              <Tab label="Logistics" />
              <Tab label="Marketing" />
              <Tab label="Sponsors" />
              <Tab label="Website" />
            </Tabs>
          </Box>
        )}

        {/* Team/Alumni Cards */}
        <Container className={classes.container}>
          <Grid container spacing={2} className={classes.gridContainer}>
            {view === 'Current Organizers' &&
              filteredTeams.map((member) => (
                <Grid item key={member.name}>
                  <OrganizerCard
                    name={member.name}
                    position={member.role ?? teams[tabIndex].defaultRole}
                    image={nameToURL(member.name)}
                    github={member.github ?? ''}
                    linkedin={member.linkedin ?? ''}
                    hometown={member.hometown ?? ''}
                    major_year={`${member.major}, ${member.year}`}
                    funfact={member.funFact ?? ''}
                  />
                </Grid>
              ))}

            {view === 'Alumni' &&
              sortedAlumni.map((member) => (
                <Grid item key={member.name}>
                  <AlumniCard
                    name={member.name}
                    position={member.role ?? 'Alumnus'}
                    image={member.image ?? 'default'}
                    github={member.github ?? ''}
                    linkedin={member.linkedin ?? ''}
                    year={member.year ?? ''}
                  />
                </Grid>
              ))}
          </Grid>
        </Container>
      </div>
    </ThemeProvider>
  );
}
