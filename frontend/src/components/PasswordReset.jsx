import React, { useState } from "react";

import axios from 'axios';

export default function PasswordReset(props) {
    const [message, setMessage] = useState('');
    const [attempted, setAttempted] = useState(false);
    const [password, setPassword] = useState('');

    async function reset_password(event) {
        event.preventDefault();
        try {
            const response = await axios.post("/api/accounts/reset_password", {
                'reset_token': props.match.params.token,
                'password': password
            });
            setMessage('Password reset successfully!');
        } catch(e) {
            setMessage('Unable to reset password');
        }
        setAttempted(true);
    }


    return (
        <div>
            {attempted ||
            <form onSubmit={reset_password}>
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
            }
            <p>{message}</p>
        </div>);}
