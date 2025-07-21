import React, { useState, useEffect } from 'react';
import TeamMatchingWelcome from './TeamMatchingWelcome';
import TeamProfileBuilder from './TeamProfileBuilder';
import TeamMatchingPause from './TeamMatchingPause';
import TeamMatchingDashboard from './TeamMatchingDashboard.jsx';
import TeamMatchingSwipe from './TeamMatchingSwipe.jsx';
import { withAuthCheck } from '../../util/auth.jsx';
import axios from 'axios';
import { useHistory } from 'react-router-dom';


const TeamMatching = function TeamMatching(props) {
  const [stage, setStage] = useState('loading');
  const [isSwipingLive, setIsSwipingLive] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchSwipingStatus = async () => {
      try {
        // Example: fetch from backend if swiping is live or not
        const res = await axios.get('/api/teammatch/swiping_status');
        setIsSwipingLive(res.data.is_live);
      } catch (e) {
        console.error('Failed to fetch swiping status:', e);
        // fallback to false or true as you wish
        setIsSwipingLive(false);
      }
    };

    fetchSwipingStatus();
  }, []);

  useEffect(() => {
    const checkTeamProfile = async () => {
      try {
        const res = await axios.get('/api/teammatch/has_team_profile');
        if (res.data.in_team_matching) {
          if (isSwipingLive) {
            setStage('dashboard');
          } else {
            setStage('pause'); // show pause screen if swiping not live yet
          }
        } else {
          setStage('welcome'); // no profile, start flow
        }
      } catch (e) {
        console.error('Failed to check team profile:', e);
        setStage('loading');
      }
    };

    if (props.isLoggedIn) {
      checkTeamProfile();
    } else {
      setStage('loading');
    }
  }, [props.isLoggedIn, isSwipingLive]);

  const renderStage = () => {
    switch (stage) {
      case 'loading':
        return (
          <div className="min-h-screen bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover bg-center flex items-center justify-center">
            <span className="text-white text-xl">Loading...</span>
          </div>
        );
      case 'welcome':
        return (
          <div className="min-h-screen bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover bg-center">
            <TeamMatchingWelcome onContinue={() => setStage('build')} />
          </div>
        );
      case 'build':
        return (
          <div className="min-h-screen bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover bg-center">
            <TeamProfileBuilder onComplete={() => {
              // After profile creation, go to pause because swiping not live yet
              setStage('pause');
            }} />
          </div>
        );
			case 'dashboard':
				return (
          <div className="min-h-screen bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover bg-center">
            <TeamMatchingDashboard setStage={setStage} />
          </div>
        );
      case 'pause':
        return (
          <div className="min-h-screen bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover bg-center">
            <TeamMatchingPause onContinue={() => history.push('/profile')} />
          </div>
        );
    
      case 'swipe':
        return (
          <div className="min-h-screen bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover bg-center">
            <TeamMatchingSwipe setStage={setStage}/>
          </div>
        );
      case 'matches':
        return (
          <div className="min-h-screen bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover bg-center">
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
