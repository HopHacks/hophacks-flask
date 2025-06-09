import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  TextField,
  IconButton,
  Select,
  MenuItem,
  Typography,
  InputLabel,
  FormControl,
  Box,
  InputAdornment
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import SearchIcon from '@material-ui/icons/Search';
import TeamCard from './TeamCard';
import '../../stylesheets/teammatch.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import { withAuthCheck } from '../../util/auth.jsx';

const useStyles = makeStyles(() => ({
  container: {
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2% 0',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  title: (props) => ({
    fontFamily: 'Proxima Nova',
    color: '#F3F6FB',
    fontSize: props.isMobile ? '24px' : '48px',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: '1em',
    marginTop: props.isMobile ? '3em' : '0', // Add marginTop here
    marginLeft: '5%'
  }),
  appBar: (props) => ({
    backgroundColor: props.isMobile ? 'transparent' : '#F3F6FB',
    boxShadow: props.isMobile ? 'none' : undefined,
    marginBottom: '2em',
    padding: '1em',
    width: props.isMobile ? '90vw' : '75vw'
  }),
  searchBar: (props) => ({
    backgroundColor: props.isMobile ? 'transparent' : '#F3F6FB',
    marginBottom: '2em',
    padding: '1em',
    width: props.isMobile ? '90vw' : '75vw',
    alignSelf: props.isMobile ? 'center' : 'auto',
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px 20px 0 20px',
      backgroundColor: 'rgba(219, 226, 237, 0.5)',
      '& fieldset': {
        borderColor: props.isMobile ? 'transparent' : 'default'
      },
      '&:hover fieldset': {
        borderColor: props.isMobile ? 'transparent' : 'default'
      },
      '&.Mui-focused fieldset': {
        borderColor: props.isMobile ? 'transparent' : 'default'
      }
    },
    '& .MuiOutlinedInput-input': props.isMobile
      ? {
          height: '2em',
          padding: '10px 14px',
          color: 'black' // set the text color here
        }
      : {}
  }),
  postButton: {
    marginLeft: '1em',
    backgroundColor: 'rgba(219, 226, 237, 0.5)',
    borderRadius: '20px 20px 0 20px',
    color: 'black',
    '&:hover': {
      backgroundColor: 'rgba(219, 226, 237, 0.7)'
    }
  },
  formControl: (props) => ({
    marginLeft: '1em',
    minWidth: 120,
    width: props.isMobile ? '45%' : 'auto',
    flex: props.isMobile ? 1 : 0.5,
    alignSelf: props.isMobile ? 'center' : 'auto',
    backgroundColor: 'rgba(219, 226, 237, 0.5)',
    borderRadius: '20px 20px 0 20px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px 20px 0 20px',
      '& fieldset': {
        borderColor: props.isMobile ? 'transparent' : 'default'
      },
      '&:hover fieldset': {
        borderColor: props.isMobile ? 'transparent' : 'default'
      },
      '&.Mui-focused fieldset': {
        borderColor: props.isMobile ? 'transparent' : 'default'
      }
    },
    '& .MuiOutlinedInput-input': props.isMobile
      ? {
          height: '2em',
          padding: '10px 10px',
          color: 'black',
          textAlign: 'center' // centering the text
        }
      : {},
    justifySelf: 'center',
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': props.isMobile
      ? {
          transform: 'translate(12px, -5px) scale(0.75)' // adjusting label positioning
        }
      : {},
    '& .MuiSelect-icon': props.isMobile
      ? {
          color: 'black',
          top: 'calc(50% - 10px)' // centering the dropdown icon
        }
      : {}
  }),
  teamsContainer: (props) => ({
    display: 'flex',
    flexDirection: 'column',
    width: props.isMobile ? '90vw' : '75vw'
  }),
  dialogContainer: {
    backgroundColor: 'rgba(53, 2, 37, 0.8)',
    borderRadius: '40px 40px 0 40px',
    padding: '2em',
    boxSizing: 'border-box',
    minWidth: '300px',
    width: '80vw',
    height: '80vh'
  },
  dialogTitle: {
    fontFamily: 'Proxima Nova',
    fontWeight: 'bold',
    fontSize: (props) => (props.isMobile ? '48px' : '32px'),
    color: '#FFFFFF'
  },
  dialogTagInput: {
    color: '#FFFFFF',
    borderColor: 'white',
    '& label.Mui-focused': {
      color: 'white'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white'
      },
      '&:hover fieldset': {
        borderColor: 'white'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white'
      }
    }
  },
  addTagButton: {
    color: '#FFFFFF', // This ensures the text color is white
    backgroundColor: 'transparent',
    border: '1px solid #FFFFFF', // This makes the border white
    borderRadius: '8px',
    padding: '0.5em 1em',
    marginLeft: '1em',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }
  },
  tag: {
    backgroundColor: '#CC6BA3',
    color: '#FFFFFF',
    borderRadius: '8px',
    padding: '0.5em',
    marginTop: '1em',
    display: 'inline-block',
    marginRight: '0.5em'
  },

  dialogInputLabel: {
    color: 'white !important', // Default state
    '&.Mui-focused': {
      color: 'white !important' // Focused state
    },
    fontSize: (props) => (props.isMobile ? '10px' : '20px')
  },
  dialogTextField: {
    '& label.MuiInputLabel-outlined': {
      color: 'white'
    },
    '& label.MuiInputLabel-outlined.Mui-focused': {
      color: 'white'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white'
    },
    '& label.Mui-focused': {
      color: 'white'
    },
    '& .MuiInputLabel-shrink': {
      color: 'white'
    },
    '& label.MuiInputLabel-shrink': {
      color: 'white !important'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white'
      },
      '&:hover fieldset': {
        borderColor: 'white'
      },
      '&.Mui-focused fieldset': {
        color: 'white'
      }
    },
    color: '#FFFFFF',
    fontFamily: 'Proxima Nova',
    fontSize: (props) => (props.isMobile ? '16px' : '20px')
  },
  cancelButton: {
    fontFamily: 'Proxima Nova',
    fontSize: (props) => (props.isMobile ? '18px' : '26px'),
    color: '#FFFFFF',
    backgroundColor: '#CC6BA3',
    borderRadius: '8px',
    padding: '0.5em',
    margin: '0.5em',
    '&:hover': {
      backgroundColor: 'white',
      color: 'rgba(53, 2, 37, 0.8)'
    }
  },
  submitButton: {
    fontFamily: 'Proxima Nova',
    fontSize: (props) => (props.isMobile ? '18px' : '26px'),
    color: '#FFFFFF',
    backgroundColor: 'green',
    borderRadius: '8px',
    padding: '0.5em',
    margin: '0.5em',
    '&:hover': {
      backgroundColor: 'white',
      color: 'rgba(53, 2, 37, 0.8)'
    }
  },
  teamRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },
  cardContainer: (props) => ({
    width: props.isMobile ? '100%' : 'calc(50% - 10px)'
  })
}));

