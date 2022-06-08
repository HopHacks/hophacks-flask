import axios from "axios";
import React, {useState, useEffect} from "react";
import {withAuthCheck} from "../util/auth.jsx";
import { Link } from "react-router-dom";

const Events = function Events(props){

    
    const [eventsList, setEventsList] = useState([]); // list of events
    const[eventToAdd, setEventToAdd] = useState("")
    const[startDateToAdd, setStartDateToAdd] = useState("")
    const[endDateToAdd, setEndDateToAdd] = useState("")

    // display list of events 
    async function viewEvents(){

        if(props.isLoggedIn == true){
            const response = await axios.get("/api/admin/events");
            setEventsList(response.data.eventsList);
        }
        else{
            alert("Not logged in"); 
            return;
        }

    }


    async function add(eventName, startDate, endDate){
        try{
            await axios.post("/api/admin/events/add", {"eventName":eventName, "startDate": startDate, "endDate":endDate});
        }
        catch(e){
            // maybe TODO: more descriptive error messages depending on error code?
            alert("Failed");
        }

        viewEvents();
    }

    async function remove(eventName){

        try{
            await axios.post("/api/admin/events/remove", {"eventName":eventName});
        }
        catch(e){
            alert("Failed");
        }

        viewEvents();

    }

    async function submitHandle(e) {

        e.preventDefault();
        
        add(eventToAdd, startDateToAdd, endDateToAdd);
        

    }


    // display asterisk next to event if user has already RSVPed to it
    // someone better at frontend/design should make a checkbox or highlight in green if user has RSVPed, instead of asterisk
    const events = eventsList.map((event) => <tr key={event._id}><td>{event.eventName}</td> <td>{event.startDate} </td> <td> {event.endDate} </td> <Link onClick = {()=>remove(event.eventName)}>Remove </Link></tr>);
    



    useEffect(() => {
        viewEvents();
    }, [props.isLoggedIn]);


    return (
    <div>

        <form onSubmit={submitHandle}>
            <label>
                Enter event name: 

            <input type = "text" value = {eventToAdd} onChange = {e => setEventToAdd(e.target.value)}>

                </input>

                <br></br>
                </label>

            <label>
                Enter start date: 
            <input type = "text" value = {startDateToAdd} onChange = {e => setStartDateToAdd(e.target.value)}>

                

            </input>
            </label>
            <br></br>
            <label>
                Enter start date:
            <input type = "text" value = {endDateToAdd} onChange = {e => setEndDateToAdd(e.target.value)}>
            </input>

            </label>

            <br></br>
            

            <button type = "sbumit"> Add </button>
            </form>
    
    <table><tr> <th> Event Name</th> <th> Start Date</th> <th> End Date</th> </tr>{events}</table>)
    
    
    
    </div>);

}

export default withAuthCheck(Events);
