import React, { useEffect, useRef } from 'react'
import '../../stylesheets/eventimage.css';

const EventImage = (props) => {
  const memoriesText = useRef();
  const image1 = useRef();
  const image2 = useRef();
  const image3 = useRef();

  useEffect(() => {
    if(props.activeLoc == 2){
      memoriesText.current.style.marginLeft = "0px";
      image1.current.style.opacity = 1;
      image2.current.style.opacity = 1;
      image3.current.style.opacity = 1;
    }
  }, [memoriesText, props.activeLoc]);

  return (
    <div className='main'>
        <div className='left'>
            <img style={{ transition: "opacity 3s 0.25s" }}  src='images/event1.jpeg' className='eventimg1 img1' ref={image1}/>
            <img style={{ transition: "opacity 3s 0.5s" }} src='images/event2.jpeg' className='eventimg1 img2' ref={image2}/>
            <img style={{ transition: "opacity 3s 0.75s" }} src='images/event3.jpeg' className='eventimg1 img3' ref={image3}/>
        </div>
        <div className='right'>
        <h1 style={{ transition: "margin-left 3s .5s" }} className='memories' ref={memoriesText}>memories were <br />made...</h1>

        </div>
    </div>
  )
}

export default EventImage