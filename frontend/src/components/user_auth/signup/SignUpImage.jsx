import React, { useState } from 'react';
import { Typography, Grid } from '@material-ui/core';
import GlowButton from '../../ui/GlowButton';
import '../../../stylesheets/user_auth.css';

const COLORS = ['#061A40', '#FAC013', '#C84630', '#57A773', '#bd2df1', '#2d99e0'];

const ColorPicker = ({ label, onSelect }) => (
  <div className="flex flex-col items-center justify-center">
    <p className="text-hopBlue font-bold text-xl" style={{ fontVariant: 'small-caps' }}>
      {label}
    </p>
    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
      {COLORS.map((color) => (
        <div
          key={color + label}
          className="color-select"
          style={{ backgroundColor: color }}
          tabIndex="0"
          onClick={onSelect ? () => onSelect(color) : undefined}
        />
      ))}
    </div>
  </div>
);

export default function SignUpProfile({
  isMobile,
  profileSubmitMsg,
  enabledButton,
  handleImageNext,
  handleImageBack
}) {
  const [backgroundColor, setBackgroundColor] = useState('#234acb');

  return (
    <div>
      <p
        className="font-bold text-white text-xl text-center mb-12"
        style={{ fontVariant: 'small-caps' }}
      >
        4. Build a Bird - this will be your profile picture!
      </p>
      <Grid container spacing={isMobile ? 2 : 5} />

      <Typography className="card-text-red">{profileSubmitMsg}</Typography>

      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <ColorPicker label="bird color" />
        <ColorPicker label="background color" onSelect={setBackgroundColor} />
      </div>

      <div className="w-full flex flex-col items-center justify-center m-5">
        <p className="text-hopBlue font-bold text-xl" style={{ fontVariant: 'small-caps' }}>
          Your Bird
        </p>
        <img
          src="https://hophacks-website.s3.amazonaws.com/images/bluejaytransparentbkgd.svg"
          alt="Transparent Bluejay"
          style={{
            border: '8px solid',
            borderRadius: '20px',
            width: '50%',
            borderColor: '#ffffff',
            backgroundColor
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <ColorPicker label="hats" />
        <ColorPicker label="shoes" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <GlowButton onClick={handleImageBack} variant="secondary" disabled={!enabledButton}>
          Back
        </GlowButton>
        <GlowButton onClick={handleImageNext} disabled={!enabledButton}>
          Next
        </GlowButton>
      </div>
    </div>
  );
}
