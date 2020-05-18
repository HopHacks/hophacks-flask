import axios from "axios";

// Token to call apis with
let authToken;

function getToken() {
    return authToken
}


// Given a component that should be protected by authentication, makes it so that
// we check for authentication, and also refresh before the token expires
// Usage is as follows:
//
// export default AuthWrapper(component);
function AuthWrapper(component) {

}


// Assuming we have a refresh token, ask the server for a new access token
async function refreshToken() {
    const url = '/auth/session/refresh';

    try {
        const response = await axios.get(url);
        authToken = response.data["access_token"];


    } catch(error) {
        // If unable to refresh, logout and return to main
        alert("Unable to refresh session, logging out")
        logout();
    }
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
        const response = await axios.get(url);
    } catch(error) {
        console.log("Error logging out, perhaps already logged out?");
    }
}

export {login, logout, getToken, AuthWrapper}
