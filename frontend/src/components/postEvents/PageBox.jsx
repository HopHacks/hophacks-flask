import React from 'react';
import '../../stylesheets/postevents.css';
import Title from './Title';
import Stats from './Stats';
import Sponsors from './Sponsors';
import EventImage from './EventImage';
import EventImage2 from './EventImage2';

const PageBox = (props) => {
  return (
    <div id={props.num} className="fullscreen">
      <>{(props.text != null) ? <h1 className='guidingText'>{props.text}</h1> : <></>}</>
      
      
      <>
        {props.num == '1' ? (
          <Title />
        ) : (
          <>{props.num == '4' ? <Stats /> : <>{props.num == '6' ? <Sponsors /> : <>{props.num == '2' ? <EventImage activeLoc={props.activeLoc}/>: <> {props.num == '3' ? <EventImage2 activeLoc={props.activeLoc}/> : <></>}</>}</>}</>}</>
        )}
      </>
    </div>
  );
};

export default PageBox;
