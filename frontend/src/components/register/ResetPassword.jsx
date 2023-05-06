import React, { useState } from 'react';

import axios from 'axios';
import Card from '@material-ui/core/Card';
import { Container } from '@material-ui/core';

export default function PasswordReset(props) {
  const [message, setMessage] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function reset_password(event) {
    event.preventDefault();

    const passwordre =
      /^(?=.*[0-9])(?=.*[!@#$%^&*)(+=._-])[a-zA-Z0-9!@#$%^&*)(+=._-]{6,25}$/;

    if (!password.match(passwordre)) {
      setMessage(
        'Please enter a password between 7 to 25 characters which contain at least one numeric digit and a special character.',
      );
      return;
    }

    if (password != confirmPassword) {
      setMessage('Confirm password must match with the password');
      return;
    }

    try {
      const response = await axios.post('/api/accounts/reset_password', {
        reset_token: props.match.params.token,
        password: password,
      });
      setMessage('Password reset successfully!');
    } catch (e) {
      setMessage(
        'Unable to reset password. Password may have already been changed!',
      );
    }
    setAttempted(true);
  }

  return (
    <div
      style={{
        backgroundImage: `url("${process.env.PUBLIC_URL}/images/2022_theme.png")`,
        backgroundSize: 'cover',
        height: '100vh',
      }}
    >
      <Container
        fixed
        style={{
          paddingTop: '100px',
        }}
      >
        <Card style={{ backgroundColor: '#d1e9ff' }}>
          <br></br>
          <div>
            {attempted || (
              <form onSubmit={reset_password} align="center">
                <label>
                  New Password:
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    style={{ marginLeft: '5px' }}
                  />
                </label>
                <label style={{ marginLeft: '30px' }}>
                  Confirm Password:
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    style={{ marginLeft: '5px' }}
                  />
                </label>
                <input
                  type="submit"
                  value="Submit"
                  style={{ marginLeft: '30px' }}
                />
              </form>
            )}
            <p style={{ color: 'red' }} align="center">
              {message}
            </p>
          </div>
        </Card>
      </Container>
    </div>
  );
}
