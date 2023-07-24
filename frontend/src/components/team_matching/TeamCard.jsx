import React from 'react';
import { Card, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  card: {
    backgroundColor: 'rgba(53, 2, 37, 0.8)',
    padding: '3em',
    borderRadius: '40px 40px 0 40px',
    marginBottom: '2em',
    boxSizing: 'border-box',
    width: '100%',
    minWidth: '300px'
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
  }
}));

export default function TeamCard({
  teamTitle,
  contentOne,
  lookingFor,
  contentTwo,
  tags,
  isMobile,
  status
}) {
  const classes = useStyles({ isMobile });

  return (
    <Card className={classes.card}>
      <Typography className={classes.title}>{teamTitle}</Typography>
      <Typography className={classes.content}>{contentOne}</Typography>
      <Typography className={classes.title}>{lookingFor}</Typography>
      <Typography className={classes.content}>{contentTwo}</Typography>
      {tags.map((tag, index) => (
        <Box key={index} className={classes.tag}>
          {tag}
        </Box>
      ))}
      <Box className={status === 'open' ? classes.statusOpen : classes.statusClosed}>{status}</Box>
    </Card>
  );
}
