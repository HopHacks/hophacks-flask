import axios from "axios";
import React, {useState, useEffect} from "react";

import { withAdminAuth } from "../util/auth";

const Blacklist = function Blacklist(props){

    const [usersList, setUsersList] = useState([]);
    const [email, setEmail] = useState("");

    async function getBlackList() {

        if(props.isLoggedIn == true){
            const response = await axios.get('/api/admin/blacklist');
            setUsersList(response.data.usernames);
        }
        else{
            return;
            alert("Not logged")
        }

    }

    async function addBlackList(){
        
        try{
            await axios.post('/api/admin/blacklist/add', {
                "username": email});
        }
        catch(e){
            alert("Failed");
        }

    }

    async function removeBlackList(){
        try{
            await axios.post('/api/admin/blacklist/remove', {
                "username": email});
        }
        catch(e){
            alert("Failed");
        }

    }

    // prevents infinite looping?
    useEffect(() => {
        getBlackList();
    }, [props.isLoggedIn]);

    // needs unique key, so just make it the username
    const listItems = usersList.map((user) => <li key = {user}>{user}</li>);

    var state = ""

    async function submit(event) {

        event.preventDefault();
        
        if(state == "add"){
            await addBlackList();
        }
        else{
            await removeBlackList();
        }
        
        setEmail(""); // clear input
        getBlackList();
        

        
        
    }

    return (<div> 
        
        <form onSubmit={submit}>
          <label>
            Email:
            <input
                autoFocus
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}>
                
            </input>
          </label>
            <button type="submit" onClick={() => (state = "add")}>Add</button>
            <button type="submit" onClick={() => (state = "remove")}>Remove</button>

          
        </form>
        {listItems} 
        </div>);
}

export default withAdminAuth(Blacklist);
