import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MatchList from './MatchList'; // ⬅️ Make sure you have this component
import '../../stylesheets/TeamMatching.css';

function TeamMatching({ token }) {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [view, setView] = useState('swipe'); // ⬅️ New state for toggle

  const API_URL = 'http://localhost:5000/api/teammatch';

  useEffect(() => {
    const getPotentialMatches = async () => {
      try {
        const response = await fetch(`${API_URL}/potential_matches`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch potential matches');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError('Error fetching potential matches');
        console.error(err);
      }
    };

    if (view === 'swipe') {
      getPotentialMatches();
    }
  }, [token, view]);

  const handleSwipe = async (direction) => {
    const targetUser = users[currentIndex];

    try {
      const res = await fetch(`${API_URL}/swipe`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_id: targetUser._id,
          action: direction,
        }),
      });

      const data = await res.json();
      if (data.match) {
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
    <div className="team-matching-container">
      <div className="toggle-buttons" style={{ textAlign: 'center', marginBottom: '1rem' }}>
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
                  key={currentUser._id}
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
                  <h2>{currentUser.name} ({currentUser.username})</h2>
                  <p><strong>School:</strong> {currentUser.school}</p>
                  <p><strong>Skills:</strong> {currentUser.technical_skills?.join(', ')}</p>
                  <p><strong>Specialty:</strong> {currentUser.preferred_specialty}</p>
                  <p><strong>Looking for:</strong> {currentUser.teammate_preferences}</p>
                  <p><strong>Fav Song:</strong> {currentUser.favorite_song}</p>
                  <p><strong>Fav Show:</strong> {currentUser.favorite_show}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!currentUser && <p>No more users to show</p>}
        </>
      ) : (
        <MatchList token={token} />
      )}
    </div>
  );
}

export default TeamMatching;
