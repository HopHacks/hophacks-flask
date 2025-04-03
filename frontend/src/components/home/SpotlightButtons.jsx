import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
    width: '100%',
    backgroundColor: '#15004B',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  title: {
    color: 'white',
    fontSize: '6rem',
    marginTop: '2rem',
    marginBottom: '2rem'
  },
  spotlightWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1
  },
  spotlight: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    background: `
    radial-gradient(
      circle at center top,
      rgba(255, 255, 140, 0.0) 0%,
      rgba(255, 255, 140, 0.05) 40%,
      rgba(255, 255, 140, 0.15) 60%,
      rgba(255, 255, 140, 0.25) 80%,
      rgba(255, 255, 140, 0.3) 100%
    )
  `,
    transition: 'clip-path 0.4s ease-in-out',
    animation: '$pulse 4s infinite ease-in-out'
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: '6rem',
    zIndex: 2,
    marginTop: '2rem'
  },
  buttonContainer: {
    width: 200,
    height: 400,
    textAlign: 'center',
    transition: 'transform 0.3s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  },
  characterImage: {
    width: '100%',
    height: 'auto',
    borderRadius: 12
  },
  label: {
    color: 'white',
    fontSize: '2rem',
    marginTop: '1rem'
  }
}));

const SpotlightButtons = () => {
  const classes = useStyles();
  const history = useHistory();

  const [clip, setClip] = useState('polygon(50% 0%, 48% 100%, 52% 100%)');

  const handleHover = (index) => {
    const clips = [
      'polygon(50% 0%, 0% 100%, 40% 100%)', // left
      'polygon(50% 0%, 35% 100%, 65% 100%)', // center
      'polygon(50% 0%, 60% 100%, 100% 100%)' // right
    ];
    setClip(clips[index]);
  };

  const handleLeave = () => {
    setClip('polygon(50% 0%, 45% 100%, 55% 100%)');
  };

  const handleClick = (index) => {
    if (index === 1) {
      history.push('/login');
    } else {
      alert('TBD');
    }
  };

  return (
    <Box className={classes.root}>
      <Typography className={classes.title}>REGISTER</Typography>

      <div className={classes.spotlightWrapper}>
        <div className={classes.spotlight} style={{ clipPath: clip }} />
      </div>

      <div className={classes.buttonRow}>
        {[
          {
            label: 'Sponsor',
            img: 'https://hophacks-website.s3.amazonaws.com/images/website2025/sponsor.png'
          },
          {
            label: 'Compete',
            img: 'https://hophacks-website.s3.amazonaws.com/images/website2025/compete.png'
          },
          {
            label: 'Volunteer',
            img: 'https://hophacks-website.s3.amazonaws.com/images/website2025/volunteer.png'
          }
        ].map((item, index) => (
          <div
            key={index}
            className={classes.buttonContainer}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleHover(index)}
            onMouseLeave={handleLeave}
          >
            <img src={item.img} alt={item.label} className={classes.characterImage} />
            <div className={classes.label}>{item.label}</div>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default SpotlightButtons;
