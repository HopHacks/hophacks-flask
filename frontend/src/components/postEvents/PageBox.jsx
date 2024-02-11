import React from 'react';
import '../../stylesheets/postevents.css';
import Title from './Title';
import Stats from './Stats';
import Sponsors from './Sponsors';
import EventImage from './EventImage';
import EventImage2 from './EventImage2';

const PageBox = (props) => {
  return (
    <div className="fullscreen">
      {props.text}
      <>
        {props.num == '1' ? (
          <Title />
        ) : (
          <>{props.num == '4' ? <Stats /> : <>{props.num == '6' ? <Sponsors /> : <>{props.num == '2' ? <EventImage />: <> {props.num == '3' ? <EventImage /> : <></>}</>}</>}</>}</>
        )}
      </>
    </div>
  );
};

export default PageBox;
