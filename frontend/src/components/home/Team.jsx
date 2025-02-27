import { ThemeProvider, makeStyles } from '@material-ui/styles';
import { OrganizerCard } from './team/OrganizerCard';
import { AlumniCard } from './team/AlumniCard';
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
  Box,
  createMuiTheme
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import '../../stylesheets/team.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#e1f5fe' // Gray for primary elements
    },
    text: {
      primary: '#333333', // Dark gray for main text
      secondary: '#81d4fa' // Lighter gray for secondary text
    },
    background: {
      default: '#f5f5f5', // Light gray background
      paper: '#ffffff' // White for cards
    }
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#808080', // Default text color (gray)
          backgroundColor: 'transparent', // Transparent background
          '&.Mui-selected': {
            color: '#333333' // Darker gray when selected
          }
        }
      }
    },
    MuiTabScrollButton: {
      styleOverrides: {
        root: {
          color: '#808080', // Gray for scroll buttons
          '&.Mui-disabled': {
            color: '#cccccc' // Light gray for disabled buttons
          }
        }
      }
    }
  }
});

const useStyles = makeStyles((theme) => ({
  dropdownContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(2),
    maxWidth: '900px',
    flexWrap: 'wrap',
    gap: theme.spacing(2)
  },
  textField: {
    minWidth: 150,
    '& .MuiOutlinedInput-root': {
      borderRadius: '30px'
    }
  },
  formControl: {
    minWidth: 200,
    marginRight: theme.spacing(2)
  },
  container: {
    height: 'fit-content',
    minHeight: '404px',
    margin: '16px auto',
    padding: '16px'
  }
}));

function nameToURL(name) {
  const processedName = name.replaceAll(' ', '+');
  return 'https://hophacks-organizers.s3.us-east-1.amazonaws.com/' + processedName + '.jpg';
}

export default function TeamPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [teams, setTeams] = useState({});
  const [alumni, setAlumni] = useState([]);
  const [view, setView] = useState('Current Organizers'); // Dropdown selection
  const [searchQuery, setSearchQuery] = useState(''); // Search bar input
  const [sortOrder, setSortOrder] = useState('desc');
  const classes = useStyles();

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

  useEffect(() => {
    if (view === 'Current Organizers') {
      let matchingTabIndex = tabIndex; // Default to current tabIndex

      // Check if there are matches in the current tab
      let matchesInCurrentTab =
        teams[tabIndex]?.members.filter(
          (member) =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.role?.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [];

      // If no matches in current tab, search other tabs
      if (matchesInCurrentTab.length === 0 && searchQuery) {
        for (let i = 0; i < Object.keys(teams).length; i++) {
          if (i !== tabIndex) {
            const matchesInOtherTab = teams[i]?.members.filter(
              (member) =>
                member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.role?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (matchesInOtherTab && matchesInOtherTab.length > 0) {
              matchingTabIndex = i; // Update to the tab with matches
              break;
            }
          }
        }
      }

      // Switch to the tab with matches if it's different from the current tabIndex
      if (matchingTabIndex !== tabIndex) {
        setTabIndex(matchingTabIndex);
      }
    }
  }, [searchQuery, teams, tabIndex, view]);

  const handleSetTabIndex = (newIndex, clear) => {
    if (clear) {
      setSearchQuery('');
    }
    setTabIndex(newIndex);
  };

  const filteredTeams = teams[tabIndex]?.members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAlumni = [...alumni]
    .filter(
      (member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (sortOrder === 'asc' ? a.year - b.year : b.year - a.year));

  return (
    <ThemeProvider theme={theme}>
      <div className="flex flex-col items-center min-h-screen bg-[#172759]">
        <div className="w-full flex flex-col items-center pt-20">
          <Typography variant="h3" className="pb-1 text-[#e1f5fe]" style={{ fontWeight: 'bold' }}>
            Our team
          </Typography>
          <Typography className="pb-7 text-[#e1f5fe]">
            Meet the team that organizes HopHacks
          </Typography>
        </div>

        {/* Dropdown and Search Bar */}
        <Box className={classes.dropdownContainer}>
          <FormControl className={classes.formControl}>
            <Select value={view} onChange={(e) => setView(e.target.value)}>
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
          />
          {view == 'Alumni' && (
            <FormControl className={classes.formControl} disabled={view !== 'Alumni'}>
              <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <MenuItem value="asc">Year (Ascending)</MenuItem>
                <MenuItem value="desc">Year (Descending)</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>

        {/* Tabs */}
        {view === 'Current Organizers' && (
          <Box className="flex justify-center w-full">
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

        <Container className={classes.container}>
          {/* Cards */}
          <Grid container spacing={2} className="flex justify-center">
            {view === 'Current Organizers' &&
              filteredTeams &&
              filteredTeams.map((member) => (
                <Grid item key={member.name}>
                  <OrganizerCard
                    key={member.name}
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
              filteredAlumni.map((member) => (
                <Grid item key={member.name}>
                  <AlumniCard
                    key={member.name}
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
