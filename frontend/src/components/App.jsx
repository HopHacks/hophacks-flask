import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { ParallaxProvider } from 'react-scroll-parallax';

import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { theme } from '../util/theme';
import { AuthProvider } from '../util/auth';

import Recruiting from './Recruiting';
import Admin from './admin/Admin';
import Nav from './Nav';
import Team from './Team';
import LandingPage from './LandingPage';
import PrizeHighlight from './PrizeHighlight';
import HasTeam from './HasTeam';
/**
import Home from './Home';
import Profile from './account/Profile';
import AnnouncementPanel from './admin/AnnouncementPanel';
import EmailConfirmation from './EmailConfirmation';
import PasswordReset from './PasswordReset';
import RSVP from './RSVP';
import Assignments from './judgetool/Assignments.jsx';
import Upload from './judgetool/Upload.jsx';
import UploadSponsors from './judgetool/UploadSponsors.jsx';
import SponsorPrizes from './judgetool/SponsorPrizes.jsx';
import TablesAndRooms from './judgetool/TablesAndRooms.jsx';
import Announcements from './announcement/Announcements.jsx';
import AnnouncementDetails from './announcement/AnnouncementDetails.jsx';
import Login from './register/Login';
import SignUp from './register/signup/SignUp';
import ResetPassword from './register/ResetPassword';
import TeamMatchingPage from './team_matching/TeamMatchingPage';
import { useMediaQuery } from 'usehooks-ts';
 */

export default function App() {
  // const isMobile = useMediaQuery('(max-width: 48em)');
  // for organizer application
  return (
    <>
      <ParallaxProvider>
        <MuiThemeProvider theme={theme}>
          <AuthProvider>
            <CssBaseline />
            <Router>
              <div>
                <Nav mode="/landingpage" />

                <Switch>
                  <Route exact path="/admin">
                    <Admin />
                  </Route>

                  <Route path="/recruiting">
                    <Recruiting />
                  </Route>

                  <Route path="/team">
                    <Team />
                  </Route>

                  <Route path="/landingpage">
                    <LandingPage />
                  </Route>

                  <Route path="/prizehighlight">
                    <PrizeHighlight />
                  </Route>

                  <Route path="/HasTeam">
                    <HasTeam />
                  </Route>

                  <Route path="/">
                    <HasTeam />
                  </Route>
                </Switch>
              </div>
            </Router>
          </AuthProvider>
        </MuiThemeProvider>
      </ParallaxProvider>
    </>
  );

  // return (
  //   <>
  //     <ParallaxProvider>
  //       <MuiThemeProvider theme={theme}>
  //         <AuthProvider>
  //           <CssBaseline />
  //           <Router>
  //             <div>
  //               <Nav />

  //               <Switch>
  //                 <Route path="/assignments" component={Assignments} />
  //                 <Route path="/upload" component={Upload} />
  //                 <Route path="/upload-sponsors" component={UploadSponsors} />
  //                 <Route path="/sponsor-prizes" component={SponsorPrizes} />
  //                 <Route path="/tables" component={TablesAndRooms} />

  //                 <Route exact path="/admin">
  //                   <Admin />
  //                 </Route>

  //                 <Route exact path="/admin/announcementpanel">
  //                   <AnnouncementPanel />
  //                 </Route>

  //                 <Route path="/profile">
  //                   <Profile isMobile={isMobile} />
  //                 </Route>

  //                 <Route path="/announcements/detail">
  //                   <AnnouncementDetails />
  //                 </Route>

  //                 <Route path="/announcements">
  //                   <Announcements />
  //                 </Route>

  //                 {/* TODO: replace this with new register page */}
  //                 {/* <Route path="/register">
  //                   <Register isMobile ={isMobile}/>
  //                 </Route> */}

  //                 <Route path="/recruiting">
  //                   <Recruiting />
  //                 </Route>

  //                 <Route path="/rsvp">
  //                   <RSVP />
  //                 </Route>
  //                 <Route path="/reset_password/:token" component={PasswordReset} />
  //                 <Route path="/confirm_email/:token" component={EmailConfirmation} />

  //                 <Route path="/team">
  //                   <Team />
  //                 </Route>

  //                 <Route path="/register/login">
  //                   <Login isMobile={isMobile} />
  //                 </Route>

  //                 <Route path="/register/signup">
  //                   <SignUp isMobile={isMobile} />
  //                 </Route>

  //                 <Route path="/register/resetpassword">
  //                   <ResetPassword isMobile={isMobile} />
  //                 </Route>

  //                 <Route path="/teamMatching" isMobile={isMobile}>
  //                   <TeamMatchingPage isMobile={isMobile} />
  //                 </Route>

  //                 <Route path="/">
  //                   <Home />
  //                 </Route>
  //               </Switch>
  //             </div>
  //           </Router>
  //         </AuthProvider>
  //       </MuiThemeProvider>
  //     </ParallaxProvider>
  //   </>
  // );
}
