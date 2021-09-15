import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Typography } from '@material-ui/core';

export default function EmailConfirmation(props) {
    const [message, setMessage] = useState('Confirming Email...');
    let attempted = false;

    async function confirm_email() {
        try {
            const response = await axios.post("/api/accounts/confirm_email", {
                'confirm_token': props.match.params.token
            });
            setMessage('Email confirmed! You have applied to this event successfully!');
        } catch(e) {
            setMessage('Something went wrong :(, maybe the link was old? Try logging in to request a new confirmation token');
        }
    }


    useEffect(() => {
        // Prevent from multiple tries
        if (!attempted) {
            confirm_email();
            attempted = true;
        }
    }, []);

    return (<Typography style={{color:'white'}}>{message}</Typography>);
}
