import React, { useState } from 'react';
import TeamMatchingSwipe from './TeamMatchingSwipe'
import TeamMatchingLoginPage from './TeamMatchingLoginPage';

function App() {
  const [token, setToken] = useState(null);

  return (
    <div>
      {token ? (
        <TeamMatchingSwipe token={token} />
      ) : (
        <TeamMatchingLoginPage setToken={setToken} />
      )}
    </div>
  );
}

export default App;
