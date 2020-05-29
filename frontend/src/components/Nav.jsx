import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { setupAuth, logout } from "../util/auth"

import {
    useHistory
} from "react-router-dom";

const Nav = function Nav() {
    const [loggedIn, setLoggedIn] = useState('');
    let history = useHistory();

    async function setup() {
        try {
            // Note this will setup axios to use auth header.
            await setupAuth();
            setLoggedIn(true);
        } catch (error) {
            setLoggedIn(false);
        }
    }

    async function handleLogout() {
        setLoggedIn(false);
        await logout();
        history.push("/");
    }


    useEffect(() => {
        setup();
    }, []);

    return (
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            {loggedIn && <li><Link to="/profile">Profile</Link></li>}
            {loggedIn || <li><Link to="/login">Login</Link></li>}
            {loggedIn && <li><a onClick={handleLogout}>Logout</a></li>}
          </ul>
        </nav>);
}

export default Nav;
