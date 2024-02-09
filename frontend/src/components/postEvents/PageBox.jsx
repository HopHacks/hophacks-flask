import React from 'react'
import '../../stylesheets/postevents.css';
import Stats from './Stats';

const PageBox = (props) => {
  return (
    <div className="fullscreen">
        {props.text}
        <>
        {(props.num == "3") ? <Stats /> : <></>}
        </>
        
    </div>
  )
}

export default PageBox