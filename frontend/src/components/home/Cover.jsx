import React from 'react';
import '../../stylesheets/cover.css';
import GlowButton from '../ui/GlowButton';
import { ArrowDownward } from '@material-ui/icons';

export default function Cover() {
  return (
    <div className="flex flex-col items-start text-left ml-[28rem] mt-[10rem] h-full">
        <div className="headerRow">
          <div className="textLine">
            <span className="larger-letter">H</span>ACKS
          </div>
          <div className="discordbtnContainer">
            <a
              href="https://discord.gg/8V8wmCWUhH"
              target="_blank"
              rel="noopener noreferrer"
              className="discordbtn inline-block"
            >
              <button className="join-discord">Join Discord!</button>
            </a>
          </div>
        </div>

        <div className="textSubtext">
          <span className="larger-letter">I</span>LLUMINATING&nbsp;&nbsp;
          <span className="larger-letter">I</span>NNOVATIONS
        </div>

        <div className="details">September 12–14, 2025 · 250+ Hackers · 36 Hours</div>
        <div>
        <GlowButton style={{ padding: 5 }} className="bg-opacity-50 bg-[#E1E9F2]" variant='secondary'>
            <div className="flex justify-center items-center">
              Register
              <ArrowDownward />
            </div>
          </GlowButton>
        </div>
      </div>
  );
}
