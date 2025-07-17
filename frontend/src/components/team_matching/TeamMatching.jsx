import React, { useState, useEffect } from 'react';
import TeamMatchingWelcome from './TeamMatchingWelcome';
import { withAuthCheck } from '../../util/auth.jsx';
import TeamProfileBuilder from './TeamProfileBuilder';
// import SwipeView from './SwipeView';
// import MatchListView from './MatchListView';
import axios from 'axios';

const TeamMatching = function TeamMatching(props){
  const [stage, setStage] = useState('loading');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    console.log("TeamMatching props:", props);
    const checkTeamProfile = async () => {
      try {
        const res = await axios.get('/api/teammatch/has_team_profile');
        if (res.data.in_team_matching) {
          setStage('swipe');
        } else {
          setStage('welcome'); // show welcome only if they haven't opted in
        }
      } catch (e) {
        console.error('Failed to check team profile:', e);
        setStage('loading'); // fallback
      }
    };

    if (!props.isLoggedIn) {
      setStage('loading'); // still checking login status
    } else if (props.isLoggedIn) {
      checkTeamProfile();
    }
  }, [props.isLoggedIn]);

  const renderStage = () => {
    switch (stage) {
      case 'loading':
        return (
          <div
            className="min-h-screen bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover bg-center flex items-center justify-center"
          >
            <span className="text-white text-xl">Loading...</span>
          </div>
        );
      case 'welcome':
        return (
          <div
            className="min-h-screen bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover bg-center"
          >
             <TeamMatchingWelcome onContinue={() => setStage('build')} />
          </div>
        );
      case 'build':
        return (
          <div
            className="min-h-screen bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover bg-center"
          >
            <TeamProfileBuilder onComplete={() => setStage('swipe')} />
          </div>
        );
      case 'swipe':
        return (
          <div
            className="min-h-screen bg-[url('https://hophacks-recap.s3.us-east-1.amazonaws.com/recap-bg.png')] bg-cover bg-center"
          >
            {/* <SwipeView onViewMatches={() => setStage('matches')} /> */}
          </div>
        );
      case 'matches':
        return (
          <div
            className="min-h-screen bg-[url('https://hophacks-recap.s3.us-east-1.amazonaws.com/recap-bg.png')] bg-cover bg-center"
          >
            {/* <MatchListView onBack={() => setStage('swipe')} /> */}
          </div>
        );
      default:
        return null;
    }
  };

  return renderStage();
};

export default withAuthCheck(TeamMatching);
