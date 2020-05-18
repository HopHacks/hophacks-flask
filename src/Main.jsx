import React, { useState } from "react";
import axios from "axios";

export default function Login() {
    /** can you update these three states when the user is loggedin/logged out? */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        axios.post('/auth', {
        	"username": email,
        	"password": password
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          }
        );
    }

    function checkUsername(event) {
        axios.get('/protected')
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          }
        );
    }

    return (
      <div className="Hophacks">
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
                autoFocus
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="text"
            />
          </label>
          <label>
            Password:
            <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
            />
          </label>
          <input type="submit" value="Submit" />
        </form>


        <button onClick={checkUsername}>check login</button>
      </div>
    );

}
