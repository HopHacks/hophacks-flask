import React from 'react';
import '../../stylesheets/stats.css';

const Stats = () => {
  return (
    <div className='main'>
      <div className='column'>
        <div className='horiBox final mainStat bgOpacity' style={{backgroundImage: "url('/images/merch.jpeg')", backgroundPositionY: "top"}}><h2 className='statText'><span style={{fontStyle: "italic"}}>beautiful</span><br />merch</h2></div>
        <div className='horiBox final' style={{flexBasis: 2, flexGrow: 2}}><h2 className='statText'><span className='number'>$3000</span><br /> in prizes</h2></div>
        <div className='horiBox' style={{flexShrink: 2}}>
            <div className='final' style={{flexBasis: 1, flexGrow: 1, }}><h2 className='statText'><span className='number'>20</span><br /> projects</h2></div>
            <div className='final' style={{flexBasis: 1, flexGrow: 1}}><h2 className='statText'><span className='number'>36</span> <br />hours </h2></div>
        </div>
      </div>
      <div className='column'>
        <div className='horiBox final'><h2 className='statText'>over <span className='number'>300</span> people </h2></div>
        <div className='horiBox final mainStat' style={{flexBasis: 2, flexGrow: 2, fontSize: "90px", padding: "45px 0 45px 0"}}>HopHacks<br />2023</div>
        <div className='horiBox final mainStat bgOpacity' style={{backgroundImage: "url('/images/granola.jpeg')"}}><h2 className='statText' style={{ fontSize: "30px"}}>at least <span style={{fontSize: "50px"}}>1</span><br /> granola demolished</h2></div>
      </div>
      <div className='column' style={{flexBasis: 2, flexGrow: 2}}>
        <div className='horiBox final'><h2 className='statText'><span className='number'>12</span><br />winners</h2></div>
        <div className='horiBox' style={{flexBasis: 2, flexGrow: 6}}>
            <div className='final' style={{flexBasis: 1, flexGrow: 1}}><h2 className='statText'><span className='number'>4</span><br />states</h2></div>
            <div className='final mainStat bgOpacityLess' style={{backgroundImage: "url('/images/smile.jpeg')", backgroundPositionX: "bottom", flexBasis: 1, flexGrow: 1}}><h2 className='statText'><br /><br />infinite <br />smiles :D</h2></div>
        </div>
      </div>
    </div>
    // <div className='main'> 


    //   <div className='column' style={{flexGrow: 3}}>
    //     <div className='horiBox'>at least 1 granola demolished</div>
    //     <div className='horiBox' style={{flexGrow: 2}}>$3000 in prizes</div>
    //     <div className='horiBoxEmpty'>
    //         <div className='verBox'>____ projects</div>
    //         <div className='verBox'>36 hours</div>
    //     </div>
    //   </div>
    //   <div className='column' style={{flexGrow: 3}}>
    //   <div className='horiBox'>over 300 people</div>
    //     <div className='horiBox' style={{flexGrow: 2, padding: 0}}>
    //         <div className='mainStat'>
    //             HopHacks 2023
    //         </div>
    //     </div>
    //     <div className='horiBox'>beautiful merch</div>
    //   </div>
    //   <div className='column' >
    //     <div className='horiBox' >___ winners</div>
    //     <div className='horiBoxEmpty' style={{flexGrow: 3}}>
    //         <div className='verBox'>___ sponsors</div>
    //         <div className='verBox'>___ of filled chalkboards</div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Stats;
