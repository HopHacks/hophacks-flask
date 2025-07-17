import React, { useEffect, useState } from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
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
} from '@mui/material';
import { OrganizerCard } from './OrganizerCard';
import { AlumniCard } from './AlumniCard';
import theme from './teamTheme';
// import useStyles from './TeamStyles';
import { nameToURL, filterTeamMembers, sortAlumni } from './teamHelpers';
import '../../stylesheets/team.css';
import SubteamPhoto from './SubteamPhoto';

export default function TeamPage() {
  // const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);
  const [teams, setTeams] = useState([]);
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
      .then((data) => {
        const teamsArr = [
          {
            name: 'All',
            defaultRole: '',
            members: []
          }
        ];

        const facultyArr = [];

        for (const team of data.teams) {
          for (const member of team.members) {
            if (!('role' in member)) {
              member.role = team.defaultRole;
            }
            // Add member to 'All', but put faculty at the end (sorry, faculty)
            if (member.role === 'Faculty Advisor') {
              facultyArr.push(member);
            } else {
              teamsArr[0].members.push(member);
            }
          }
          teamsArr.push(team);
        }
        teamsArr[0].members.push(...facultyArr);
        setTeams(teamsArr);
      })
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
  const currentTeam = teams[tabIndex];
  const filteredTeams = currentTeam?.members
    ? filterTeamMembers(currentTeam.members, searchQuery)
    : [];

  // Filter and sort alumni
  const filteredAlumni = alumni ? filterTeamMembers(alumni, searchQuery) : [];
  const sortedAlumni = sortAlumni(filteredAlumni, sortOrder);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div className="flex flex-col justify-center items-center">
          {/* Header */}
          <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 10
          }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                paddingBottom: 0.5
              }}
            >
              Our Team
            </Typography>
            <Typography sx={{
              color: 'white',
              paddingBottom: 3.5,
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}>
              Meet the team that organizes HopHacks
            </Typography>
          </Box>

          {/* Filters */}
          <Box sx={{
            display: 'flex',
            width: '90%',
            maxWidth: 700,
            gap: 2,
            padding: 2,
            alignItems: 'center'
          }}>
            <FormControl
              variant="outlined"
              sx={{
                backgroundColor: '#ffb51f',
                borderRadius: '16px',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              <Select
                variant="standard"
                value={view}
                onChange={(e) => setView(e.target.value)}
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  padding: 1
                }}
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left'
                  },
                  getContentAnchorEl: null
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
              sx={{
                minWidth: (theme) => theme.custom?.teamPage.textField.minWidth || 150,
                flexGrow: 1,
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                '& .MuiInputBase-root': {
                  backgroundColor: '#ffffff',
                  borderRadius: '16px'
                }
              }}
            />

            {view === 'Alumni' && (
              <FormControl
                variant="outlined"
                sx={{
                  backgroundColor: '#ffb51f',
                  borderRadius: '16px',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: 1
                }}
              >
                <Select
                  variant="standard"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  sx={{
                    color: 'white',
                    fontWeight: 600
                  }}
                  MenuProps={{
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left'
                    },
                    getContentAnchorEl: null
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
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              minWidth: '200px',
              width: '75%'
            }}>
              <Tabs
                value={tabIndex}
                onChange={(e, newIndex) => handleSetTabIndex(newIndex, true)}
                variant="scrollable"
                scrollButtons="auto"
                TabIndicatorProps={{ style: { display: 'none' } }}
              >
                {[
                  'All',
                  'Directors',
                  'Design',
                  'Logistics',
                  'Marketing',
                  'Sponsors',
                  'Website'
                ].map((label) => (
                  <Tab
                    key={label}
                    label={label}
                    sx={{
                      borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                      transition: 'border-color 0.3s ease',
                      fontWeight: 500,
                      fontSize: '.8rem',
                      color: '#ffffff',
                      minWidth: 80,
                      padding: '6px 12px',
                      '&.Mui-selected': {
                        borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
                        color: '#ffffff'
                      }
                    }}
                  />
                ))}
              </Tabs>
            </Box>
          )}

          {/* Team/Alumni Cards */}
          <Container sx={{
            height: 'fit-content',
            minHeight: (theme) => theme.custom?.teamPage.container.minHeight || '404px',
            margin: '16px auto',
            padding: '16px'
          }}>
            <Grid
              container
              spacing={2}
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              {view === 'Current Organizers' && currentTeam && (
                <div className="w-full flex items-center justify-center py-3">
                  <SubteamPhoto teamName={currentTeam.name} />
                </div>
              )}
              {view === 'Current Organizers' &&
                currentTeam &&
                filteredTeams.map((member) => (
                  <Grid item key={member.name}>
                    {member.role === 'Faculty Advisor' ? (
                      <AlumniCard
                        name={member.name}
                        position={member.role ?? 'Alumnus'}
                        year={0}
                        image={nameToURL(member.name)}
                      />
                    ) : (
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
                    )}
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
    </StyledEngineProvider>
  );
}
