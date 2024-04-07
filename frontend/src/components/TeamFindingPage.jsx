import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';

const useStyles = makeStyles({
    margin: {
      marginBottom: '20px'
    },
    title: {
      color: '#000000',
      fontFamily: 'PT Sans'
    },
    button: {
      color: '#841584'
    },
    btn_text: {
      color: '#ffffff'
    }
  });

export default function TeamFindingPage() {
  const classes = useStyles();
  const title = (
    <Typography
      className={classes.title}
      variant="h3"
      gutterBottom
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}
    >
      <h2>browse for teams:</h2>
    </Typography>
  );
  const teamHolder = (
    <Button
      variant="contained"
      style={{ height: '280px', width: '220px', backgroundColor: '#0047AB' }}
    >
      <Grid
          container
          spacing={0}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Grid item md = {8}>
            <Typography variant='h5'>
              Team Name
            </Typography>
          </Grid>
        <Grid item md = {8}>Description Description Description Description</Grid>
      </Grid>  
      
    </Button>
  );
    return (
      <div>
        <div>
            {title}
        </div>
        <Grid
          container
          spacing={1}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Grid item xs={3} md={3}>
              {teamHolder}
          </Grid>
          <Grid item xs={3} md={3}>
              {teamHolder}
          </Grid>
          <Grid item xs={3} md={3}>
              {teamHolder}
          </Grid>
          <Grid item xs={3} md={3}>
              {teamHolder}
          </Grid>
          <Grid item xs={3} md={3}>
              {teamHolder}
          </Grid>
          <Grid item xs={3} md={3}>
              {teamHolder}
          </Grid>
          <Grid item xs={3} md={3}>
              {teamHolder}
          </Grid>
          <Grid item xs={3} md={3}>
              {teamHolder}
        </Grid>
        </Grid>
      </div>
        
      );
};
