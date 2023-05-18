import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { ParallaxProvider } from 'react-scroll-parallax';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { theme } from '../util/theme';
import { AuthProvider } from '../util/auth';

import Home from './Home';
import Recruiting from './Recruiting';
import Profile from './account/Profile';
import Admin from './admin/Admin';
import AnnouncementPanel from './admin/AnnouncementPanel';
import Nav from './Nav';
import EmailConfirmation from './EmailConfirmation';
import PasswordReset from './PasswordReset';
import RSVP from './RSVP';
import Register from './account/Register';
import Assignments from './judgetool/Assignments.jsx';
import Upload from './judgetool/Upload.jsx';
import UploadSponsors from './judgetool/UploadSponsors.jsx';
import SponsorPrizes from './judgetool/SponsorPrizes.jsx';
import TablesAndRooms from './judgetool/TablesAndRooms.jsx';
import Announcements from './announcement/Announcements.jsx';
import AnnouncementDetails from './announcement/AnnouncementDetails.jsx';
import Team from './Team';
import Login from './register/Login';
import SignUp from './register/signup/SignUp';
import ResetPassword from './register/ResetPassword';

import { useMediaQuery } from 'usehooks-ts';

export default function App() {
  const isMobile = useMediaQuery('(max-width: 48em)');

  return (
    <>
      <ParallaxProvider>
        <MuiThemeProvider theme={theme}>
          <AuthProvider>
            <CssBaseline />
            <Router>
              <div>
                <Nav />

                <Switch>
                  <Route path="/assignments" component={Assignments} />
                  <Route path="/upload" component={Upload} />
                  <Route path="/upload-sponsors" component={UploadSponsors} />
                  <Route path="/sponsor-prizes" component={SponsorPrizes} />
                  <Route path="/tables" component={TablesAndRooms} />

                  <Route exact path="/admin">
                    <Admin />
                  </Route>

                  <Route exact path="/admin/announcementpanel">
                    <AnnouncementPanel />
                  </Route>

                  <Route path="/profile">
                    <Profile isMobile={isMobile} />
                  </Route>

                  <Route path="/announcements/detail">
                    <AnnouncementDetails />
                  </Route>

                  <Route path="/announcements">
                    <Announcements />
                  </Route>

                  {/* TODO: replace this with new register page */}
                  {/* <Route path="/register">
                    <Register isMobile ={isMobile}/>
                  </Route> */}

                  <Route path="/recruiting">
                    <Recruiting />
                  </Route>

                  <Route path="/rsvp">
                    <RSVP />
                  </Route>
                  <Route path="/reset_password/:token" component={PasswordReset} />
                  <Route path="/confirm_email/:token" component={EmailConfirmation} />

                  <Route path="/team">
                    <Team />
                  </Route>

                  <Route path="/register/login">
                    <Login isMobile={isMobile} />
                  </Route>

                  <Route path="/register/signup">
                    <SignUp isMobile={isMobile} />
                  </Route>

                  <Route path="/register/resetpassword">
                    <ResetPassword isMobile={isMobile} />
                  </Route>

                  <Route path="/">
                    <Home />
                  </Route>
                </Switch>
              </div>
            </Router>
          </AuthProvider>
        </MuiThemeProvider>
      </ParallaxProvider>
    </>
  );
}
