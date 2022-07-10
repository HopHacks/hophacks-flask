import React, { useState } from "react";
// import axios from "axios";
// import MenuItem from '@material-ui/core/MenuItem';
// import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Team from './home/Team';

import '../stylesheets/team.css';

export default function TeamPage() {

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
      fontSize: 'min(max(calc(6px + 1.25vw), 3vw), 25px)',
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
    label: {
      backgroundColor: 'rgb(232, 235, 242)',
    }
  }));

  const classes = useStyles();

  const account = (
    <Grid
      container
      spacing={4}
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '35rem' }}
    >
      <Grid item xs={0} md={1} lg={1} />
      <Grid id="register" item xs={12} align="center">
        <Grid container>
          <Team />
        </Grid>
      </Grid>
      <Grid item xs={0} md={1} lg={1} />
    </Grid>
  );

  return (
    <div style={{
      backgroundImage: `url("${process.env.PUBLIC_URL}/images/2022_theme.png")`,
      backgroundSize: 'cover',
      height: "100vh"
    }}>
      <div class="container">
        <div className="register-wrapper">
          {account}
        </div>
      </div>
    </div>
  )
}
