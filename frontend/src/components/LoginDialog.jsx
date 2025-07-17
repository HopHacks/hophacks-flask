import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { withAuthProps } from '../util/auth';
import { useNavigate } from 'react-router-dom';
import { IconButton, Typography } from '@mui/material';
import ResetPassword from './ResetPasswordDialog';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';

function Login(props) {
  const useStyles = makeStyles({
    title: {
      fontFamily: 'Inter',
      color: 'white'
    },

    closeButton: {
      position: 'absolute',
      right: '8px',
      top: '8px',
      color: 'black'
    },

    dialogPad: {
      padding: '5px',
      paddingLeft: '10px'
    },

    dialogBox: {
      backgroundColor: '#eef7ff',
      padding: '8px'
    },

    loginButton: {
      backgroundColor: '#1890ff',
      '&:hover': {
        backgroundColor: '#18baff'
      },
      color: 'white',
      margin: '10px'
    },

    linkColor: {
      color: '#1890ff',
      '&:hover': {
        color: '#18baff'
      }
    }
  });
  const classes = useStyles();
  /* State for handling login */
  const [email, setEmail] = useState(props.email);
  const [password, setPassword] = useState('');
  const [attempted, setAttempted] = useState(false);

  /* State for handling login modal */
  const [loginDialogOpen, setLoginDialogOpen] = useState(props.fromConfirmEmail ? true : false);

  let navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
    // TODO alert?
    try {
      await props.login(email, password);

      if (email !== 'admin') {
        navigate('/profile');
      } else {
        navigate('/admin');
      }
      setLoginDialogOpen(false);
    } catch (error) {
      setAttempted(true);
    }
  }

  function handleLoginClose() {
    setLoginDialogOpen(false);
  }

  function handleKey(event) {
    //submit when press enter

    if (event.which === 13) {
      handleLogin(event);
    }
  }

  const LoginDialog = (
    <Dialog
      open={loginDialogOpen}
      onClose={handleLoginClose}
      PaperProps={{ classes: { root: classes.dialogBox } }}
    >
      <DialogTitle id="form-dialog-title">
        {' '}
        <Typography variant="h5" className={classes.title}>
          {' '}
          LOGIN{' '}
        </Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleLoginClose}
          size="large"
        >
          {' '}
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogActions></DialogActions>
      <DialogContent>
        <TextField
          variant="standard"
          autoFocus
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <TextField
          variant="standard"
          margin="dense"
          id="password"
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(event) => handleKey(event)} />
        <p>{attempted ? 'Incorrect Username or Password' : ''}</p>
      </DialogContent>
      <Button onClick={handleLogin} className={classes.loginButton}>
        Login
      </Button>
      <Typography display="inline" className={classes.dialogPad}>
        <Link
          to={`/register`}
          style={{ textDecoration: 'none' }}
          onClick={() => {
            setLoginDialogOpen(false);
          }}
          className={classes.linkColor}
        >
          New to HopHacks? Apply now!
        </Link>
      </Typography>
      <Typography display="inline" className={classes.dialogPad}>
        <ResetPassword />
      </Typography>
    </Dialog>
  );

  const isMobile = window.innerWidth <= 650;

  if (isMobile) {
    return (
      <>
        <Button onClick={() => setLoginDialogOpen(true)} color="inherit">
          <Typography variant="h5" className={classes.title}>
            {' '}
            Login{' '}
          </Typography>
        </Button>
        {LoginDialog}
      </>
    );
  }

  return (
    <>
      <Button onClick={() => setLoginDialogOpen(true)} color="inherit">
        <Typography
          variant="h5"
          className={classes.title}
          style={{
            textTransform: 'none'
          }}
        >
          Register
        </Typography>
      </Button>
      {LoginDialog}
    </>
  );
}

export default withAuthProps(Login);
