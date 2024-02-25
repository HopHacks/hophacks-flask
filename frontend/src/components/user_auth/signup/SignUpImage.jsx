import React from 'react';
//import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
//import FormHelperText from '@material-ui/core/FormHelperText';

import '../../../stylesheets/user_auth.css';

export default function SignUpProfile(props) {
  const isMobile = props.isMobile;

  const profileSubmitMsg = props.profileSubmitMsg;
  const enabledButton = props.enabledButton;

  const handleImageNext = props.handleImageNext;
  const handleImageBack = props.handleImageBack;

  const profileCard = (
    <Card class="card">
      <CardContent>
        <Typography class={isMobile ? 'mobile-header' : 'card-title'}>CREATE A PROFILE</Typography>
        <Typography class={isMobile ? 'mobile-subheader' : 'card-subtitle'}>
          step 3: build a bird
        </Typography>
        <Typography class={isMobile ? 'mobile-infoline' : 'card-infoline'}>
          this will be your profile picture!
        </Typography>
        <Grid container spacing={isMobile ? 2 : 5}></Grid>

        <Typography class="card-text-red">{profileSubmitMsg}</Typography>
        <Button
          class="card-button"
          variant="contained"
          color="primary"
          size="large"
          disabled={!enabledButton}
          style={{
            fontSize: '1.5rem',
            width: isMobile ? '10rem' : '15rem',
            height: isMobile ? '3rem' : '4rem',
            marginTop: isMobile ? '10%' : '5%'
          }}
          onClick={() => {
            handleImageBack();
          }}
        >
          Back
        </Button>

        <Button
          class="card-button"
          variant="contained"
          color="primary"
          size="large"
          disabled={!enabledButton}
          style={{
            fontSize: '1.5rem',
            width: isMobile ? '10rem' : '15rem',
            height: isMobile ? '3rem' : '4rem',
            marginTop: isMobile ? '10%' : '5%'
          }}
          onClick={() => {
            handleImageNext();
          }}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );

  return <div>{profileCard}</div>;
}
