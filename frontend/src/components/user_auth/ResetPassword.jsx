import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Link } from 'react-router-dom';
import '../../stylesheets/user_auth.css';
import axios from 'axios';

export default function PasswordReset(props) {
  const isMobile = props.isMobile;

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // const [attempted, setAttempted] = useState(false);
  // const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');

  async function reset_password() {
    const myVariable = process.env.REACT_APP_BACKENDURL;

    if (myVariable != '') {
      axios.defaults.baseURL = myVariable;
    }
    // const passwordre = /^(?=.*[0-9])(?=.*[!@#$%^&*)(+=._-])[a-zA-Z0-9!@#$%^&*)(+=._-]{6,25}$/;

    // if (!password.match(passwordre)) {
    //   setMessage(
    //     'Please enter a password between 7 to 25 characters which contain at least one numeric digit and a special character.'
    //   );
    //   return;
    // }

    // if (password != confirmPassword) {
    //   setMessage('Confirm password must match with the password');
    //   return;
    // }

    try {
      //TODO: need email verification
      await axios.post('/api/accounts/reset_password/request', {
        username: email,
        reset_url: window.location.protocol + '//' + window.location.host + '/reset_password'
      });
      setMessage('An email has been sent (if the account exists)!');
    } catch (e) {
      setMessage('Error requesting password reset');
    }
  }

  const findPwdCardDesktop = (
    <Card class="card">
      <CardContent>
        <Typography class="card-title">Reset Password</Typography>
        <div className="text-field">
          <TextField
            required
            variant="standard"
            label="Email Address"
            style={{ width: '90%' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{
              style: { color: '#061A40' }
            }}
            InputProps={{
              style: { color: '#061A40' }
            }}
          />
        </div>
        <Typography class="card-text-red">{message}</Typography>

        <Button
          class="card-button"
          variant="contained"
          color="primary"
          size="large"
          onClick={() => {
            reset_password();
          }}
        >
          confirm
        </Button>

        <Link to="/register/login">
          <Typography class="card-text-blue"> Back to Sign in </Typography>
        </Link>
      </CardContent>
    </Card>
  );

  const findPwdCardMobile = (
    <Card class="card">
      <CardContent style={{ marginTop: '-10%' }}>
        <Typography class="card-title" style={{ fontSize: '2rem' }}>
          Reset Password
        </Typography>
        <div className="text-field">
          <TextField
            required
            variant="standard"
            label="Email Address"
            style={{ width: '80%' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{
              style: { color: '#ffffff' }
            }}
            InputProps={{
              style: { color: '#ffffff' }
            }}
          />
        </div>

        <Typography class="card-text-red">{message}</Typography>

        <Button
          class="card-button"
          variant="contained"
          color="primary"
          size="large"
          style={{ fontSize: '1.2rem', height: '3rem', marginTop: '15%' }}
          onClick={() => {
            reset_password();
          }}
        >
          Reset Password
        </Button>
      </CardContent>
    </Card>
  );

  if (isMobile) {
    return <div className="root">{findPwdCardMobile}</div>;
  }

  return (
    <div className="root">
      <Grid container justify="center">
        <Grid item xs={12}>
          {findPwdCardDesktop}
        </Grid>
      </Grid>
    </div>
  );
}
