import React from 'react';
import '../../stylesheets/cover.css';
import GlowButton from '../ui/GlowButton';
import { ArrowDownward } from '@material-ui/icons';

export default function Cover() {
  return (
    <div className="flex flex-col items-start px-4 text-left lg:ml-[30%] md:ml-[30%] mt-[2%] h-full">
      <div className="headerRow">
        <div className="textLine">
          <span className="larger-letter">H</span>OP
        </div>
        <img
          src="https://hophacks-website.s3.us-east-1.amazonaws.com/images/website2025/hophacks2025logo.png"
          alt="HopHacks Logo"
          className="hophacks-logo"
        />
      </div>
      <div className="headerRow">
        <div className="textLine">
          <span className="larger-letter">H</span>ACKS
        </div>
      </div>

      <div className="flex items-start font-montserrat font-bold text-[#ffe188] text-[50px] leading-[35px] tracking-[0.05em]">
        <div className="flex flex-col" style={{ fontVariant: 'small-caps' }}>
          <p>Illuminating</p>
          <p>Innovations</p>
        </div>
      </div>

      <div className="font-montserrat font-bold text-[30px] leading-[60px] tracking-[0.05em] text-white">
        September 12–14, 2025
      </div>
      <div className="flex items-center w-full py-4 gap-x-6">
        {/* LinkTree */}
        <a
          href="https://linktr.ee/hophacks"
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-block group"
        >
          {/* Circular glow only on hover */}
          <div className="absolute z-0 transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none top-1/2 left-1/2 group-hover:opacity-30">
            <div className="h-20 w-20 rounded-full bg-[#FFE194] blur-[20px]"></div>
          </div>

          <img
            src="https://hophacks-website.s3.us-east-1.amazonaws.com/images/candle.svg"
            alt="Candle"
            className="w-12 h-12"
          />
        </a>
        {/* Discord */}
        <a
          href="https://discord.gg/8V8wmCWUhH"
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-block group"
        >
          {/* Circular glow only on hover */}
          <div className="absolute z-0 transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none top-1/2 left-1/2 group-hover:opacity-30">
            <div className="h-20 w-20 rounded-full bg-[#FFE194] blur-[20px]"></div>
          </div>

          <img
            src="https://hophacks-website.s3.us-east-1.amazonaws.com/images/discord-logo.svg"
            alt="Join us on Discord"
            className="relative z-10 w-12 h-12 transition duration-300"
          />
        </a>
        <GlowButton
          style={{ padding: 5, margin: 0 }}
          className="bg-opacity-50 bg-[#E1E9F2] shadow-none"
          variant="secondary"
          onClick={() => {
            document.getElementById('register-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="flex items-center justify-center gap-1">
            Login
            <ArrowDownward />
          </div>
        </GlowButton>
      </div>
    </div>
  );
}
