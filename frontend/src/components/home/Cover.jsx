import React from 'react';

function img(url) {
  return process.env.PUBLIC_URL + '/images/' + url;
}

export default function Cover() {
  return (
    <div>
      <div>
        <img
          src={img('cover2.png')}
          style={{
            width: '100vw'
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
