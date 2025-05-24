import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import LabeledTextField from '../ui/LabeledTextField';
import { Link } from 'react-router-dom';
import '../../stylesheets/user_auth.css';
import axios from 'axios';
import GlowButton from '../ui/GlowButton';

export default function PasswordReset({ isMobile }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const resetPassword = async () => {
    const backendURL = process.env.REACT_APP_BACKENDURL;
    if (backendURL) axios.defaults.baseURL = backendURL;

    try {
      await axios.post('/api/accounts/reset_password/request', {
        username: email,
        reset_url: `${window.location.protocol}//${window.location.host}/reset_password`
      });
      setMessage('An email has been sent (if the account exists)!');
    } catch {
      setMessage('Error requesting password reset');
    }
  };

  const labelColor = '#061A40';
  const inputWidth = isMobile ? '80%' : '90%';

  return (
    <div className="root">
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <div className="flex flex-col items-center justify-center bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover min-h-dvh">
            <div
              className="min-w-[300px] max-w-[700px] w-[70%] flex flex-col justify-center rounded-2xl p-10 m-5"
              style={{ backgroundColor: 'rgba(0, 29, 76, 0.9)' }}
            >
              <h2
                className="font-bold text-white text-5xl text-center mb-3"
                style={{ fontVariant: 'small-caps' }}
              >
                Reset Password
              </h2>

              <div className="h-5 text-center mb-3 text-red-500">{message}</div>

              <div className="text-field">
                <LabeledTextField
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: inputWidth }}
                  textColor={labelColor}
                />
              </div>

              <div className="w-full flex justify-center">
                <GlowButton onClick={resetPassword}>Next</GlowButton>
              </div>
              <div className="w-full flex justify-between">
                {!isMobile && (
                  <Link to="/register/login">
                    <p className="text-gray-200 hover:text-gray-400 transition-all">
                      Back to Sign In
                    </p>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
