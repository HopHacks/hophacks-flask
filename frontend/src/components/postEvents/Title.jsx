import React, { useEffect, useRef } from 'react';
import '../../stylesheets/title.css';

const Title = () => {
  const number = useRef();
  const background = useRef();
  const scrollText = useRef();

  useEffect(() => {
    number.current.style.opacity = 1;
    background.current.style.opacity = 1;
    scrollText.current.style.opacity = 1;
  }, [number]);

  return (
    <div className="title">
      <img style={{ transition: "opacity 3s" }} src="/images/title_background.png" alt="Title Background" className="background-image" ref={background} />
      {/* <div className="centered-number-outline">2023</div> */}
      <div className='titleDiv'>
        <div style={{ transition: "opacity 3s 0.5s" }} className="centered-number" ref={number}>2023</div>
        <h1 style={{ transition: "opacity 3s 1s" }} className='scrollText' ref={scrollText}>scroll down to jump into the past !</h1>
      </div>
    </div>
  );
};

export default Title;