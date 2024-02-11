import React, { useEffect, useRef } from 'react'
import '../../stylesheets/eventimage2.css';

const EventImage2 = (props) => {
    const coolText = useRef();
    const image1 = useRef();
    const image2 = useRef();
    const image3 = useRef();
    const image4 = useRef();

    useEffect(() => {
      if(props.activeLoc == 3){
        coolText.current.style.marginLeft = "100px";
        image1.current.style.opacity = 1;
        image2.current.style.opacity = 1;
        image3.current.style.opacity = 1;
        image4.current.style.opacity = 1;
      }
    }, [coolText, props.activeLoc]);

  return (
    <div className='main' >
        <div className='left2'>
            <div className='topText2'>
                <h1 style={{ transition: "margin-left 3s 0.25s" }}  className='cool' ref={coolText}>and some cool people <br />got together !</h1>
            </div>
            <div className='botImg2'>
                <img style={{objectPosition: "0 -50%", transition: "opacity 3s 0.25s"}}className="eventimage12" src="images/event4.jpeg" alt=""  ref={image1}/>
                <img style={{objectPosition: "0 100%", transition: "opacity 3s 0.25s"}} className="eventimage12" src="images/event5.jpeg" alt="" ref={image2}/>
            </div>
        </div>
        <div className='right2'>
            <img style={{objectPosition: "0 0", transition: "opacity 3s 0.5s"}} className="eventimg22" src="images/event6.jpeg" alt="" ref={image3}/>
            <img style={{objectPosition: "60% 0", transition: "opacity 3s 0.5s"}} className="eventimg22" src="images/event7.jpeg" alt="" ref={image4}/>
        </div>
    </div>
  )
}

export default EventImage2