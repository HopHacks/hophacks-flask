import React from 'react';
import Assignments from './components/Assignments';
import Upload from './components/Upload';
import TableAssignments from './components/TableAssignments';
import UploadSponsors from './components/UploadSponsors';
import SponsorPrizes from './components/SponsorPrizes';
import UploadRooms from './components/UploadRooms';
import RoomAssignments from './components/RoomAssignments';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <div style={{width : '70%', margin: 40}}>
      <Router>
        <Switch>
          <Route path="/assignments" exact component={Assignments}/>
          <Route path="/upload" exact component={Upload}/>
          <Route path="/table-assignments" exact component={TableAssignments}/>
          <Route path="/upload-sponsors" exact component={UploadSponsors}/>
          <Route path="/sponsor-prizes" exact component={SponsorPrizes}/>
          <Route path="/upload-rooms" exact component={UploadRooms}/>
          <Route path="/room-assignments" exact component={RoomAssignments}/>
        </Switch>
      </Router>
    </div>)

}

export default App;
