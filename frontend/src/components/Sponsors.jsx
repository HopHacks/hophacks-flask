import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
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

    const subtext = (
      <Typography
        variant="h5"
        style={{
          display: 'flex',
          alignItems: 'left',
          justifyContent: 'left',
          height: '10%'
        }}
      >
        Interested in sponsoring us? Email us at hophacks.sponsors@gmail.com 
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
  
    return (
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
            <Grid item>
              <Grid container spacing={3}>
                <Grid item xs={10} s={10} md={10}>
                    {title}
                </Grid>
                <Grid item xs={10} s={10} md={10}>
                    {subtext}
                </Grid>
              </Grid>
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
          </Grid>
        </div>
      </div>
    );
  }