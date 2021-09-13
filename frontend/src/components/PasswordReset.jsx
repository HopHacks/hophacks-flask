import React, { useState } from "react";

import axios from 'axios';
import Card from '@material-ui/core/Card';
import { Container } from '@material-ui/core';

export default function PasswordReset(props) {
    const [message, setMessage] = useState('');
    const [attempted, setAttempted] = useState(false);
    const [password, setPassword] = useState('');

    async function reset_password(event) {
        event.preventDefault();

        const passwordre = /^(?=.*[0-9])(?=.*[!@#$%^&*)(+=._-])[a-zA-Z0-9!@#$%^&*)(+=._-]{6,25}$/;

        if (!password.match(passwordre)) {
            setMessage("Please enter a password between 7 to 25 characters which contain at least one numeric digit and a special character")
            return;
        }

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
        <Container fixed>
            <Card style={{ backgroundColor: "#d1e9ff"}}>
            <div>
            {attempted ||
            <form onSubmit={reset_password}>
              <label>
                New Password:
                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                />
              </label>
              <input type="submit" value="Submit" />
            </form>
            }
            <p style={{ color: "red" }}>{message}</p>
            </div>
            </Card>
        </Container>
        );
    }
