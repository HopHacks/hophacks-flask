import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
//import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Link } from 'react-router-dom';
import '../../../stylesheets/user_auth.css';

export default function SignUpAccount(props) {
  const isMobile = props.isMobile;
  const username = props.username;
  const setUsername = props.setUsername;
  console.log(props);
  const password = props.password;
  const setPassword = props.setPassword;
  const passwordConfirm = props.passwordConfirm;
  const setPasswordConfirm = props.setPasswordConfirm;
  const confirmMsg = props.confirmMsg;
  const handleAccountNext = props.handleAccountNext;

  //const handleAccountBack = props.handleAccountBack;

  const signUpCardDesktop = (
    <Card class="card">
      <CardContent>
        <Typography class="card-title">CREATE A PROFILE</Typography>
        <Typography class="card-subtitle">step 0: email info</Typography>
        <Typography class="card-infoline">link your account!</Typography>
        <div className="text-field">
          <TextField
            required
            variant="standard"
            label="email address"
            style={{ width: '90%' }}
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
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
        <div className="text-field">
          <TextField
            type={'password'}
            required
            variant="standard"
            label="confirm password"
            value={passwordConfirm}
            style={{ width: '90%' }}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            InputLabelProps={{
              style: { color: '#061A40' }
            }}
            InputProps={{
              style: { color: '#061A40' }
            }}
          />
        </div>

        <Typography class="card-text-red">{confirmMsg}</Typography>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/user_auth/login">
            <Button class="card-button" variant="contained" color="primary" size="large">
              Back
            </Button>
          </Link>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
          </div>
        </div>
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

  return <div className="root">{signUpCardDesktop}</div>;
}
