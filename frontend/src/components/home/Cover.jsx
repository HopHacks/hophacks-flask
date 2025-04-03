import React from 'react';
import '../../stylesheets/cover.css';

export default function Cover() {
  return (
    <section id="cover" className="cover-section">
      <div className="pageBackground">
        <div className="mainContent">
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

          {/* TODO: This is a image "button"... but not a real button */}
          {/*
          <div className={classes.tempRegisterButton}>
            <img
              src={img('register_button_alone.png')}
              //style={{ top: center(scale.current) }}
              style={{ width: '20%' }}
              alt="image_could_not_load"
              onClick={() => {
                // window.location = '/register/login';
              }}
            />
          </div>
            */}

          {/* <button> Register</button> */}
        </div>
      </div>
    </section>
  );
}
