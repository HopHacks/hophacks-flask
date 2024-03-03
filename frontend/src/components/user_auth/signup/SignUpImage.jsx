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

        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <div>
            <Typography class={isMobile ? 'mobile-infoline' : 'card-infoline'}>
              bird color
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div
                className="color-select"
                style={{ backgroundColor: '#061A40' }}
                tabIndex="0"
              ></div>
              <div
                className="color-select"
                style={{ backgroundColor: '#FAC013' }}
                tabIndex="0"
              ></div>
              <div
                className="color-select"
                style={{ backgroundColor: '#C84630' }}
                tabIndex="0"
              ></div>
              <div
                className="color-select"
                style={{ backgroundColor: '#57A773' }}
                tabIndex="0"
              ></div>
              <div
                className="color-select"
                style={{ backgroundColor: '#bd2df1' }}
                tabIndex="0"
              ></div>
              <div
                className="color-select"
                style={{ backgroundColor: '#2d99e0' }}
                tabIndex="0"
              ></div>
            </div>
          </div>
          <div>
            <Typography class={isMobile ? 'mobile-infoline' : 'card-infoline'}>
              background color
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div
                className="color-select"
                style={{ backgroundColor: '#061A40' }}
                tabIndex="0"
              ></div>
              <div
                className="color-select"
                style={{ backgroundColor: '#FAC013' }}
                tabIndex="0"
              ></div>
              <div
                className="color-select"
                style={{ backgroundColor: '#C84630' }}
                tabIndex="0"
              ></div>
              <div
                className="color-select"
                style={{ backgroundColor: '#57A773' }}
                tabIndex="0"
              ></div>
              <div
                className="color-select"
                style={{ backgroundColor: '#bd2df1' }}
                tabIndex="0"
              ></div>
              <div
                className="color-select"
                style={{ backgroundColor: '#2d99e0' }}
                tabIndex="0"
              ></div>
            </div>
          </div>
        </div>
        <div>
          <Typography class={isMobile ? 'mobile-infoline' : 'card-infoline'}>your bird</Typography>
        </div>

        {/* nav buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
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
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
              Submit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return <div>{profileCard}</div>;
}
