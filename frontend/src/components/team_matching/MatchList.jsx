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

        const ids = await res.json();

        const userResponses = await Promise.all(
          ids.map((id) =>
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
          <div key={user.id} className="match-card">
            <h3>{user.profile?.first_name} {user.profile?.last_name}</h3>
            <p><strong>School:</strong> {user.profile?.school}</p>
            <p><strong>Major:</strong> {user.profile?.major}</p>
            <p><strong>Gender:</strong> {user.profile?.gender}</p>
            <p><strong>Age:</strong> {user.profile?.age}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MatchList;
