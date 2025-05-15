import React from 'react';
import TeamMatchingSwipe from './TeamMatchingSwipe';
import { withAuthCheck } from '../../util/auth.jsx'; // make sure the path is correct

function TeamMatchingApp() {
  return <TeamMatchingSwipe />;
}

export default withAuthCheck(TeamMatchingApp);
