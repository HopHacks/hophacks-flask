import React, { useState, useEffect } from 'react';

function TeamMatching() {
  const [users, setUsers] = useState([]);  // Store the potential matches
  const [error, setError] = useState(null);  // Store any error message

  // API URL for potential matches
  const API_URL = 'http://localhost:5000/api/teammatch/potential_matches';

  // Fetch potential matches when component mounts
  useEffect(() => {
    const getPotentialMatches = async () => {
      try {
        // If your API requires JWT token, include it in the headers
        const token = 'your_jwt_token_here';  // replace with actual JWT token
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch potential matches');
        }

        const data = await response.json();
        setUsers(data);  // Store fetched users in the state
      } catch (err) {
        setError('Error fetching potential matches');
        console.error(err);
      }
    };

    getPotentialMatches();
  }, []);  // The empty dependency array makes this effect run only once, when the component mounts

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Potential Matches</h1>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ color: '#333' }}>List of Potential Matches:</h2>
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          {users.length === 0 ? (
            <li style={{ textAlign: 'center' }}>No users found</li>
          ) : (
            users.map((user) => (
              <li key={user._id} style={{ background: '#f8f8f8', margin: '10px 0', padding: '10px', borderRadius: '8px' }}>
                <strong>{user.username}</strong>
                {/* Add any other details you want to display, e.g., name, skills, etc. */}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default TeamMatching;