function TeamMatchingPage(props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const classes = useStyles({ isMobile });
  const [teamTitle, setTeamTitle] = useState('');
  const [teamIntro, setTeamIntro] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [open, setOpen] = useState(false);
  const [tagInput, setTagInput] = useState(''); // for the tag input field
  const [tags, setTags] = useState([]); // for the list of tags
  const [filteredTeams, setFilteredTeams] = useState([]);

  const myVariable = process.env.REACT_APP_BACKENDURL;

  if (myVariable != '') {
    axios.defaults.baseURL = myVariable;
  }

  const handleSortChange = (event) => {
    const sortType = event.target.value;
    const sortedTeams = [...teams]; // Create a copy of originalTeams to sort

    if (sortType === 'az') {
      sortedTeams.sort((a, b) => a.teamTitle.localeCompare(b.teamTitle));
    } else {
      sortedTeams.sort((a, b) => b.teamTitle.localeCompare(a.teamTitle));
    }

    setFilteredTeams(sortedTeams);
  };

  const handleFilterChange = (event) => {
    const filterType = event.target.value;

    if (filterType !== 'all') {
      setFilteredTeams(teams.filter((team) => team.status === filterType));
    } else {
      setFilteredTeams(teams); // Reset to show all teams
    }
  };

  const handleTagInputKeyDown = (event) => {
    if (event.key === 'Enter' && tagInput.trim() !== '') {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const addTag = () => {
    if (tagInput.trim() !== '') {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const teamData = {
      teamTitle: teamTitle,
      teamIntro: teamIntro,
      lookingFor: lookingFor,
      tags: tags,
      status: 'open'
    };
    console.log(teamData);
    try {
      // The URL of your Flask endpoint
      const url = '/api/teammatch/';

      const response = await axios.post(url, teamData);

      if (response.status === 201) {
        console.log('Team created successfully', response.data);
      } else {
        console.error('Error creating team', response.data);
      }
    } catch (error) {
      console.error('Error creating team', error.response ? error.response.data : error.message);
    }
    window.location.reload();
    handleClose();
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [teams, setTeams] = useState();

  useEffect(() => {
    axios
      .get('/api/teammatch/')
      .then((response) => {
        setTeams(response.data);
        setFilteredTeams(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  }, []);

  const teamRows = [];
  if (isMobile && filteredTeams) {
    for (let i = 0; i < filteredTeams.length; i++) {
      teamRows.push(
        <Box className={classes.teamRow} key={i}>
          <Box className={classes.cardContainer}>
            <TeamCard {...filteredTeams[i]} isMobile={isMobile} />
          </Box>
        </Box>
      );
    }
  } else if (!isMobile && filteredTeams) {
    for (let i = 0; i < filteredTeams.length; i += 2) {
      teamRows.push(
        <Box className={classes.teamRow} key={i}>
          <Box className={classes.cardContainer}>
            <TeamCard {...filteredTeams[i]} />
          </Box>
          {teams[i + 1] && (
            <Box className={classes.cardContainer}>
              <TeamCard {...filteredTeams[i + 1]} isMobile={isMobile} />
            </Box>
          )}
        </Box>
      );
    }
  }

  return (
    <Box className={classes.container}>
      <Typography className={classes.title}>Find Your Team(mates)!</Typography>
      {!props.isLoggedIn ? (
        // All the components and layout for logged-in users
        <>
          <Typography className={classes.title}>Please login first</Typography>
        </>
      ) : (
        <>
          <AppBar position="static" className={classes.appBar}>
            {!isMobile && (
              <Toolbar style={{ flexDirection: isMobile ? 'column' : 'row' }}>
                <TextField
                  className={classes.searchBar}
                  label="Search"
                  variant="outlined"
                  fullWidth
                  style={{ marginBottom: isMobile ? '1em' : '0', flex: isMobile ? 'auto' : 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'flex-start',
                    alignItems: 'center', // align items in the center
                    flex: isMobile ? 'auto' : 1,
                    flexWrap: 'nowrap' // Add this property to prevent wrapping
                  }}
                >
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel>Sort</InputLabel>
                    <Select onChange={handleSortChange}>
                      <MenuItem value="az">A-Z</MenuItem>
                      <MenuItem value="za">Z-A</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel>Status</InputLabel>
                    <Select onChange={handleFilterChange}>
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="open">Open</MenuItem>
                      <MenuItem value="closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                  <Button onClick={handleOpen} className={classes.postButton}>
                    Create Post
                  </Button>{' '}
                  {/* Add the button here */}
                </div>
              </Toolbar>
            )}
            {isMobile && (
              <Toolbar style={{ flexDirection: isMobile ? 'column' : 'row' }}>
                <TextField
                  className={classes.searchBar}
                  label="Search"
                  variant="outlined"
                  fullWidth
                  style={{ marginBottom: isMobile ? '1em' : '0', flex: isMobile ? 'auto' : 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'flex-start',
                    alignItems: 'center', // align items in the center
                    flex: isMobile ? 'auto' : 1,
                    flexWrap: 'nowrap' // Add this property to prevent wrapping
                  }}
                >
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel>Sort</InputLabel>
                    <Select onChange={handleSortChange}>
                      <MenuItem value="az">A-Z</MenuItem>
                      <MenuItem value="za">Z-A</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel>Status</InputLabel>
                    <Select onChange={handleFilterChange}>
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="open">Open</MenuItem>
                      <MenuItem value="closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <Button onClick={handleOpen} className={classes.postButton}>
                    Create Post
                  </Button>
                </div>
              </Toolbar>
            )}
          </AppBar>

          <Box className={classes.teamsContainer}>{teamRows}</Box>
          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              className: classes.dialogContainer
            }}
          >
            <DialogTitle className={classes.dialogTitle}>Post Your Team Card</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Team Name"
                type="text"
                fullWidth
                value={teamTitle}
                onChange={(e) => setTeamTitle(e.target.value)}
                InputProps={{
                  className: classes.dialogTextField
                }}
                InputLabelProps={{
                  className: classes.dialogInputLabel
                }}
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Team Introduction"
                type="text"
                fullWidth
                value={teamIntro}
                onChange={(e) => setTeamIntro(e.target.value)}
                InputProps={{
                  className: classes.dialogTextField
                }}
                InputLabelProps={{
                  className: classes.dialogInputLabel
                }}
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Looking For"
                type="text"
                fullWidth
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                InputProps={{
                  className: classes.dialogTextField
                }}
                InputLabelProps={{
                  className: classes.dialogInputLabel
                }}
              />

              {/* Tags Input */}
              <div
                style={{ display: 'flex', alignItems: 'center', marginTop: '1em', width: '100%' }}
              >
                <TextField
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  className={classes.dialogTagInput}
                  placeholder="Enter a tag and press Enter"
                  InputProps={{
                    className: classes.dialogTextField
                  }}
                  InputLabelProps={{
                    className: classes.dialogInputLabel
                  }}
                  style={{ width: '90%', marginRight: '1%' }}
                />
                <IconButton size="small" className={classes.addTagButton} onClick={addTag}>
                  <AddIcon />
                </IconButton>
              </div>

              {/* Display the tags */}
              <div>
                {tags.map((tag, index) => (
                  <span key={index} className={classes.tag}>
                    {tag}
                    <IconButton
                      size="small"
                      className={classes.tagCloseIcon}
                      onClick={() => removeTag(index)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </span>
                ))}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} className={classes.cancelButton}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className={classes.submitButton}>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}

export default withAuthCheck(TeamMatchingPage);
