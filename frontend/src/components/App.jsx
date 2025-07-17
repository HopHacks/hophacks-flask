import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ParallaxProvider } from 'react-scroll-parallax';

import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { theme } from '../util/theme';
import { AuthProvider } from '../util/auth';

import Home from './Home'; //temporarily took out home page
//import Recruiting from './Recruiting';
import Profile from './account/Profile.jsx';
import Admin from './admin/Admin';
import AnnouncementPanel from './admin/AnnouncementPanel';
import Nav from './Nav';
import EmailConfirmation from './EmailConfirmation';
import PasswordReset from './PasswordReset';
//import RSVP from './RSVP';
import Assignments from './judgetool/Assignments.jsx';
import Upload from './judgetool/Upload.jsx';
import UploadSponsors from './judgetool/UploadSponsors.jsx';
import SponsorPrizes from './judgetool/SponsorPrizes.jsx';
import TablesAndRooms from './judgetool/TablesAndRooms.jsx';
//import Announcements from './announcement/Announcements.jsx';
//import AnnouncementDetails from './announcement/AnnouncementDetails.jsx';
//import Announcements from './announcement/Announcements.jsx';
//import AnnouncementDetails from './announcement/AnnouncementDetails.jsx';
import Team from './Team';
import Login from './user_auth/Login'; //adjusted to be new path
// import Tracks from './tracks/Tracks.jsx';
import SignUp from './user_auth/signup/SignUp';
import Recap from './recap.jsx';
// import SignUpChecks from './user_auth/signup/SignUpChecks.jsx'; //new paths
// import SignUpProfile from './user_auth/signup/SignUpProfile.jsx';
// import SignUpAccount from './user_auth/signup/SignUpAccount.jsx';
// import SignUpImage from './user_auth/signup/SignUpImage.jsx';

import ResetPassword from './user_auth/ResetPassword';
//import TeamMatchingPage from './team_matching/TeamMatchingPage';
//import TeamMatchingPage from './team_matching/TeamMatchingPage';

import { useMediaQuery } from 'usehooks-ts';

export default function App() {
  const isMobile = useMediaQuery('(max-width: 48em)');

  return (
    <>
      <ParallaxProvider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              <CssBaseline />
              <Router>
                <div>
                  <Nav />

                  <Routes>
                    <Route path="/assignments" element={<Assignments />} />
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/upload-sponsors" element={<UploadSponsors />} />
                    <Route path="/sponsor-prizes" element={<SponsorPrizes />} />
                    <Route path="/tables" element={<TablesAndRooms />} />

                    <Route path="/admin" element={<Admin />} />

                    <Route path="/admin/announcementpanel" element={<AnnouncementPanel />} />

                    {/* <Route path="/account/profile" component={Profile} /> */}
                    <Route path="/profile" element={<Profile isMobile={isMobile} />} />

                    {/*<Route path="/announcements/detail">
                      <AnnouncementDetails />
                    </Route>

                    <Route path="/announcements">
                      <Announcements />
                    </Route>*/}

                    <Route path="/home" element={<Home />} />

                    {/* TODO: replace this with new register page */}
                    {/* <Route path="/register">
                      <Register isMobile={isMobile}/>
                    </Route> */}

                    {/*<Route path="/recruiting">
                      <Recruiting />
                    </Route>
                    
                    <Route path="/rsvp">
                      <RSVP />
                    </Route>
                    */}
                    <Route path="/confirm_email/:token" element={<EmailConfirmation />} />

                    <Route path="/reset_password/:token" element={<PasswordReset />} />
                    <Route path="/team" element={<Team />} />

                    <Route path="/register/login" element={<Login isMobile={isMobile} />} />

                    <Route path="/register/signup" element={<SignUp isMobile={isMobile} />} />

                    <Route path="/register/resetpassword" element={<ResetPassword isMobile={isMobile} />} />

                    {/*<Route path="/teamMatching" isMobile={isMobile}>
                      <TeamMatchingPage isMobile={isMobile} />
                    </Route>*/}

                    {/* <Route path="/tracks">
                      <Tracks />
                    </Route> */}

                    <Route path="/Recap" element={<Recap />} />

                    <Route path="/" element={<Home isMobile={isMobile} />} />
                  </Routes>
                </div>
              </Router>
            </AuthProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </ParallaxProvider>
    </>
  );
}
