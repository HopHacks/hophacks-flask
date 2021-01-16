import React, {useState, useEffect} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import axios from "axios";


import Login from "./Login"
import Home from "./Home"
import Profile from "./Profile"
import Admin from "./admin/Admin"
import Nav from "./Nav"
import EmailConfirmation from "./EmailConfirmation"
import PasswordReset from "./PasswordReset"
import RSVP from "./RSVP"

export default function App() {

    const [token, setToken] = useState('');
    // Can be null (haven't tried logging in with refreshToken yet)
    const [isLoggedIn, setLoggedIn] = useState(null);
    let refreshInterval;

    async function refreshToken() {
        if (isLoggedIn === false) { // false rather than null
            return;
        }

        try {
            const response = await axios.get('/api/auth/session/refresh');
            const tok = response.data["access_token"];
            axios.defaults.headers.common = {'Authorization': `Bearer ${tok}`}
            setToken(tok);
            setLoggedIn(true);
            setTimeout(refreshToken, 60000);
        } catch {
            console.log("Refresh failed");
            setLoggedIn(false);
        }
    }

    // Login to page
    async function login(email, password) {
        const response = await axios.post('/api/auth/login', {
            "username": email,
            "password": password
        });

        const tok = response.data["access_token"];
        axios.defaults.headers.common = {'Authorization': `Bearer ${tok}`}
        setToken(tok);
        setLoggedIn(true);
        setTimeout(refreshToken, 60000);

    }


    // Logout by destroying our access token and telling server to remove our
    // refresh token fro, DB and cookies. Redirect to Home
    async function logout() {
        setToken('');
        setLoggedIn(false);
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

    useEffect(() => {
      refreshToken();
    }, []);

<<<<<<< HEAD
  return (
    <Router>
      <div>
        <Nav isLoggedIn={isLoggedIn} logout={logout}/>

        <Switch>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/profile">
            <Profile isLoggedIn={isLoggedIn}/>
          </Route>
          <Route path="/reset_password/:token" component={PasswordReset}/>
          <Route path="/confirm_email/:token" component={EmailConfirmation}/>

          <Route path="/">
            <Home />
          </Route>
        </Switch>

        <Login login={login}/>
      </div>
    </Router>
  );
=======
    return (
      <Router>
        <div>
          <Nav isLoggedIn={isLoggedIn} logout={logout}/>

          <Switch>
            <Route path="/admin">
              <Admin />
            </Route>
            <Route path="/profile">
              <Profile isLoggedIn={isLoggedIn}/>
            </Route>
            <Route path="/login">
              <Login login={login}/>
            </Route>
            <Route path="/rsvp">
            
            <RSVP isLoggedIn={isLoggedIn}/>
          </Route>
            <Route path="/reset_password/:token" component={PasswordReset}/>
            <Route path="/confirm_email/:token" component={EmailConfirmation}/>

            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    );
>>>>>>> master
}
