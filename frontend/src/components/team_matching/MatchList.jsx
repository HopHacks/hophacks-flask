import React, { useEffect, useState } from 'react';
import '../../stylesheets/MatchList.css';

function MatchList({ token }) {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/teammatch/matches', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch matches');

        const data = await res.json();

        // You can also fetch full user data for each ID if needed
        const userResponses = await Promise.all(
            data.map((id) =>
              fetch(`http://localhost:5000/api/teammatch/user/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }).then((res) => res.json())
            )
        );
          

        setMatches(userResponses);
      } catch (err) {
        console.error(err);
        setError('Error fetching match data');
      }
    };

    fetchMatches();
  }, [token]);

  return (
    <div className="match-list-container">
      <h2>Your Matches</h2>
      {error && <p className="error">{error}</p>}
      <div className="match-grid">
        {matches.map((user) => (
          <div key={user._id} className="match-card">
            <h3>{user.name}</h3>
            <p><strong>School:</strong> {user.school}</p>
            <p><strong>Specialty:</strong> {user.preferred_specialty}</p>
            <p><strong>Skills:</strong> {user.technical_skills.join(', ')}</p>
            <p><strong>Fav Song:</strong> {user.favorite_song}</p>
            <p><strong>Fav Show:</strong> {user.favorite_show}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MatchList;