import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TeamMatchingMatches({ setStage }) {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('/api/teammatch/matches');
        setMatches(res.data);
      } catch (err) {
        setError('Failed to load matches.');
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover flex justify-center items-center pt-20 px-4">
      <div className="bg-[#001d4ccc] rounded-2xl p-8 w-full max-w-2xl shadow-xl text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Matches</h1>
          <button
            onClick={() => setStage('dashboard')}
            className="text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
          >
            ← Back
          </button>
        </div>

        {error && <div className="bg-red-600 p-3 rounded-lg mb-4">{error}</div>}
        {matches.length === 0 ? (
          <div className="text-center text-lg">No matches yet. Start swiping!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matches.map((match, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-xl p-4 shadow-md"
              >
                <h2 className="text-xl font-semibold mb-1">
                  {match.first_name} {match.last_name}
                </h2>
                <p className="text-sm">{match.school}</p>
                <p className="text-sm">{match.major}</p>
                {match.graduation_year && (
                  <p className="text-sm">Class of {match.graduation_year}</p>
                )}
                {match.preferred_contact && (
                  <p className="text-sm mt-2">
                    <span className="font-medium">Preferred Contact:</span> {match.preferred_contact}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamMatchingMatches;
