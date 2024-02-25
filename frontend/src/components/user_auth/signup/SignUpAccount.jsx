import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Link } from 'react-router-dom';
import '../../../stylesheets/user_auth.css';

export default function SignUpAccount(props) {
  const isMobile = props.isMobile;
  const username = props.username;
  const setUsername = props.setUsername;
  const password = props.password;
  const setPassword = props.setPassword;
  const passwordConfirm = props.passwordConfirm;
  const setPasswordConfirm = props.setPasswordConfirm;
  const confirmMsg = props.confirmMsg;
  const handleAccountNext = props.handleAccountNext;

  const grayWrapperStyle = {
    backgroundColor: '#D9D9D9', // Gray background color for the specific input field
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '10px'
  };
  //const handleAccountBack = props.handleAccountBack;

  const signUpCardDesktop = (
    <Card class="card">
      <CardContent>
        <Typography class="card-title">CREATE A PROFILE</Typography>
        <Typography class="card-subtitle">step 0: email info</Typography>
        <Typography class="card-infoline">link your account!</Typography>
        <div style={grayWrapperStyle}>
          <TextField
            // TODO: make the border white
            required
            variant="standard"
            label="Email Address"
            style={{ width: '100%' }}
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            InputLabelProps={{
              style: { color: '#FFFFFF' }
            }}
            InputProps={{
              style: { color: '#FFFFFF' }
            }}
          />
        </div>
        <div style={grayWrapperStyle}>
          <TextField
            // TODO: make the border white
            type={'password'}
            required
            variant="standard"
            label="Password"
            value={password}
            style={{ width: '100%' }}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{
              style: { color: '#FFFFFF' }
            }}
            InputProps={{
              style: { color: '#FFFFFF' }
            }}
          />
        </div>
        <div style={grayWrapperStyle}>
          <TextField
            // TODO: make the border white
            type={'password'}
            required
            variant="standard"
            label="Confirm Password"
            value={passwordConfirm}
            style={{ width: '100%' }}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            InputLabelProps={{
              style: { color: '#FFFFFF' }
            }}
            InputProps={{
              style: { color: '#FFFFFF' }
            }}
          />
        </div>

        <Typography class="card-text-red">{confirmMsg}</Typography>

        <Link to="/user_auth/login">
          <Button class="card-button" variant="contained" color="primary" size="large">
            Back
          </Button>
        </Link>
        <Button
          class="card-button"
          variant="contained"
          color="primary"
          size="large"
          onClick={() => {
            handleAccountNext(); //TODO: need to update the flow of this
          }}
        >
          Back
        </Button>

        <Button
          class="card-button"
          variant="contained"
          color="primary"
          size="large"
          onClick={() => {
            handleAccountNext();
          }}
        >
          Next
        </Button>
        <Link to={'/user_auth/login'}>
          <Typography class="card-text"> Go to Sign in? </Typography>
          {/* TODO: change/remove this message now that we have a back button */}
        </Link>
      </CardContent>
    </Card>
  );

  const signUpCardMobile = (
    <Card class="card">
      <CardContent style={{ marginTop: '-10%' }}>
        <Typography class="card-title" style={{ fontSize: '2rem' }}>
          Sign Up
        </Typography>
        <TextField
          // TODO: make the border white
          required
          variant="standard"
          label="Email Address"
          style={{ width: '80%' }}
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          InputLabelProps={{
            style: { color: '#29A0E2' }
          }}
          InputProps={{
            style: { color: '#29A0E2' }
          }}
        />
        <TextField
          // TODO: make the border white
          type={'password'}
          required
          variant="standard"
          label="Password"
          value={password}
          style={{ width: '80%', marginTop: '15%' }}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{
            style: { color: '#29A0E2' }
          }}
          InputProps={{
            style: { color: '#29A0E2' }
          }}
        />

        <TextField
          // TODO: make the border white
          type={'password'}
          required
          variant="standard"
          label="Confirm Password"
          value={passwordConfirm}
          style={{ width: '80%', marginTop: '15%' }}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          InputLabelProps={{
            style: { color: '#29A0E2' }
          }}
          InputProps={{
            style: { color: '#29A0E2' }
          }}
        />

        <Typography class="card-text-red">{confirmMsg}</Typography>

        <Link to={'/user_auth/login'}>
          <Typography class="card-text"> Back </Typography>
        </Link>

        <Button
          class="card-button"
          variant="contained"
          color="primary"
          size="large"
          style={{ fontSize: '1.2rem', height: '3rem', marginTop: '15%' }}
          onClick={() => {
            handleAccountNext();
          }}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );

  if (isMobile) {
    return <div className="root">{signUpCardMobile}</div>;
  }

  const containerStyle = {
    backgroundColor: '#E1F1FF', // Replace with your desired color code
    padding: '20px',
    borderRadius: '8px',
    width: '100%',
    margin: 'auto'
  };

  return (
    <div className="root">
      <div style={containerStyle} className="background-container">
        {signUpCardDesktop}
        <Grid container>
          <Grid item xs={5}>
            {/* {signUpCardDesktop} */}
          </Grid>
          <Grid item xs={5}>
            {/* {mottoDesktop} */}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
