import React, { useState } from "react";

import {login} from "../util/auth";

import {
    useHistory
} from "react-router-dom";

export default function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let history = useHistory();

    async function handleSubmit(event) {
        event.preventDefault();
        // TODO alert?
        try {
            await props.login(email, password);

            if (email !== "admin") {
                history.push("/profile")
            } else {
                history.push("/admin")
            }
        } catch(error) {
            console.log(error)
        }
    }


    return (
      <div className="Hophacks">
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
                autoFocus
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
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


      </div>
    );

}
