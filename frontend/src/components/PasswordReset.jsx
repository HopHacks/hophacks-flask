import React, { useState } from 'react';
import axios from 'axios';
import { TextField } from '@material-ui/core';
import '../stylesheets/user_auth.css';

export default function PasswordReset(props) {
  const RED = '#ef4444';
  const GREEN = '#22c55e';
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState(RED);
  const [attempted, setAttempted] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const textColor = '#061A40';

  const backendURL = process.env.REACT_APP_BACKENDURL;
  if (backendURL) axios.defaults.baseURL = backendURL;

  async function reset_password(event) {
    event.preventDefault();
    setAttempted(true);

    const passwordre = /^(?=.*[0-9])(?=.*[!@#$%^&*)(+=._-])[a-zA-Z0-9!@#$%^&*)(+=._-]{6,25}$/;

    if (!password.match(passwordre)) {
      setMessage(
        'New password must be 7 to 25 characters long and include a digit and a special character'
      );
      setMessageColor(RED);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageColor(RED);
      return;
    }

    try {
      await axios.post('/api/accounts/reset_password', {
        reset_token: props.match.params.token,
        password
      });
      setMessage('Password reset successfully!');
      setMessageColor(GREEN);
    } catch (e) {
      setMessage('Unable to reset password. Password may have already been changed!');
      setMessageColor(RED);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center bg-[url('https://hophacks-website.s3.amazonaws.com/images/auth/auth_bg.png')] bg-cover min-h-dvh">
      <div
        className="min-w-[300px] max-w-[700px] w-[70%] flex flex-col rounded-2xl p-10"
        style={{ backgroundColor: 'rgba(0, 29, 76, 0.9)' }}
      >
        <h2
          className="font-bold text-white text-4xl text-center mb-4"
          style={{ fontVariant: 'small-caps' }}
        >
          Reset Password
        </h2>

        <div className="text-field mb-5">
          <TextField
            required
            variant="standard"
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%' }}
            InputLabelProps={{ style: { color: textColor } }}
            InputProps={{ style: { color: textColor } }}
          />
        </div>

        <div className="text-field mb-5">
          <TextField
            required
            variant="standard"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: '100%' }}
            InputLabelProps={{ style: { color: textColor } }}
            InputProps={{ style: { color: textColor } }}
          />
        </div>

        <div className="flex flex-col items-center justify-center">
          <button
            className="px-5 py-4 text-2xl font-bold rounded-2xl bg-recap-gold cursor-pointer 
              text-white shadow-[0_0_40px_rgba(255,255,148,0.3)] 
              transition-shadow duration-300 
              hover:shadow-[0_0_50px_rgba(255,255,148,0.5)]
              max-w-[200px] min-w-[150px] w-[30%] mb-5"
            style={{ fontVariant: 'small-caps' }}
            onClick={reset_password}
          >
            Submit
          </button>
          <div className="text-center mb-3" style={{ color: messageColor }}>
            {attempted && message && <p>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
