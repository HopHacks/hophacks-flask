import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { makeStyles } from '@mui/styles';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles({
  margin: {
    marginBottom: '13px'
  },

  color: {
    backgroundColor: '#d1e9ff'
  },

  bodycolor: {},

  // title: {
  //   color: "#7289da",
  //   fontFamily: "VCR OSD Mono",
  // },

  picture: {
    height: '300px'
  },

  card: {
    marginLeft: '22.5%',
    maxWidth: '55%',
    padding: 12
  }
});

export default function AnnouncementDetails() {
  const classes = useStyles();
  const location = useLocation();
  const announcement = location.state;

  const title = announcement.title;
  const time = announcement.created_time.substring(0, 10);
  const content = announcement.content;

  return (
    <div
      style={{
        backgroundImage: `url("https://hophacks-website.s3.amazonaws.com/images/2022_theme.png")`,
        backgroundSize: 'cover',
        height: '100vh'
      }}
    >
      <Box py={2}>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} variant="h4" gutterBottom>
              {title}
            </Typography>
            <Typography>{time}</Typography>
            <Typography variant="h6">
              <br />
              {content}
              <br />
              <br />
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}
