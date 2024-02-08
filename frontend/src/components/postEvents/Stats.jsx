import React from 'react';
import '../../stylesheets/stats.css';

const Stats = () => {
  return (
    <div className='main'>
      <div className='column' style={{flexGrow: 3}}>
        <div className='horiBox'>fff</div>
        <div className='horiBox' style={{flexGrow: 2}}>fff</div>
        <div className='horiBoxEmpty'>
            <div className='verBox'>fff</div>
            <div className='verBox'>fff</div>
        </div>
      </div>
      <div className='column' style={{flexGrow: 3}}>
      <div className='horiBox'>fff</div>
        <div className='horiBox' style={{flexGrow: 2, padding: 0}}>
            <div className='mainStat'>
                fff
            </div>
        </div>
        <div className='horiBox'>fff</div>
      </div>
      <div className='column' >
        <div className='horiBox' >fff</div>
        <div className='horiBoxEmpty' style={{flexGrow: 3}}>
            <div className='verBox'>fff</div>
            <div className='verBox'>fff</div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
