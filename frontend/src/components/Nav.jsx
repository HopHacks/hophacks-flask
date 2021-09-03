import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { Typography } from "@material-ui/core";
import { withAuthProps } from '../util/auth';
import Login from './LoginDialog';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({

  title: {
    fontFamily: "VCR OSD Mono",
  },

  hophacksButton:{
    marginLeft: 20,
    marginRight: 20,
  },

  otherButton:{
    marginLeft:"auto",
  },
});

const Nav = function Nav(props) {
  let history = useHistory();
  async function handleLogout() {
    await props.logout();
    history.push("/");
  }

  const classes = useStyles();

  return (
    <AppBar position="sticky">
      <Toolbar style={{  flexDirection: 'row', justifyContent: 'flex-end', marginRight: '8rem' }}>
        <Button component={Link} to={'/'} color="inherit" className={classes.hophacksButton}>
          <Typography variant="h4" className={classes.title}> HopHacks </Typography>
        </Button>

        <section className={classes.otherButton}>
        <Button component={Link} to={'/'} color="inherit">
          <Typography variant="h5" className={classes.title}> Home </Typography>
        </Button>

        {!props.isLoggedIn && <Login />
        }

        {!props.isLoggedIn && 
          <Button component={Link} to={'/register'} color="inherit">
            <Typography variant="h5" className={classes.title}> Apply </Typography>
          </Button>

        }

        {props.isLoggedIn &&
          <Button component={Link} to={'/profile'} color="inherit">
            <Typography variant="h5" className={classes.title}> Profile </Typography>
          </Button>
        }

        {props.isLoggedIn &&
          <Button onClick={handleLogout} color="inherit">
            <Typography variant="h5" className={classes.title}>Logout</Typography>
          </Button>
        }
        </section>        
      </Toolbar>
    </AppBar>
    );
}

export default withAuthProps(Nav);
