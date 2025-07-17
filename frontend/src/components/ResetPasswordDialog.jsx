import React, { useState } from 'react';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { withAuthProps } from '../util/auth';
import { makeStyles } from '@mui/styles';

function ResetPassword() {
  const useStyles = makeStyles({
    linkColor: {
      color: '#1890ff',
      '&:hover': {
        color: '#18baff'
      }
    }
  });

  const myVariable = process.env.REACT_APP_BACKENDURL;

  if (myVariable != '') {
    axios.defaults.baseURL = myVariable;
  }

  const classes = useStyles();
  /* State for handling reset password modal */
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  async function handleReset(event) {
    event.preventDefault();
    // TODO alert?
    try {
      await axios.post('/api/accounts/reset_password/request', {
        username: resetEmail,
        reset_url: window.location.protocol + '//' + window.location.host + '/reset_password'
      });
      alert('An email has been sent (if the account exists)!');
      handleResetClose();
    } catch {
      alert('Error requesting password reset');
    }
  }

  function handleResetClose() {
    setResetEmail('');
    setResetDialogOpen(false);
  }

  const ResetDialog = (
    <Dialog open={resetDialogOpen} onClose={handleResetClose}>
      <DialogTitle id="form-dialog-title">Reset Password</DialogTitle>

      <DialogContent>
        <DialogContentText>Reset your password here</DialogContentText>
        <TextField
          variant="standard"
          autoFocus
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
          onChange={(e) => setResetEmail(e.target.value)} />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleResetClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleReset} color="primary">
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <Button
        style={{ textDecoration: 'none' }}
        onClick={() => setResetDialogOpen(true)}
        className={classes.linkColor}
      >
        Forgot your password?
      </Button>
      {ResetDialog}
    </>
  );
}

export default withAuthProps(ResetPassword);
