import React from "react";

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pagination from '@material-ui/lab/Pagination';
import Paper from '@material-ui/core/Paper';

import axios from "axios";

import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect, useQuery } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useLocation } from 'react-router-dom'

const useStyles = makeStyles({

  margin: {
    marginBottom: "13px",
  },

  color: {
    backgroundColor: "#d1e9ff",
  },

  bodycolor: {

  },

  // title: {
  //   color: "#7289da",
  //   fontFamily: "VCR OSD Mono",
  // },

  picture: {
    height: '300px',
  },

  card: {
    marginLeft: '22.5%',
    maxWidth: '55%',
    padding: 12,
  },
});

export default function AnnouncementDetails(props) {
  const classes = useStyles();
  const location = useLocation()
  const announcement = location.state;

  const title = announcement.title;
  const time = announcement.created_time.substring(0, 10);
  const content = announcement.content;

  function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
  }

  return (
    <Box py={2}>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} variant="h4" gutterBottom>
            {title}
          </Typography>
          <Typography>
            {time}
          </Typography>
          <Typography variant="h6">
            <br/>
            {content}
            <br/><br/>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
