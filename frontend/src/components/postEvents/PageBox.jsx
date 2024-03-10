import React from 'react';
import '../../stylesheets/postevents.css';
import Title from './Title';
import Stats from './Stats';
import Sponsors from './Sponsors';
import EventImage from './EventImage';
import EventImage2 from './EventImage2';
import Winner from './Winner';
import Empty from './Empty';

const PageBox = (props) => {
  return (
    
    <div id={props.num} className="fullscreen">
      <>{(props.text != null) ? <h1 className='guidingText'>{props.text}</h1> : <></>}</>

      <>
        {props.num == '1' ? (
          <Title />
        ) : (
          <>{props.num == '4' ?
              <Stats /> : 
                <>{props.num == '6' ?
                   <Sponsors /> : 
                    <>{props.num == '2' ? 
                      <EventImage activeLoc={props.activeLoc} /> :
                        <> {props.num == '3' ?
                          <EventImage2 activeLoc={props.activeLoc} /> :
                            <>{props.num == '5' ?
                              <Winner activeLoc={props.activeLoc} /> :
                                <>{props.num == '0' ?
                                <Empty /> :
                                  <></>}</>}
                            </>}
                    </>}
                </>}
            </>}
      </>)}
      </>
      <img src="/images/title_background.png" alt="Title Background" className="background-image" />

    </div>
  );
};

export default PageBox;
