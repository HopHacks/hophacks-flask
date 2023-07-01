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
    if (window.innerWidth <= 850) {
      return (
        <div>
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
          <div style={{ width: '50%', marginLeft: '55%', marginTop: '12%', position: 'absolute' }}>
            <h1
              style={{
                textAlign: 'left',
                font: 'inter',
                fontSize: '30px',
                fontWeight: 'bold',
                fontStyle: 'italic'
              }}
            >
              {'OOPS 404...'}
            </h1>
            <p style={{ textAlign: 'left', font: 'inter', fontSize: '15px', fontStyle: 'italic' }}>
              Lost in the Hackathon Maze!
            </p>
            <p style={{ textAlign: 'left', font: 'inter', fontSize: '15px', fontStyle: 'italic' }}>
              Seems like the guitar strings got tangled
            </p>
            <p style={{ textAlign: 'left', font: 'inter', fontSize: '15px', fontStyle: 'italic' }}>
              Try logging in once more!
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div>
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
            <h1
              style={{
                textAlign: 'left',
                font: 'inter',
                fontSize: '50px',
                fontWeight: 'bold',
                fontStyle: 'italic'
              }}
            >
              {'OOPS 404...'}
            </h1>
            <p style={{ textAlign: 'left', font: 'inter', fontSize: '25px', fontStyle: 'italic' }}>
              Lost in the Hackathon Maze!
            </p>
            <p style={{ textAlign: 'left', font: 'inter', fontSize: '25px', fontStyle: 'italic' }}>
              Seems like the guitar strings got tangled
            </p>
            <p style={{ textAlign: 'left', font: 'inter', fontSize: '25px', fontStyle: 'italic' }}>
              Try logging in once more!
            </p>
          </div>
        </div>
      );
    }
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
        <h1
          style={{
            textAlign: 'left',
            font: 'inter',
            fontSize: '50px',
            fontWeight: 'bold',
            fontStyle: 'italic'
          }}
        >
          {'OOPS 404...'}
        </h1>
        <p style={{ textAlign: 'left', font: 'inter', fontSize: '25px', fontStyle: 'italic' }}>
          Lost in the Hackathon Maze!
        </p>
        <p style={{ textAlign: 'left', font: 'inter', fontSize: '25px', fontStyle: 'italic' }}>
          Seems like the guitar strings got tangled
        </p>
        <p style={{ textAlign: 'left', font: 'inter', fontSize: '25px', fontStyle: 'italic' }}>
          Try logging in once more!
        </p>
      </div>
    </div>
  );
}
