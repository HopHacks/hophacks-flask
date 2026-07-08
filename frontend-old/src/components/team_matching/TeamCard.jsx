import React from 'react';
import { Card, Typography, Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';

const useStyles = makeStyles(() => ({
  card: {
    backgroundColor: 'rgba(53, 2, 37, 0.8)',
    padding: '3em',
    borderRadius: '40px 40px 0 40px',
    marginBottom: '2em',
    boxSizing: 'border-box',
    width: '100%',
    minWidth: '300px',
    position: 'relative'
  },
  title: (props) => ({
    fontFamily: 'Proxima Nova',
    fontWeight: 'bold',
    fontSize: props.isMobile ? '24px' : '32px',
    marginBottom: '1em',
    color: '#FFFFFF'
  }),
  content: (props) => ({
    fontFamily: 'Proxima Nova',
    fontSize: props.isMobile ? '18px' : '26px',
    marginBottom: '2em',
    color: '#FFFFFF'
  }),
  tag: {
    backgroundColor: '#CC6BA3',
    color: '#FFFFFF',
    borderRadius: '8px',
    padding: '0.5em',
    marginTop: '1em',
    display: 'inline-block',
    marginRight: '0.5em'
  },
  statusOpen: {
    backgroundColor: 'green',
    color: '#FFFFFF',
    borderRadius: '8px',
    padding: '0.5em',
    marginTop: '1em',
    display: 'inline-block',
    marginRight: '0.5em'
  },
  statusClosed: {
    backgroundColor: 'red',
    color: '#FFFFFF',
    borderRadius: '8px',
    padding: '0.5em',
    marginTop: '1em',
    display: 'inline-block',
    marginRight: '0.5em'
  },
  actionButtonContainer: {
    position: 'absolute', // Absolute positioning
    bottom: '1em', // From the bottom of the card
    right: '1em', // From the right of the card
    display: 'flex' // Displaying the buttons in a row
  },
  actionButton: {
    marginLeft: '0.5em' // Space between the buttons
  },
  openButton: {
    backgroundColor: '#00ff00', // green color
    color: '#FFFFFF', // text color set to white
    '&:hover': {
      backgroundColor: '#00cc00' // slightly darker green for hover
    }
  },

  closeButton: {
    backgroundColor: '#ff0000', // red color
    color: '#FFFFFF', // text color set to white
    '&:hover': {
      backgroundColor: '#cc0000' // slightly darker red for hover
    }
  }
}));

export default function TeamCard({
  teamTitle,
  teamIntro,
  lookingFor,
  tags,
  isMobile,
  status,
  is_owned,
  id
}) {
  const classes = useStyles({ isMobile });

  const myVariable = process.env.REACT_APP_BACKENDURL;

  if (myVariable != '') {
    axios.defaults.baseURL = myVariable;
  }

  const handleOpenClose = async () => {
    try {
      // Determine the new status based on the current status
      const newStatus = status === 'open' ? 'closed' : 'open';

      // Make a PUT request to the update endpoint
      const response = await axios.put(`/api/teammatch/${id}`, {
        status: newStatus
      });

      console.log(response.data); // Process the response if needed
      // Update your component state or execute other logic after successful update
    } catch (error) {
      console.error('Error updating team match status:', error);
      // Handle the error appropriately, maybe set an error state in your component or show a notification
    }
    console.log('Updating post status');
    window.location.reload();
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/teammatch/${id}`);
      console.log(response.data); // Process the response if needed
      // Update your component state or execute other logic after successful deletion
    } catch (error) {
      console.error('Error deleting team match:', error);
      // Handle the error appropriately, maybe set an error state in your component or show a notification
    }
    console.log('Deleting post');
    window.location.reload();
  };

  return (
    <Card className={classes.card}>
      <Typography className={classes.title}>{teamTitle}</Typography>
      <Typography className={classes.content}>{teamIntro}</Typography>
      <Typography className={classes.title}>Looking For:</Typography>
      <Typography className={classes.content}>{lookingFor}</Typography>

      {tags.map((tag, index) => (
        <Box key={index} className={classes.tag}>
          {tag}
        </Box>
      ))}

      <Box className={status === 'open' ? classes.statusOpen : classes.statusClosed}>{status}</Box>

      {is_owned && (
        <Box className={classes.actionButtonContainer}>
          <Button
            variant="contained"
            className={status === 'open' ? classes.closeButton : classes.openButton}
            onClick={handleOpenClose}
          >
            {status === 'open' ? 'Close Post' : 'Open Post'}
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleDelete}
            className={classes.actionButton}
          >
            Delete
          </Button>
        </Box>
      )}
    </Card>
  );
}
