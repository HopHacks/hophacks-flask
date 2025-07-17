import React from 'react';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100vh'
  },
  navBar: {
    width: '10%',
    backgroundColor: '#333',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem 0',
    backgroundImage: 'url("https://hophacks-website.s3.amazonaws.com/images/tracks_nav.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'url("https://hophacks-website.s3.amazonaws.com/images/tracks_bg.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  list: {
    marginTop: '2.75rem'
  },
  listItem: {
    width: '7rem',
    height: '7rem',
    backgroundColor: 'rgba(0,0,0,0)',
    margin: '4rem 0',
    marginLeft: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  listItemText: {
    textAlign: 'center',
    color: 'white',
    fontSize: '0.8rem'
  }
});

const Tracks = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <nav className={classes.navBar}>
        <List className={classes.list}>
          <ListItem button className={classes.listItem}>
            <ListItemText primary="" classes={{ primary: classes.listItemText }} />
          </ListItem>
          <ListItem button className={classes.listItem}>
            <ListItemText primary="" classes={{ primary: classes.listItemText }} />
          </ListItem>
          <ListItem button className={classes.listItem}>
            <ListItemText primary="" classes={{ primary: classes.listItemText }} />
          </ListItem>
          <ListItem button className={classes.listItem}>
            <ListItemText primary="" classes={{ primary: classes.listItemText }} />
          </ListItem>
        </List>
      </nav>
      <Box className={classes.content}></Box>
    </div>
  );
};

export default Tracks;
