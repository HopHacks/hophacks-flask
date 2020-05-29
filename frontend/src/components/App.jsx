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
import Nav from "./Nav"

export default function App() {
  return (
    <Router>
      <div>
        <Nav />

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
