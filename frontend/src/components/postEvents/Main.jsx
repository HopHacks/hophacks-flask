import React, { useState,useEffect } from 'react'
import PageBox from './PageBox'
import '../../stylesheets/postevents.css';

const Main = () => {
  const [activeLoc, setActiveLoc] = useState(1);

  // scrolling sets the active location and scrolls to the next page

  function scrollHandler(e) {
    if(document.documentElement.scrollTop % document.documentElement.clientHeight == 0){
      if(activeLoc + 1 == document.documentElement.scrollTop / document.documentElement.clientHeight + 1 || activeLoc - 1 == document.documentElement.scrollTop / document.documentElement.clientHeight + 1){
        setActiveLoc(document.documentElement.scrollTop / document.documentElement.clientHeight + 1);
        location.href = '#' + (document.documentElement.scrollTop / document.documentElement.clientHeight + 1) ;
      }
      else {
        location.href = '#' + (activeLoc);
      }
    }

  }

  useEffect(()  => {
    scrollHandler();
    document.addEventListener('scrollend', scrollHandler);
  },[]);

  return (
    <>
    {/* up button */}
    {activeLoc != 1 ? (
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
          // an empty box for positioning
          <div className="down"></div>
        )}

        {/*content*/}
        <PageBox activeLoc={activeLoc} num="1"/>
        <PageBox activeLoc={activeLoc} num="2"/>
        <PageBox activeLoc={activeLoc} num="3"/>

        <PageBox activeLoc={activeLoc} num="4" text='just some cool things about this year '/>
        <PageBox activeLoc={activeLoc} num="5" text='here are some of the spectacular projects that won ! '/>
        <PageBox activeLoc={activeLoc} num="6" text='and most importantly, we want to thank...'/>

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
          // an empty box for positioning
          <div className="down"></div>
        )}

    </>
  )
}

export default Main