import React from 'react';
import { Link } from 'react-router-dom';
import '../../../stylesheets/user_auth.css';
import GlowButton from '../../ui/GlowButton';

export default function SignUpConfirmation() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <p
        className="font-bold text-white text-2xl text-center mb-10"
        style={{ fontVariant: 'small-caps' }}
      >
        We are excited to have you joining our event! Please go to your profile to finish
        registering.
      </p>
      <Link to={`/register/login`}>
        <GlowButton>Sign In</GlowButton>
      </Link>
    </div>
  );
}
