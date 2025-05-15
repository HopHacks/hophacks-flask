import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../stylesheets/MatchList.css';

function MatchList() {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('/api/teammatch/matches');
        const ids = res.data;

        const userResponses = await Promise.all(
          ids.map((id) => axios.get(`/api/teammatch/user/${id}`).then((res) => res.data))
        );

        setMatches(userResponses);
      } catch (err) {
        console.error(err);
        setError('Error fetching match data');
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="match-list-container">
      <h2>Your Matches</h2>
      {error && <p className="error">{error}</p>}
      <div className="match-grid">
        {matches.map((user) => (
          <div key={user.id} className="match-card">
            <h3>
              {user.profile?.first_name} {user.profile?.last_name}
            </h3>
            <p>
              <strong>School:</strong> {user.profile?.school}
            </p>
            <p>
              <strong>Major:</strong> {user.profile?.major}
            </p>
            <p>
              <strong>Gender:</strong> {user.profile?.gender}
            </p>
            <p>
              <strong>Age:</strong> {user.profile?.age}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MatchList;
