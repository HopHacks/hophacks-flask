import React from 'react'
import '../../stylesheets/postevents.css';
import Stats from './Stats';
import Sponsors from './Sponsors';

const PageBox = (props) => {
  return (
    
    <div className="fullscreen">
        {props.text}
        <>
        {(props.num == "3") ? <Stats /> : <>{(props.num == "5") ? <Sponsors /> : <></>}</>}
        </>
        
    </div>
  )
}

export default PageBox