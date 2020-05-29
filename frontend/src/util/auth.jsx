import React from "react";
import axios from "axios";
import { useEffect } from 'react'
import { useHistory } from "react-router-dom";

// Token to call apis with
let authToken;
let refreshInterval;
let refreshCounter = 0;

async function setupAuth() {
    if (!authToken) {
        await refreshToken();
    }
    
    if (refreshCounter == 0) {
        // refresh every minute
        refreshInterval = setInterval(refreshToken, 60000);
    }
    refreshCounter += 1;
}

async function cleanupAuth() {
    refreshCounter -= 1;
    if (refreshCounter == 0) {
        if (refreshInterval) clearInterval(refreshInterval);
    }
}

// Assuming we have a refresh token, ask the server for a new access token
async function refreshToken() {
    const url = '/api/auth/session/refresh';
    const response = await axios.get(url);
    authToken = response.data["access_token"];
    axios.defaults.headers.common = {'Authorization': `Bearer ${authToken}`}
    return authToken;
}

// Login to page
async function login(email, password) {
    let response = await axios.post('/api/auth/login', {
        "username": email,
        "password": password
    });

    authToken = response.data["access_token"];
    axios.defaults.headers.common = {'Authorization': `Bearer ${authToken}`}
    console.log(response)
}


// Logout by destroying our access token and telling server to remove our
// refresh token fro, DB and cookies. Redirect to Home
async function logout() {
    authToken = null;
    delete axios.defaults.headers.common["Authorization"];
    if (refreshInterval) {
        refreshCounter = 0;
        clearInterval(refreshInterval);
    }

    const url = '/api/auth/session/logout';
    try {
        await axios.get(url);
    } catch(error) {
        console.log("Error logging out, perhaps already logged out?");
    }
}

export {setupAuth, cleanupAuth, login, logout};
