import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { withAuthProps } from '../../util/auth';
import '../../stylesheets/user_auth.css';

const AuthTextField = ({ isMobile, label, type = 'text', value, onChange, color }) => (
  <TextField
    required
    variant="standard"
    label={label}
    type={type}
    value={value}
    onChange={onChange}
    style={{ width: isMobile ? '80%' : '90%' }}
    InputLabelProps={{ style: { color } }}
    InputProps={{ style: { color } }}
  />
);

function Login({ isMobile, email: initialEmail, login, isLoggedIn }) {
  const [email, setEmail] = useState(initialEmail ?? '');
  const [password, setPassword] = useState('');
  const [attempted, setAttempted] = useState(false);
  const history = useHistory();
  const textColor = '#061A40';

  useEffect(() => {
    if (isLoggedIn) {
      history.push(email === 'admin' ? '/admin' : '/profile');
    }
  }, [isLoggedIn, email, history]);

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      history.push(email === 'admin' ? '/admin' : '/profile');
    } catch {
      setAttempted(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover min-h-dvh">
      <div
        className="min-w-[300px] max-w-[700px] w-[70%] flex flex-col rounded-2xl p-10"
        style={{ backgroundColor: 'rgba(0, 29, 76, 0.9)' }}
      >
        <h2
          className="font-bold text-white text-5xl text-center mb-3"
          style={{ fontVariant: 'small-caps' }}
        >
          Login
        </h2>
        <div className="h-5 text-center mb-2 text-red-500">
          {attempted && <p>Incorrect Username or Password</p>}
        </div>
        <div className="text-field">
          <AuthTextField
            isMobile={isMobile}
            label="Email Address"
            value={email}
            onChange={handleChangeEmail}
            color={textColor}
          />
        </div>
        <div className="text-field">
          <AuthTextField
            isMobile={isMobile}
            type="password"
            label="Password"
            value={password}
            onChange={handleChangePassword}
            color={textColor}
          />
        </div>
        <div className="flex flex-col items-center">
          <button
            className="px-5 py-4 text-2xl font-bold rounded-2xl bg-recap-gold cursor-pointer 
              text-white shadow-[0_0_40px_rgba(255,255,148,0.3)] 
              transition-shadow duration-300 
              hover:shadow-[0_0_50px_rgba(255,255,148,0.5)]
              max-w-[200px] min-w-[150px] w-[30%] mt-5 mb-10"
            style={{ fontVariant: 'small-caps' }}
            onClick={handleLogin}
          >
            Login
          </button>
          <div className="w-full flex justify-between">
            <div className="flex">
              <p className="text-gray-400 mr-2">{"Don't have an account yet?"}</p>
              <Link to="/register/signup">
                <p className="text-gray-200 hover:text-gray-400 transition-all">Sign Up</p>
              </Link>
            </div>
            <Link to="/register/resetpassword">
              <p className="text-gray-200 hover:text-gray-400 transition-all">Forgot Password?</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuthProps(Login);
