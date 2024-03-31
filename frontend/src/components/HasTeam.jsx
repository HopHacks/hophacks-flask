import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import '../stylesheets/teammatch.css';

export default function HasTeam() {
  const [answerSelected, setAnswerSelected] = useState(false);
  return (
    <div className='mainBg'>
      <h3 className='hiText'>
        Hi there ____ ! <br></br> It is your first time on the <span className='emphasisYellow'>team matching</span> page! <br></br> Do you
        already have a team?
      </h3>
      <div className='buttonDiv'>
        <div className='inputDiv'>
          <input name="radio" type="radio" id="YES" className='dot'/>
          <label class="labell" for="YES">yep!</label>
        </div>
        <div className="inputDiv">
          <input name="radio" type="radio" id="NO" className='dot'/>
          <label class="labell" for="NO">not yet...</label>
        </div>

      </div>
    </div>
  );
}
