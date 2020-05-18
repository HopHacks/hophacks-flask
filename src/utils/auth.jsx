import React from "react";
import axios from "axios";
import { useEffect } from 'react'
import { useHistory } from "react-router-dom";

// Token to call apis with
let authToken;

function getToken() {
    return authToken;
}


// Given a component that should be protected by authentication, makes it so that
// we check for authentication, and also refresh before the token expires
// Usage is as follows:
//
// export default AuthWrapper(component);
function withAuth(WrappedComponent) {
    return function(...props) {
        let history = useHistory();

        let refreshOrRedirect = async () => {
            try {
                const token = await refreshToken();
                authToken = token;
                console.log("Refreshed Token");
            } catch(error) {
                console.log("Unable to refresh token, logging out...")
                logout();
                history.push("/");
            }
        };

        useEffect(() => {
            refreshOrRedirect();
            // Refresh every minute
            let interval = setInterval(refreshOrRedirect, 60000);

            return function cleanup() {
                clearInterval(interval);
            };
        }, [refreshOrRedirect]);



        return <WrappedComponent {...props}/>;
    };
}


// Assuming we have a refresh token, ask the server for a new access token
async function refreshToken() {
    const url = '/auth/session/refresh';
    const response = await axios.get(url);
    authToken = response.data["access_token"];
}

// Login to page
async function login(email, password) {
    let response = await axios.post('/auth/login', {
        "username": email,
        "password": password
    });

    authToken = response.data["access_token"];
}


// Logout by destroying our access token and telling server to remove our
// refresh token fro, DB and cookies. Redirect to Home
async function logout() {
    authToken = null;

    const url = '/auth/session/logout';
    try {
        await axios.get(url);
    } catch(error) {
        console.log("Error logging out, perhaps already logged out?");
    }
}

export {login, logout, getToken, withAuth}
