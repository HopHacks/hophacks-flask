import React, { useState } from 'react';
import '../../stylesheets/TeamMatchingLoginPage.css';

function TeamMatchingLoginPage({ setToken }) {
  const [username, setUsername] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/teammatch/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (res.status !== 200) {
        setErr(data.error || 'Login failed');
        return;
      }

      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      setErr('');
    } catch (err) {
      setErr('Something went wrong');
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <button type="submit">Login</button>
        {err && <p className="error">{err}</p>}
      </form>
    </div>
  );
}

export default TeamMatchingLoginPage;
