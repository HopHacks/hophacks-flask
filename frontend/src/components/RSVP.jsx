import axios from "axios";
import React, {useState, useEffect} from "react";
import {withAuth} from "../util/auth.jsx";
import { Link } from "react-router-dom";

const RSVP = function RSVP(props){

    const [allList, setAllList] = useState([]); // list of all events user was accepted to
    const [rsvpList, setRsvpList] = useState([]); // list of events user has RSVPed to

    // display list of events the user was accepted to
    async function viewEvents(){

        if(props.isLoggedIn == true){
            const response = await axios.get("/api/registrations/rsvp/view");
            setAllList(response.data.allList);
            setRsvpList(response.data.rsvpList)
        }
        else{
            alert("Not logged in"); 
            return;
        }

    }


    async function rsvp(event){
        try{
            await axios.post("/api/registrations/rsvp/rsvp", {"event":event});
        }
        catch(e){
            // maybe TODO: more descriptive error messages depending on error code?
            alert("Failed");
        }

        viewEvents();
    }

    async function cancel(event){

        try{
            await axios.post("/api/registrations/rsvp/cancel", {"event":event});
        }
        catch(e){
            alert("Failed");
        }

        viewEvents();

    }

    // display asterisk next to event if user has already RSVPed to it
    // someone better at frontend/design should make a checkbox or highlight in green if user has RSVPed, instead of asterisk
    const events = allList.map((renderEvent) => {
        // check if user has RSVPed to event
        if(rsvpList.includes(renderEvent)){
            // if user has RSVPed to event, clicking the link will cancel it
            return <li key = {renderEvent}> <Link onClick = {()=>cancel(renderEvent)}>{renderEvent} </Link>*</li>    
        }
        else{
            // if user has not RSVPed to event, clicking the link will RSVP
            return <li key = {renderEvent}><Link onClick = {()=>rsvp(renderEvent)}>{renderEvent} </Link></li>    
        }

    }
    
    );

    useEffect(() => {
        viewEvents();
    }, [props.isLoggedIn]);


    return (<div>{events}</div>);

}

export default withAuth(RSVP);
