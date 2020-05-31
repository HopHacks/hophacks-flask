import React from "react";
import { Link } from "react-router-dom";

import { useHistory } from "react-router-dom";

const Nav = function Nav(props) {
    let history = useHistory();
    async function handleLogout() {
        await props.logout();
        history.push("/");
    }

    return (
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            {props.isLoggedIn && <li><Link to="/profile">Profile</Link></li>}
            {props.isLoggedIn || <li><Link to="/login">Login</Link></li>}
            {props.isLoggedIn && <li><a href="/" onClick={handleLogout}>Logout</a></li>}
          </ul>
        </nav>);
}

export default Nav;
