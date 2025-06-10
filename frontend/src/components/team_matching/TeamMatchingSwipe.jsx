import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHistory } from 'react-router-dom'; // ✅ this works in v5
import axios from 'axios';
import MatchList from './MatchList';
import { withAuthProps } from '../../util/auth.jsx';
import '../../stylesheets/TeamMatching.css';

function TeamMatching({ isLoggedIn }) {
  const history = useHistory(); // ✅ get history object

  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [view, setView] = useState('swipe');

  const API_URL = '/api/teammatch';

  useEffect(() => {
    const getPotentialMatches = async () => {
      try {
        const response = await axios.get(`${API_URL}/potential_matches`);
        setUsers(response.data);
      } catch (err) {
        setError('Error fetching potential matches');
        console.error(err);
      }
    };

    if (view === 'swipe' && isLoggedIn) {
      getPotentialMatches();
    }
  }, [view, isLoggedIn]);

  const handleSwipe = async (direction) => {
    const targetUser = users[currentIndex];
    try {
      const res = await axios.post(`${API_URL}/swipe`, {
        target_id: targetUser.id,
        action: direction
      });

      if (res.data.match) {
        setMatchResult(`🎉 You matched with ${targetUser.username}!`);
      } else {
        setMatchResult(null);
      }
    } catch (err) {
      console.error('Error swiping:', err);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const currentUser = users[currentIndex];

  return (
    <div className="team-matching">
      <div className="team-matching-container">
        <div className="toggle-buttons" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <button onClick={() => history.push('/profile')}>← Back to Profile</button>
          <button onClick={() => setView('swipe')}>Swipe</button>
          <button onClick={() => setView('matches')}>View Matches</button>
        </div>

        {view === 'swipe' ? (
          <>
            <h1>Team Matching</h1>
            {error && <p className="error">{error}</p>}
            {matchResult && <p className="match-success">{matchResult}</p>}

            <div className="card-container">
              <AnimatePresence>
                {currentUser && (
                  <motion.div
                    key={currentUser.id}
                    className="card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: 300, rotate: 15 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(event, info) => {
                      if (info.offset.x > 100) {
                        handleSwipe('right');
                      } else if (info.offset.x < -100) {
                        handleSwipe('left');
                      }
                    }}
                    whileTap={{ scale: 1.05 }}
                  >
                    <h2>
                      {currentUser.profile?.first_name} {currentUser.profile?.last_name} (
                      {currentUser.username})
                    </h2>
                    <p>
                      <strong>School:</strong> {currentUser.profile?.school}
                    </p>
                    <p>
                      <strong>Major:</strong> {currentUser.profile?.major}
                    </p>
                    <p>
                      <strong>Gender:</strong> {currentUser.profile?.gender}
                    </p>
                    <p>
                      <strong>Age:</strong> {currentUser.profile?.age}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!currentUser && <p>No more users to show</p>}
          </>
        ) : (
          <MatchList />
        )}
      </div>
    </div>
  );
}

export default withAuthProps(TeamMatching);
