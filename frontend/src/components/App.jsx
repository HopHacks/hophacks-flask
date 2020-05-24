import React from "react";
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

import {getToken, logout} from "../util/auth"

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {getToken() && <li> <Link to="/profile">Profile</Link></li>}
            {getToken()
                ? <li><button onClick={logout}>Logout</button></li>
                : <li> <Link to="/login">Login</Link></li>
            }
          </ul>
        </nav>

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
