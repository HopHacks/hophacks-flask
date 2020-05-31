import React, {useState, useEffect} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Login from "./Login"
import Home from "./Home"
import Profile from "./Profile"
import Admin from "./admin/Admin"
import Nav from "./Nav"
import { useEffect } from "react";

export default function App() {

  const [token, setToken] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(true);
  let refreshInterval;

  async function refreshToken() {
    if(!isLoggedIn)
      return;
    const url = '/api/auth/session/refresh';
    const response = await axios.get(url);
    authToken = response.data["access_token"];
    axios.defaults.headers.common = {'Authorization': `Bearer ${authToken}`}
    setToken(authToken);
  }

  // Login to page
  async function login(email, password) {
    let response = await axios.post('/api/auth/login', {
        "username": email,
        "password": password
    });

    setToken(response.data["access_token"]);
    axios.defaults.headers.common = {'Authorization': `Bearer ${authToken}`}
  
    setInterval(refreshToken, 60000)
    setLoggedIn(true);
  }


  // Logout by destroying our access token and telling server to remove our
  // refresh token fro, DB and cookies. Redirect to Home
  async function logout() {
      setToken('');
      delete axios.defaults.headers.common["Authorization"];
      if (refreshInterval) {
          clearInterval(refreshInterval);
      }

      const url = '/api/auth/session/logout';
      try {
          await axios.get(url);
      } catch(error) {
          console.log("Error logging out, perhaps already logged out?");
      }
  }


  useEffect(()=>{ 
    try{
      await refreshToken();
      refreshInterval = setInterval(refreshToken, 60000)
      setLoggedIn(true);
    }
    catch{
      setLoggedIn(false);
    }}, []);

  return (
    <Router>
      <div>
        <Nav/>

        <Switch>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
