import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';


const Nav = function Nav(props) {
    let history = useHistory();
    async function handleLogout() {
        await props.logout();
        history.push("/");
    }

    return (
        <AppBar position="static">
          <Toolbar>
            <Button component={Link} to={'/'} color="inherit">Home</Button>
            
            {props.isLoggedIn && 
              <Button component={Link} to={'/'} color="inherit">Profile</Button>
            }
            
            {props.isLoggedIn && 
              <Button onClick={handleLogout} color="inherit">Logout</Button>
            }
          </Toolbar>
        </AppBar>);
}

export default Nav;
