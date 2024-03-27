import React, { useEffect, useRef } from 'react';
import '../../stylesheets/title.css';
import { Parallax, useParallax } from 'react-scroll-parallax';

const Title = () => {
  const number = useRef();
  const background = useRef();
  const scrollText = useRef();
  const parallax = useParallax({
    opacity: [0, 1],
  });


  return (
    <div className="title">
      <img src="/images/title_background.png" alt="Title Background" className="background-image"  />
      <div className='titleDiv'>
        <div className="centered-number">2023</div>
        <h1 ref={parallax.ref} className='scrollText'>scroll down to jump into the past !</h1>
      </div>
    </div>
  );
};

export default Title;