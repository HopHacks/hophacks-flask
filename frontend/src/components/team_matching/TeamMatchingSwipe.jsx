import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeCard from './SwipeCard';

function TeamMatchingSwipe({ setStage }) {
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [matchMessage, setMatchMessage] = useState('');
  const [error, setError] = useState('');
  const [swipeDirection, setSwipeDirection] = useState(null); // 👈 new

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/teammatch/potential_matches');
        setUsers(res.data);
      } catch (err) {
        setError('Failed to load potential teammates.');
      }
    };
    fetchUsers();
  }, []);

  const handleSwipe = async (direction) => {
    const currentUser = users[index];
    if (!currentUser) return;

    setSwipeDirection(direction); // 👈 update direction for exit animation

    try {
      const res = await axios.post('/api/teammatch/swipe', {
        target_id: currentUser.id,
        action: direction,
      });

      if (res.data.match) {
        setMatchMessage(`🎉 You matched with ${currentUser.team_matching_profile?.first_name || 'someone'}!`);
      } else {
        setMatchMessage('');
      }

      setTimeout(() => {
        setIndex((prev) => prev + 1);
        setSwipeDirection(null); // reset
      }, 200); // let exit animation finish
    } catch (err) {
      console.error('Swipe error:', err);
    }
  };

  const currentUser = users[index];

  return (
    <div className="min-h-screen bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover flex justify-center items-center pt-20 px-4">
      <div className="bg-[#001d4ccc] rounded-2xl p-8 w-full max-w-2xl shadow-xl space-y-6 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Find Teammates</h1>
          <button
            onClick={() => setStage('dashboard')}
            className="text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
          >
            ← Back
          </button>
        </div>

        {matchMessage && <div className="bg-green-600 p-3 rounded-lg">{matchMessage}</div>}
        {error && <div className="bg-red-600 p-3 rounded-lg">{error}</div>}

        <div className="relative h-[30rem] flex items-center justify-center">
          <AnimatePresence>
            {currentUser ? (
              <motion.div
                key={currentUser.id}
                className="absolute bg-white w-full h-full rounded-xl p-6 text-black shadow-lg overflow-y-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  x: swipeDirection === 'right' ? 200 : swipeDirection === 'left' ? -200 : 0
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x > 100) handleSwipe('right');
                  else if (info.offset.x < -100) handleSwipe('left');
                }}
              >
                <SwipeCard user={currentUser} />
              </motion.div>
            ) : (
              <div className="text-center text-white text-lg font-semibold">
                No more users to show 🎉
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between gap-4">
          <button
            onClick={() => handleSwipe('left')}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold text-xl"
            disabled={!currentUser}
          >
            👎
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold text-xl"
            disabled={!currentUser}
          >
            👍
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeamMatchingSwipe;
