import React from 'react';
import { TextField, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import '../../../stylesheets/user_auth.css';
import GlowButton from '../../ui/GlowButton';

export default function SignUpAccount({
  isMobile,
  username,
  setUsername,
  password,
  setPassword,
  passwordConfirm,
  setPasswordConfirm,
  confirmMsg,
  handleAccountNext
}) {
  const textColor = isMobile ? '#29A0E2' : '#061A40';
  const inputWidth = isMobile ? '80%' : '90%';

  const renderTextField = (label, value, onChange, type = 'text', style = {}) => (
    <div className="text-field" style={{ marginTop: isMobile ? '15%' : '0' }}>
      <TextField
        required
        variant="standard"
        type={type}
        label={label}
        value={value}
        onChange={onChange}
        style={{ width: inputWidth, ...style }}
        InputLabelProps={{ style: { color: textColor } }}
        InputProps={{ style: { color: textColor } }}
      />
    </div>
  );

  return (
    <div className="root">
      <p
        className="font-bold text-white text-xl text-center mb-5"
        style={{ fontVariant: 'small-caps' }}
      >
        1. Enter Credentials
      </p>
      {renderTextField('Email Address', username, (e) => setUsername(e.target.value.toLowerCase()))}
      {renderTextField('Password', password, (e) => setPassword(e.target.value), 'password')}
      {renderTextField(
        'Confirm Password',
        passwordConfirm,
        (e) => setPasswordConfirm(e.target.value),
        'password'
      )}

      <Typography className="card-text-red">{confirmMsg}</Typography>

      <div
        style={{
          display: 'flex',
          justifyContent: isMobile ? 'center' : 'space-between',
          alignItems: 'center',
          marginTop: '1rem',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '1rem' : 0
        }}
      >
        <Link to="/register/login">
          <GlowButton variant="secondary">Back</GlowButton>
        </Link>
        <GlowButton onClick={handleAccountNext}>Next</GlowButton>
      </div>
    </div>
  );
}
