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

export default function Sponsors() {
    const classes = useStyles();
    const title = (
      <Typography
        className={classes.title}
        variant="h3"
        gutterBottom
        style={{
          display: 'flex',
          alignItems: 'left',
          justifyContent: 'left',
          height: '80%'
        }}
      >
        Sponsors
      </Typography>
    );

    const goldBox = {
        backgroundColor: ' #FFD700',
        width: '80px',
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '30px',
    };

    const gold = (
        <div style = {goldBox}>
            <Typography
                variant = "h4"
                style={{
                    display: 'inline-block', transform: 'rotate(270deg)'
                }}
            >
                GOLD
            </Typography>
        </div>
        
    );

    const sableBox = {
        backgroundColor: '#4f9e4c',
        width: '80px',
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '30px',
    };

    const sable = (
        <div style = {sableBox}>
            <Typography
                variant = "h4"
                style={{
                    display: 'inline-block', transform: 'rotate(270deg)'
                }}
            >
                SABLE
            </Typography>
        </div>
        
    );

    const blueBox = {
        backgroundColor: 'blue',
        width: '80px',
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '30px',
    };

    const blue = (
        <div style = {blueBox}>
            <Typography
                variant = "h4"
                style={{
                    display: 'inline-block', transform: 'rotate(270deg)'
                }}
            >
                BLUE
            </Typography>
        </div>
        
    );

    const starterBox = {
        backgroundColor: 'red',
        width: '80px',
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '30px',
    };

    const starter = (
        <div style = {starterBox}>
            <Typography
                variant = "h4"
                style={{
                    display: 'inline-block', transform: 'rotate(270deg)'
                }}
            >
                STARTER
            </Typography>
        </div>
        
    );

    const goldStyle = {
        border: '20px solid gold', width: '250px'
    };

    const goldSponsor = (
        <img src={'https://hophacks-image.s3.amazonaws.com/hop.png'} style={goldStyle}/>
    );

    const sableStyle = {
        border: '20px solid #4f9e4c', width: '250px'
    };

    const sableSponsor = (
        <img src={'https://hophacks-image.s3.amazonaws.com/hop.png'} style={sableStyle}/>
    );

    const blueStyle = {
        border: '20px solid blue', width: '250px'
    };

    const blueSponsor = (
        <img src={'https://hophacks-image.s3.amazonaws.com/hop.png'} style={blueStyle}/>
    );

    const starterStyle = {
        border: '20px solid red', width: '250px'
    };

    const starterSponsor = (
        <img src={'https://hophacks-image.s3.amazonaws.com/hop.png'} style={starterStyle}/>
    );

    const content = (
      <Typography
        className={classes.title}
        variant="h4"
        gutterBottom
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}
      >
        <h4>
          While we wait for HopHacks 2024, check <br></br> out some highlights from past years!
        </h4>
      </Typography>
    );
  
    const year2023 = (
      <Button
        variant="contained"
        style={{ height: '100px', width: '250px', backgroundColor: '#34b4eb' }}
      >
        <Typography variant="h3">2023</Typography>
      </Button>
    );
    const year2022 = (
      <Button
        variant="contained"
        style={{ height: '100px', width: '250px', backgroundColor: '#34b4eb' }}
        color="blue"
      >
        <Typography variant="h3" color="blue">
          2022
        </Typography>
      </Button>
    );
    const year2021 = (
      <Button
        variant="contained"
        style={{ height: '100px', width: '250px', backgroundColor: '#34b4eb' }}
        color="blue"
      >
        <Typography variant="h3">2021</Typography>
      </Button>
    );
  
    return (
      //We should refactor this into separate importable components if we have time
      //But this is fine for now
      <div>
        <div className="hero">
          <Grid
            container
            spacing={3}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Grid item xs={8} md={8}>
              {title}
            </Grid>
            <Grid container spacing={3}>
                <Grid item>
                    {gold}
                </Grid>
                <Grid item>
                    {goldSponsor}
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item>
                    {sable}
                </Grid>
                <Grid item>
                    {sableSponsor}
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item>
                    {blue}
                </Grid>
                <Grid item>
                    {blueSponsor}
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item>
                    {starter}
                </Grid>
                <Grid item>
                    {starterSponsor}
                </Grid>
            </Grid>

            {/* <Grid item xs={12} sm={12} md={12}>
              <img
                src={'https://hophacks-image.s3.amazonaws.com/hop.png'}
                style={{ width: '200px', margin: '1px 100px 5px' }}
              />
            </Grid> */}
            {/* <Grid item xs={8} md={8}>
              <Grid
                container
                spacing={12}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'right',
                  marginBottom: '13px'
                }}
              >
                <Grid item xs={4} md={3}>
                  {year2023}
                </Grid>
                <Grid item xs={4} md={3}>
                  {year2022}
                </Grid>
                <Grid item xs={4} md={3}>
                  {year2021}
                </Grid>
              </Grid>
            </Grid> */}
          </Grid>
        </div>
        {/* <div className="2023" style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '48px' }}>HOPHACKS 2023</h1>
          <h1>SEPTEMBER 15-17</h1>
          <a href="https://hophacks.devpost.com">
            <h3>View the Devpost</h3>
          </a>
        </div>
        <div className="stats" style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={'https://hophacks-website.s3.amazonaws.com/images/stats2023.png'}
            style={{ width: '1000px' }}
          />
        </div> */}
      </div>
    );
  }