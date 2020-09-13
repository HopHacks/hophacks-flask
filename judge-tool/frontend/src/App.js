import React from 'react';
import Assignments from './components/Assignments';
import Upload from './components/Upload';
import UploadSponsors from './components/UploadSponsors';
import SponsorPrizes from './components/SponsorPrizes';
import TablesAndRooms from './components/TablesAndRooms';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <div style={{width : '70%', margin: 40}}>
      <Router basename="/judging">
        <Switch>
          <Route path="/assignments" exact component={Assignments}/>
          <Route path="/upload" exact component={Upload}/>
          <Route path="/upload-sponsors" exact component={UploadSponsors}/>
          <Route path="/sponsor-prizes" exact component={SponsorPrizes}/>
          <Route path="/tables" exact component={TablesAndRooms}/>
        </Switch>
      </Router>
    </div>)

}

export default App;
