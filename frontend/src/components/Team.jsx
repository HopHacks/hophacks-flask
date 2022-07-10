import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
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

  const team = (
    <Grid
      container
      spacing={4}
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '37.5rem' }}
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
      backgroundImage: `url("${process.env.PUBLIC_URL}/images/team-page.png")`,
      backgroundSize: 'cover',
      minHeight: "100vh"
    }}>
      <div class="container">
        <div className="register-wrapper">
          {team}
        </div>
      </div>
    </div>
  )
}
