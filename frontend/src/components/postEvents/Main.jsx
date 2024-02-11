import React, { useState } from 'react'
import PageBox from './PageBox'
import '../../stylesheets/postevents.css';

const Main = () => {
  const [activeLoc, setActiveLoc] = useState(1);
  
  return (
    <>
    {/* up button */}
    {activeLoc != 0 ? (
          <div className="up">
            <button
              style={{ rotate: "180deg" }}
              className="downbutton"
              onClick={() => {
                setActiveLoc(activeLoc - 1);
                location.href= '#' + (activeLoc - 1);
              }}
            >
              <img
                src="/images/downchevron.png"
                alt="Marque logo"
                className="downchevron"
              />
            </button>
          </div>
        ) : (
          <div className="down"></div>
        )}

        {/*content*/}

        {/* <Origin /> */}
        <PageBox num="1"/>
        <PageBox num="2"/>
        <PageBox num="3"/>

        <PageBox num="4" text='just some cool things about this year '/>
        <PageBox num="5" text='here are the spectacular projects that won ! '/>
        <PageBox num="6" text='and most importantly, we want to thank...'/>

        {/*down button*/}
        {activeLoc != 6 ? (
          <div className="down">
            <button
              className="downbutton"
              onClick={() => {
                setActiveLoc(activeLoc + 1);
                location.href= '#' + (activeLoc + 1);
              }}
            >
              <img
                src="/images/downchevron.png"
                alt="Marque logo"
                className="downchevron"
              />
            </button>
          </div>
        ) : (
          <div className="down"></div>
        )}
    </>
  )
}

export default Main