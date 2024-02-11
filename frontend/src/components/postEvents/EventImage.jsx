import React from 'react'
import '../../stylesheets/eventimage.css';

const EventImage = () => {
  return (
    <div id="2" className='main'>
        <div className='left'>
            <img src='images/event1.jpeg' className='eventimg1 img1'/>
            <img src='images/event2.jpeg' className='eventimg1 img2'/>
            <img src='images/event3.jpeg' className='eventimg1 img3'/>
        </div>
        <div className='right'>
        <h1 className='memories'>memories were <br />made...</h1>

        </div>
    </div>
  )
}

export default EventImage