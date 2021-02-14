import React from "react";
import axios from "axios";
import { useEffect, useState } from 'react';
import { Redirect } from "react-router-dom";

const AuthContext = React.createContext();

function AuthProvider (props) {
    const { children } = props;

    const [token, setToken] = useState('');

    // Can be null (haven't tried logging in with refreshToken yet)
    const [isLoggedIn, setLoggedIn] = useState(null);
    let refreshInterval;

    async function refreshToken() {
        if (isLoggedIn === false) { // false rather than null
            return;
        }

        try {
            const response = await axios.get('/api/auth/session/refresh');
            const tok = response.data["access_token"];
            axios.defaults.headers.common = {'Authorization': `Bearer ${tok}`}
            setToken(tok);
            setLoggedIn(true);
            setTimeout(refreshToken, 60000);
        } catch {
            console.log("Refresh failed");
            setLoggedIn(false);
        }
    }

    // Login to page
    async function login(email, password) {
        const response = await axios.post('/api/auth/login', {
            "username": email,
            "password": password
        });

        const tok = response.data["access_token"];
        axios.defaults.headers.common = {'Authorization': `Bearer ${tok}`}
        setToken(tok);
        setLoggedIn(true);
        setTimeout(refreshToken, 60000);

    }

    // Logout by destroying our access token and telling server to remove our
    // refresh token fro, DB and cookies. Redirect to Home
    async function logout() {
        setToken('');
        setLoggedIn(false);
        delete axios.defaults.headers.common["Authorization"];
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }

        const url = '/api/auth/session/logout';
        try {
            await axios.get(url);
        } catch(error) {
            console.log("Error logging out, perhaps already logged out?");
        }
    }

    useEffect(() => {
        refreshToken();
    }, []);


    return (
        <AuthContext.Provider value={{isLoggedIn, login, logout}
        }
            >
            {children}
        </AuthContext.Provider>
    )
}

/* Higher Order Components */

function withAuthProps(WrappedComponent) {
    return function(props) {
        return (
            <AuthContext.Consumer>
            { (auth) => {
                const {isLoggedIn, login, logout} = auth;
                
                return (<WrappedComponent 
                    isLoggedIn={isLoggedIn}
                    login={auth.login}
                    logout={auth.logout}
                    {...props}
                />)
            }}
            </AuthContext.Consumer>

        );
    }
}

function withAuth(WrappedComponent) {
    function CheckAdmin (props) {
        return (
            <div>
                {props.isLoggedIn === null ? <p>Checking login...</p>
                : (props.isLoggedIn === false ? <Redirect to="/login"/>
                : <WrappedComponent {...props}/>)}
            </div>
        );
    };

    return CheckAdmin;
};

function withAdminAuth(WrappedComponent) {
    function HandleAdmin(props) {
        const [isAdmin, setIsAdmin] = useState();

        async function checkAdmin() {
            try {
                await axios.get("/api/admin/");
                setIsAdmin(true);
            } catch(e) {
                setIsAdmin(false);
            }
        };

        useEffect(() => {
            checkAdmin();
        }, [props.isLoggedIn])

        return (
         <div>
            {isAdmin === null ? <p></p>
             : (isAdmin === false ? <Redirect to="/"/>
             : <WrappedComponent {...props}/>)}
         </div>
        );
    };

    return HandleAdmin;
}

export {AuthProvider, withAuthProps, withAuth, withAdminAuth};
