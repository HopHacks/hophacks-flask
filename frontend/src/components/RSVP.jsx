import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { withAuthCheck } from '../util/auth.jsx';
import Button from '@mui/material/Button';

const RSVP = function RSVP(props) {
  const [allList, setAllList] = useState([]); // list of all events user was accepted to
  const [rsvpList, setRsvpList] = useState([]); // list of events user has RSVPed to

  const myVariable = process.env.REACT_APP_BACKENDURL;

  if (myVariable != '') {
    axios.defaults.baseURL = myVariable;
  }

  // display list of events the user was accepted to
  async function viewEvents() {
    if (props.isLoggedIn == true) {
      const response = await axios.get('/api/registrations/rsvp/view');
      setAllList(response.data.allList);
      setRsvpList(response.data.rsvpList);
    } else {
      alert('Not logged in');
      return;
    }
  }

  async function rsvp(event) {
    try {
      await axios.post('/api/registrations/rsvp/rsvp', { event: event });
    } catch (e) {
      // maybe TODO: more descriptive error messages depending on error code?
      alert('Failed');
    }

    viewEvents();
  }

  async function cancel(event) {
    try {
      await axios.post('/api/registrations/rsvp/cancel', { event: event });
    } catch (e) {
      alert('Failed');
    }

    viewEvents();
  }

  // display asterisk next to event if user has already RSVPed to it
  // someone better at frontend/design should make a checkbox or highlight in green if user has RSVPed, instead of asterisk
  const events = allList.map((renderEvent) => {
    // check if user has RSVPed to event
    if (rsvpList.includes(renderEvent)) {
      // if user has RSVPed to event, clicking the link will cancel it
      return (
        <li key={renderEvent}>
          {' '}
          <Button onClick={() => cancel(renderEvent)}>{renderEvent} </Button>*
        </li>
      );
    } else {
      // if user has not RSVPed to event, clicking the link will RSVP
      return (
        <li key={renderEvent}>
          <Button onClick={() => rsvp(renderEvent)}>{renderEvent} </Button>
        </li>
      );
    }
  });

  useEffect(() => {
    viewEvents();
  }, [props.isLoggedIn]);

  return <div>{events}</div>;
};

export default withAuthCheck(RSVP);
