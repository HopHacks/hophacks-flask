import React, { useState,useEffect } from 'react'
import PageBox from './PageBox'
import '../../stylesheets/postevents.css';
import { useParallax } from 'react-scroll-parallax';
const Main = () => {
  const [activeLoc, setActiveLoc] = useState(1);

  
  return (

    <>
    
    <>
              {/*content*/}
        <PageBox activeLoc={activeLoc} num="1"/>
        <PageBox activeLoc={activeLoc} num="2"/>
        <PageBox activeLoc={activeLoc} num="3"/>

        <PageBox activeLoc={activeLoc} num="4" text='just some cool things about this year '/>
        <PageBox activeLoc={activeLoc} num="5" text='here are some of the spectacular projects that won ! '/>
        <PageBox activeLoc={activeLoc} num="6" text='and most importantly, we want to thank...'/>

    </>

    </>
  )
}

export default Main