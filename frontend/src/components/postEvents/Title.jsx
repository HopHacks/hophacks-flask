import React from 'react';
import '../../stylesheets/title.css';

const Title = () => {
  return (
    <div className="title">
      <img src="/images/title_background.png" alt="Title Background" className="background-image" />
      <div className="centered-number-outline">2023</div>
      <div className="centered-number">2023</div>
    </div>
  );
};

export default Title;