import React, { useState } from "react";
import axios from "axios";

import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import {
    useHistory
} from "react-router-dom";

export default function Login(props) {
    
    /* State for handling login */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [attempted, setAttempted] = useState(false);

    /* State for handling reset password modal */
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState("");

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
        } catch(error) {
            setAttempted(true);
        }
    }

    const LoginForm = (
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input
              autoFocus
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    )


    async function handleReset(event) {
      event.preventDefault();
      // TODO alert?
      try {
        const response = await axios.post('/api/accounts/reset_password/request', {
          "username": resetEmail,
          "reset_url": window.location.protocol + '//' + window.location.host + '/reset_password'
        });
        alert("An email has been sent (if the account exists)!");
        handleResetClose()
      } catch {
        alert("Error requesting password reset");
      }
    }

    function handleResetClose() {
      setResetEmail("");
      setResetDialogOpen(false);
    }


    const ResetDialog = (        
      <Dialog 
        open={resetDialogOpen}
        onClose={handleResetClose}
      >
        <DialogTitle id="form-dialog-title">Reset Password</DialogTitle>
        
        <DialogContent>
          <DialogContentText>
            Reset your password here
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            onChange={e => setPassword(e.target.value)}
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

      </Dialog >
    )

    return (
      <div>
        {LoginForm}

        <p>{attempted ? "Incorrect Username or Password" : ""}</p>
        
        <button type="button" onClick={() => setResetDialogOpen(true)}>
          Reset Password
        </button>

        {ResetDialog}

      </div>
    );

}
