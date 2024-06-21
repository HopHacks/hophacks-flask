import React from 'react';
import Grid from '@material-ui/core/Grid';
import Team from './home/Team';
import '../stylesheets/team.css';

export default function TeamPage() {
  const team = (
    <Grid
      container
      spacing={3}
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '30.5rem' }}
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
    <div
      style={{
        // backgroundImage: `url("https://hophacks-website.s3.amazonaws.com/images/cover.png")`,
        backgroundSize: 'cover',
        minHeight: '100vh'
        // backgroundColor: '#172759'
      }}
    >
      <div className="container">
        <div className="team-register-wrapper">{team}</div>
      </div>
    </div>
  );
}
