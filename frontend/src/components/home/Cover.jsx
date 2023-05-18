import React from 'react';

function img(url) {
  return process.env.PUBLIC_URL + '/images/' + url;
}

export default function Cover() {
  if (window.innerWidth <= 650) {
    return (
      <div>
        <div>
          <img
            src={img('team-page.png')}
            style={{
              position: 'absolute',
              top: '7.5%',
              left: '0%',
              width: '100%'
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          ></div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div>
          <img
            src={img('cover2.png')}
            style={{
              position: 'absolute',
              top: '0%',
              left: '0%',
              width: '100%',
              height: '100%'
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          ></div>
        </div>
      </div>
    );
  }
}
