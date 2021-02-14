import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { Typography } from "@material-ui/core";


const Nav = function Nav(props) {
    let history = useHistory();
    async function handleLogout() {
        await props.logout();
        history.push("/");
    }

    return (
        <AppBar position="static">
          <Toolbar>
            <Button component={Link} to={'/'} color="inherit">
              <Typography> Home </Typography>

            </Button>
            
            {props.isLoggedIn && 
              <Button component={Link} to={'/profile'} color="inherit">
                <Typography> Profile </Typography>
              </Button>
            }
            
            {props.isLoggedIn && 
              <Button onClick={handleLogout} color="inherit">
                <Typography>Logout</Typography>
              </Button>
            }
          </Toolbar>
        </AppBar>);
}

export default Nav;
