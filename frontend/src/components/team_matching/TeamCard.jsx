import React from 'react';
import { Card, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: '#F3F6FB',
    padding: '3em',
    borderRadius: '10px',
    marginBottom: '2em',
    boxSizing: 'border-box',
    width: '100%',
    minWidth: '300px',
  },
  title: (props) => ({
    fontFamily: 'Proxima Nova',
    fontWeight: 'bold',
    fontSize: props.isMobile ? '24px' : '32px',
    color: '#122f4c',
    marginBottom: '1em',
    textAlign: 'center',
  }),
  content: (props) => ({
    fontFamily: 'Proxima Nova',
    fontSize: props.isMobile ? '18px' : '28px',
    color: '#122f4c',
    marginBottom: '1em',
    textAlign: 'center',
  }),
  tag: {
    backgroundColor: '#B4E3F7',
    color: '#122f4c',
    borderRadius: '8px',
    padding: '0.5em',
    marginTop: '1em',
    display: 'inline-block',
    marginRight: '0.5em',
  },
  statusOpen: {
    backgroundColor: 'green',
    color: '#FFFFFF',
    borderRadius: '8px',
    padding: '0.5em',
    marginTop: '1em',
    display: 'inline-block',
    marginRight: '0.5em',
  },
  statusClosed: {
    backgroundColor: 'red',
    color: '#FFFFFF',
    borderRadius: '8px',
    padding: '0.5em',
    marginTop: '1em',
    display: 'inline-block',
    marginRight: '0.5em',
  },
}));

export default function TeamCard({ teamName, intro, lookingFor, recruit_info, tags, isMobile, status }) {
  const classes = useStyles({ isMobile });

  return (
    <Card className={classes.card}>
      <Typography className={classes.title}>{teamName}</Typography>
      <Typography className={classes.content}>{intro}</Typography>
      <Typography className={classes.title}>{lookingFor}</Typography>
      <Typography className={classes.content}>{recruit_info}</Typography>
      {tags.map((tag, index) => (
        <Box key={index} className={classes.tag}>{tag}</Box>
      ))}
      <Box className={status === 'open' ? classes.statusOpen : classes.statusClosed}>{status}</Box>
    </Card>
  );
}





