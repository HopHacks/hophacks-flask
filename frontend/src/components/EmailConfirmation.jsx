import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './register/Login';
import '../stylesheets/email_confirm.css';

function img(url) {
  return 'https://hophacks-website.s3.amazonaws.com' + '/images/' + url;
}

export default function EmailConfirmation(props) {
  const [message, setMessage] = useState('Confirming Email...');
  const [email, setEmail] = useState('');
  let attempted = false;
  const emailConfirmed = 'Email confirmed! You have applied to this event successfully!';
  const attemptedMsg = 'Maybe the link is old? Try logging in.';

  async function confirm_email() {
    try {
      const response = await axios.post('/api/accounts/confirm_email', {
        confirm_token: props.match.params.token
      });
      setEmail(response.data.email);
      setMessage(emailConfirmed);
    } catch (e) {
      setMessage(attemptedMsg);
    }
  }

  useEffect(() => {
    // Prevent from multiple tries
    if (!attempted) {
      confirm_email();
      attempted = true;
    }
  }, []);

  if (message === emailConfirmed) {
    return <Login fromConfirmEmail={true} email={email} />;
  } else if (message === attemptedMsg) {
    return (
      <div
      //className="container-email"
      // style={{
      //   backgroundImage: `url("https://hophacks-website.s3.amazonaws.com/images/404.png")`,
      //   //backgroundSize: 'cover',
      //   width: '100vw'
      // }}
      >
        <img
          src={img('404.png')}
          //style={{ top: center(scale.current) }}
          style={{
            //backgroundImage: `url("https://hophacks-website.s3.amazonaws.com/images/404.png")`,
            //backgroundSize: 'cover',
            //height: '100vh',
            position: 'absolute',
            width: '100vw'
          }}
          alt="image_could_not_load"
        />
        <div style={{ width: '50%', marginLeft: '55%', marginTop: '18%', position: 'absolute' }}>
          <h1 style={{ textAlign: 'left' }}>OOPS 404!</h1>
          <h3 style={{ textAlign: 'left' }}>Lost in the Hackathon Maze!</h3>
          <h3 style={{ textAlign: 'left' }}>Seems like the guitar strings got tangled!</h3>
          <h3 style={{ textAlign: 'left' }}>try logging in once more</h3>
        </div>
      </div>
    );
  }
  return (
    <div
      className="container-email"
      style={{
        backgroundImage: `url("https://hophacks-website.s3.amazonaws.com/images/404.png")`,
        backgroundSize: 'cover',
        height: '100vh'
      }}
    >
      <div style={{ width: '50%', float: 'right', top: '30%' }}>
        <h1 style={{ textAlign: 'left' }}>OOPS 404!</h1>
        <h3 style={{ textAlign: 'left' }}>Lost in the Hackathon Maze!</h3>
        <h3 style={{ textAlign: 'left' }}>Seems like the guitar strings got tangled!</h3>
        <h3 style={{ textAlign: 'left' }}>try logging in once more</h3>
      </div>
    </div>
  );
}
