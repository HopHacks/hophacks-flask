import React from 'react';

function img() {
  // TODO: replace with animated
  return 'https://hophacks-website.s3.amazonaws.com/images/homepage-desktop.png';
}

export default function Cover() {
  return (
    <div>
      <div>
        <img
          src={img()}
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
