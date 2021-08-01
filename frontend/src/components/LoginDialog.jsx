import React, { useState } from "react";
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import { withAuthProps } from '../util/auth';
import {
  useHistory
} from "react-router-dom";
import { Typography } from "@material-ui/core";
import ResetPassword from "./ResetPasswordDialog";

import { makeStyles } from '@material-ui/core/styles';
function Login(props) {


  const useStyles = makeStyles({

    title: {
        fontFamily: "VCR OSD Mono",
    },
  });
  
  /* State for handling login */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attempted, setAttempted] = useState(false);

  /* State for handling login modal */
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  let history = useHistory();

  async function handleLogin(event) {
    event.preventDefault();
    // TODO alert?
    try {
      await props.login(email, password);

      if (email !== "admin") {
        history.push("/profile")
      } else {
        history.push("/admin")
      }
      setLoginDialogOpen(false)
    } catch (error) {
      setAttempted(true);
    }
  }

  function handleLoginClose() {
    setLoginDialogOpen(false);
  }

  const LoginDialog = (
    <Dialog
      open={loginDialogOpen}
      onClose={handleLoginClose}
    >
      <DialogTitle id="form-dialog-title">Login</DialogTitle>
      <DialogActions>
      </DialogActions>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          id="password"
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <p>{attempted ? "Incorrect Username or Password" : ""}</p>
      </DialogContent>
      <Button onClick={handleLoginClose} color="primary">
        Cancel
          </Button>
      <Button onClick={handleLogin} color="primary">
        Login
          </Button>
      <Typography display="inline">
        New to HopHacks?{' '}
        <Link to={'/register'} style={{ textDecoration: 'none' }} onClick={()=>{setLoginDialogOpen(false)}}>
          Apply Now
              </Link>
      </Typography>

      <Typography display="inline">
        Forgot password?{' '}
        <ResetPassword />
      </Typography>
    </Dialog>
  )



  const classes = useStyles();
  return (
    <>
      <Button onClick={() => setLoginDialogOpen(true)} color="inherit">
        <Typography variant="h5" className={classes.title}> Login </Typography>
      </Button>

      {LoginDialog}
    </>
  );

}

export default withAuthProps(Login);