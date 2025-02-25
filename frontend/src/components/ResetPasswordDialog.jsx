import React, { useState } from 'react';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { withAuthProps } from '../util/auth';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

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
          autoFocus
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
          onChange={(e) => setResetEmail(e.target.value)}
        />
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
