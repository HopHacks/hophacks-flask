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
import '../../stylesheets/user_auth.css';
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
    <Card class="card">
      <CardContent>
        <Typography class="card-title">LOGIN</Typography>
        <div className="text-field">
          <TextField
            required
            variant="standard"
            label="email address"
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
        <div className="text-field">
          <TextField
            type={'password'}
            required
            variant="standard"
            label="password"
            value={password}
            style={{ width: '90%' }}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{
              style: { color: '#061A40' }
            }}
            InputProps={{
              style: { color: '#061A40' }
            }}
          />
        </div>

        <div style={{ textAlign: 'right' }}>
          <Link to={'/register/resetpassword'}>
            <Typography class="card-text-blue"> forgot password? </Typography>
          </Link>
          {attempted && <Typography color="error">Incorrect Username or Password</Typography>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Button
            class="card-button"
            variant="contained"
            color="primary"
            size="large"
            onClick={handleLogin}
          >
            sign in
          </Button>

          {/* TODO: link user JHED */}
          {/* <Button
            class="card-button"
            variant="contained"
            color="primary"
            size="large"
            onClick={handleLogin}
          >
            use JHED
          </Button> */}
        </div>

        <Link to={'/register/signup'}>
          <Typography class="card-text-blue"> need a profile? </Typography>
        </Link>
      </CardContent>
    </Card>
  );

  const signInCardMobile = (
    <Card class="card">
      <CardContent>
        <Typography class="card-title">LOGIN</Typography>
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
          <Typography class="card-text"> forgot password? </Typography>
        </Link>
        {attempted && <Typography color="error">Incorrect Username or Password</Typography>}

        <Button
          class="card-button"
          variant="contained"
          color="primary"
          size="large"
          onClick={handleLogin}
        >
          Sign in
        </Button>

        <Link to={'/register/signup'}>
          <Typography class="card-text"> New To HopHacks? Sign Up Now! </Typography>
        </Link>
      </CardContent>
    </Card>
  );

  const mottoMobile = (
    <div style={{ marginTop: '10%' }}>
      <Typography class="mobile-header">HOPHACKS</Typography>
      <Typography class="mobile-motto-text" style={{ marginTop: '15%' }}>
        Hack Your Passion Into Reality
      </Typography>
      <Typography class="mobile-motto-subtext" style={{ marginTop: '-3%' }}>
        New Motto
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
      {signInCardDesktop}
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={5}>
          {/*signInCardDesktop*/}
        </Grid>
      </Grid>
    </div>
  );
}

export default withAuthProps(Login);
