import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Login from './LoginDialog';
import '../stylesheets/email_confirm.css';

export default function EmailConfirmation(props) {
    const [message, setMessage] = useState('Confirming Email...');
    const [email, setEmail] = useState("");
    let attempted = false;
    const emailConfirmed = 'Email confirmed! You have applied to this event successfully!';
    const attemptedMsg = 'Maybe the link was old? Try logging in to request a new confirmation token.'

    async function confirm_email() {
        try {
            const response = await axios.post("/api/accounts/confirm_email", {
                'confirm_token': props.match.params.token
            });
            setEmail(response.data.email);
            setMessage(emailConfirmed);
        } catch(e) {
            setMessage(attemptedMsg);
        }
    }


    useEffect(() => {
        // Prevent from multiple tries
        if (!attempted) {
            confirm_email();
            attempted = true;
        }
    }, []);

    if (message === emailConfirmed) {
        return (<Login fromConfirmEmail={true} email={email} />)
    } else if (message === attemptedMsg) {
        return (
            <div class="container-email">
                <div className="wrapper-email">
                    <img id="graphic" src={`${process.env.PUBLIC_URL}/images/hoplogo.png`} width="100%" />
                    <h1>Oh no!</h1>
                    <h3>Sorry, something went wrong :(</h3>
                    <h6>{message}</h6>
                </div>
            </div>
        )
    }
    return (
        <div class="container-email">
            <div className="wrapper-email">
                <h5>{message}</h5>
            </div>
        </div>
    )
}
