import React, { useState } from 'react';
import '../../stylesheets/winner.css';

const Winner = () => {
  const [carousel, setCarousel] = useState(0);

  return <div className='winnerMain'>
    <div className="top">
      <div className="second">
      <img src="/images/second.svg" alt="Winner" className="winnerBanner" />

        <h1>arxiv paper reference helper</h1>
      </div>
      <div className="first" style={{marginTop: "0px"}}>
        <img src="/images/first.svg" alt="Winner" className="winnerBanner" />
        <h1>Majestic Signs</h1>
      </div>
      <div className="third">
        <img src="/images/third.svg" alt="Winner" className="winnerBanner" />
        <h1>KiwiClinical</h1>
      </div>
    </div>
    <div className="bottom">
      <h1 style={{fontSize: "30px", fontWeight: 100, margin: 0}}>some other projects that won !</h1>
      <div className="carousel">
        <div className="carouselControls">
              <button
                style={{ rotate: "90deg" }}
                className="downbutton"
                onClick={() => {
                  setCarousel((carousel - 1) % 3)
                }}
              >
                <img
                  src="/images/downchevron.png"
                  alt=""
                  className="downchevron"
                />
              </button>
          </div>
        <div style={(carousel == 0 ) ? {display: "flex"} : {display: "none"}} className="projContainer">
            <div>BGB Group Track Challenge #1</div>
            <div>BGB Group Track Challenge #2</div>
            <div>IAA Track Prize Winner</div>
        </div>
        <div style={(carousel == 1 ) ? {display: "flex"} : {display: "none"}} className="projContainer">
            <div>CBID Track Prize #1</div>
            <div>CBID Track Prize #2</div>
            <div>Patent Safety Technology Challenge</div>
        </div>
        <div style={(carousel == 2 ) ? {display: "flex"} : {display: "none"}} className="projContainer">
            <div>FFU Venture Award #1</div>
            <div>FFU Venture Award #2</div>
            <div>FFU Venture Award #3</div>
        </div>
        <div className="carouselControls">
              <button
                style={{ rotate: "-90deg" }}
                className="downbutton"
                onClick={() => {
                  setCarousel((carousel + 1) % 3)
                }}
              >
                <img
                  src="/images/downchevron.png"
                  alt=""
                  className="downchevron"
                />
              </button>
          </div>
      </div>
    </div>
  </div>;
};

export default Winner;
