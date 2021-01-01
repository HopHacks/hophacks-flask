import axios from "axios";
import React, {useState, useEffect} from "react";

// problem (?): when looking at HTTP requests in browser, it says POST requests for add/remove get cancelled

export default function Blacklist(){

    const [usersList, setUsersList] = useState([]);
    const [email, setEmail] = useState("");
    async function getBlackList() {
        const response = await axios.get('/api/admin/blacklist');
        setUsersList(response.data.usernames);


    }

    async function addBlackList(){

        const response = await axios.post('/api/admin/blacklist/add', {
            "username": email});

    }

    async function removeBlackList(){
        

        const response = await axios.post('/api/admin/blacklist/remove', {
            "username": email});

    }

    // prevents infinite looping?
    useEffect(() => {
        getBlackList();
    }, []);

    // needs unique key, so just make it the username
    const listItems = usersList.map((user) => <li key = {user}>{user}</li>);

    var state = ""

    async function submit() {
        
        if(state == "add"){
            addBlackList();
        }
        else{
            removeBlackList();
        }
        
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
};