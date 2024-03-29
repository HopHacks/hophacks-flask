import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { withAuthProps } from '../../util/auth';
import '../../stylesheets/register.css';
import { useEffect } from 'react';

function Login(props) {
  const isMobile = props.isMobile;

  /* State for handling login */
  const [email, setEmail] = useState(props.email);
  const [password, setPassword] = useState('');
  const [attempted, setAttempted] = useState(false);

  let history = useHistory();

  useEffect(() => {
    setEmail(props.email);
  }, [props.email]);

  async function handleLogin(event) {
    event.preventDefault();
    try {
      await props.login(email, password);

      if (email !== 'admin') {
        history.push('/profile');
      } else {
        history.push('/admin');
      }
    } catch (error) {
      setAttempted(true);
    }
  }

  const signInCardDesktop = (
    <Card class="card" style={{ color: '#ffffff', height: '70%' }}>
      <CardContent>
        <Typography class="card-title">Welcome!</Typography>
        <div style={{ color: '#ffffff', fontSize: '2rem' }}>
          {' '}
          Sign up for HopHacks 2023 is currently closed! Please check back in June to sign up for
          HopHacks 2024!{' '}
        </div>
        {/*
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
            style: { color: '#ffffff' }
          }}
          InputProps={{
            style: { color: '#ffffff' }
          }}
        />

        <Link to={'/register/resetpassword'}>
          <Typography class="card-text"> Forgot Password? </Typography>
        </Link>
        {attempted && <Typography color="error">Incorrect Username or Password</Typography>}

        <Button
          class="card-button"
          variant="contained"
          color="primary"
          size="large"
          onClick={handleLogin}
        >
          Sign In
        </Button>

        <Link to={'/register/signup'}>
          <Typography class="card-text"> New To HopHacks? Sign Up Now! </Typography>
        </Link> */}
      </CardContent>
    </Card>
  );

  const signInCardMobile = (
    <Card class="card">
      <CardContent>
        <Typography class="card-title">Welcome!</Typography>
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
          label="Password"
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

        <Link to={'/register/resetpassword'}>
          <Typography class="card-text"> Forgot Password? </Typography>
        </Link>
        {attempted && <Typography color="error">Incorrect Username or Password</Typography>}

        <Button
          class="card-button"
          variant="contained"
          color="primary"
          size="large"
          onClick={handleLogin}
        >
          Sign In
        </Button>

        <Link to={'/register/signup'}>
          <Typography class="card-text"> New To HopHacks? Sign Up Now! </Typography>
        </Link>
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

  // check login status
  if (props.isLoggedIn) {
    if (email === 'admin') {
      history.push('/admin');
    } else {
      history.push('/profile');
    }
  }

  if (isMobile) {
    return (
      <div className="root">
        {mottoMobile}
        {signInCardMobile}
      </div>
    );
  }

  return (
    <div className="root">
      <Grid container>
        <Grid item xs={5}>
          {signInCardDesktop}
        </Grid>
        <Grid item xs={5}>
          {mottoDesktop}
        </Grid>
      </Grid>
    </div>
  );
}

export default withAuthProps(Login);
