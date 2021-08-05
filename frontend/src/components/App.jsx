import React, {useState, useEffect} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { ParallaxProvider } from 'react-scroll-parallax'
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";

import { theme } from "../util/theme"
import { AuthProvider } from "../util/auth"

import Home from "./Home"
import Profile from "./account/Profile"
import Admin from "./admin/Admin"
import Nav from "./Nav"
import EmailConfirmation from "./EmailConfirmation"
import PasswordReset from "./PasswordReset"
import RSVP from "./RSVP"
import Register from "./account/Register"
import Footer from "./Footer"

export default function App() {
    return (
      <>
        <ParallaxProvider>
        <MuiThemeProvider theme={theme}>
        <AuthProvider>
          <CssBaseline/>

          <Router>
            <div>
              <Nav/>

              <Switch>
                <Route path="/admin">
                  <Admin />
                </Route>
                <Route path="/profile">
                  <Profile/>
                </Route>

                <Route path="/register">
                  <Register/>
                </Route>
                
                <Route path="/rsvp">
                  <RSVP/>
                </Route>
                <Route path="/reset_password/:token" component={PasswordReset}/>
                <Route path="/confirm_email/:token" component={EmailConfirmation}/>

                <Route path="/">
                  <Home />
                </Route>
              </Switch>
              
              <Footer/>
            </div>
          </Router>
        </AuthProvider>
        </MuiThemeProvider>
        </ParallaxProvider>
      </>
    );
}