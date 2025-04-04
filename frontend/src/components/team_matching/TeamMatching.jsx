import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../stylesheets/TeamMatching.css';

function TeamMatching() {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/teammatch/potential_matches';

  useEffect(() => {
    const getPotentialMatches = async () => {
      try {
        const token = 'your_jwt_token_here'; // Replace with actual JWT
        const response = await fetch(API_URL, {
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

    getPotentialMatches();
  }, []);

  const handleSwipe = (direction) => {
    console.log(`Swiped ${direction} on user:`, users[currentIndex]);
    setCurrentIndex((prev) => prev + 1);
  };

  const currentUser = users[currentIndex];

  return (
    <div className="team-matching-container">
      <h1>Team Matching</h1>
      {error && <p className="error">{error}</p>}

      <div className="card-container">
        <AnimatePresence>
          {currentUser && (
            <motion.div
              key={currentUser._id}
              className="card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: 300, rotate: 20 }}
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
              <h2>{currentUser.username}</h2>
              <p>{currentUser.bio || 'No bio provided'}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!currentUser && <p>No more users to show</p>}
    </div>
  );
}

export default TeamMatching;
