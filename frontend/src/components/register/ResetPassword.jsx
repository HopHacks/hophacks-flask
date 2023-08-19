import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Link } from 'react-router-dom';
import '../../stylesheets/register.css';

export default function PasswordReset(props) {
  const isMobile = props.isMobile;

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // const [attempted, setAttempted] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function reset_password(event) {
    event.preventDefault();

    const passwordre = /^(?=.*[0-9])(?=.*[!@#$%^&*)(+=._-])[a-zA-Z0-9!@#$%^&*)(+=._-]{6,25}$/;

    if (!password.match(passwordre)) {
      setMessage(
        'Please enter a password between 7 to 25 characters which contain at least one numeric digit and a special character.'
      );
      return;
    }

    if (password != confirmPassword) {
      setMessage('Confirm password must match with the password');
      return;
    }

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
    setAttempted(true);
  }

  const findPwdCardDesktop = (
    <Card class="card">
      <CardContent>
        <Typography class="card-title">Reset Password</Typography>
        <TextField
          // TODO: make the border white
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
        <TextField
          // TODO: make the border white
          type={'password'}
          required
          variant="standard"
          label="New Password"
          value={password}
          style={{ width: '80%', marginTop: '15%' }}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{
            style: { color: '#ffffff' }
          }}
          InputProps={{
            style: { color: '#ffffff' }
          }}
        />

        <TextField
          // TODO: make the border white
          type={'password'}
          required
          variant="standard"
          label="Confirm New Password"
          value={confirmPassword}
          style={{ width: '80%', marginTop: '15%' }}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputLabelProps={{
            style: { color: '#ffffff' }
          }}
          InputProps={{
            style: { color: '#ffffff' }
          }}
        />

        <Button
          class="card-button"
          variant="contained"
          color="primary"
          size="large"
          onClick={() => {}}
        >
          Reset Password
        </Button>
        <Link to={'/register/login'}>
          <Typography class="card-text"> Back to Sign in? </Typography>
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
        <TextField
          // TODO: make the border white
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
        <TextField
          // TODO: make the border white
          type={'password'}
          required
          variant="standard"
          label="New Password"
          value={password}
          style={{ width: '80%', marginTop: '15%' }}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{
            style: { color: '#ffffff' }
          }}
          InputProps={{
            style: { color: '#ffffff' }
          }}
        />

        <TextField
          // TODO: make the border white
          type={'password'}
          required
          variant="standard"
          label="Confirm New Password"
          value={confirmPassword}
          style={{ width: '80%', marginTop: '15%' }}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputLabelProps={{
            style: { color: '#ffffff' }
          }}
          InputProps={{
            style: { color: '#ffffff' }
          }}
        />

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

  const mottoDesktop = (
    <div style={{ marginTop: '30%', marginRight: '-20%' }}>
      <div>
        <Typography class="motto-text">Hack Your Passion Into Reality</Typography>
        <Typography class="motto-text" align="left">
          HopHacks
        </Typography>
      </div>
      <div style={{ marginTop: '15%' }}>
        <Typography class="motto-subtext">Innovate | Collaborate | Dominate</Typography>
      </div>
    </div>
  );

  const mottoMobile = (
    <div style={{ marginTop: '10%' }}>
      <Typography class="mobile-header">HOPHACKS</Typography>
      <Typography class="mobile-motto-text" style={{ marginTop: '15%' }}>
        Hack Your Passion Into Reality
      </Typography>
      <Typography class="mobile-motto-subtext" style={{ marginTop: '-3%' }}>
        Innovate | Collaborate | Dominate
      </Typography>
    </div>
  );

  if (isMobile) {
    return (
      <div className="root">
        {mottoMobile}
        {findPwdCardMobile}
      </div>
    );
  }

  return (
    <div className="root">
      <Grid container>
        <Grid item xs={5}>
          {findPwdCardDesktop}
        </Grid>
        <Grid item xs={5}>
          {mottoDesktop}
        </Grid>
      </Grid>
    </div>
  );
}
