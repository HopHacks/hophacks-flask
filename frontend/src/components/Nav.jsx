import React, { useState } from 'react';
import { Link } from 'react-router-dom';
//import { useHistory } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { withAuthProps } from '../util/auth';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  title: {
    fontFamily: 'Inter',
    flexGrow: 1,
    textAlign: 'center',
    color: '#F7F3FF'
  },

  hophacksButton: {
    marginLeft: 20,
    marginRight: 20
  },

  otherButton: {
    marginLeft: 'auto'
  },

  leftMostItem: {
    marginRight: 'auto', // Pushes the item to the leftmost
    marginLeft: '1rem', // Adjust this value for more space
    textTransform: 'none'
  },

  navBtn: {
    textTransform: 'none',
    margin: '0 1rem'
  },

  drawer: {
    background: '#1D539F',
    width: '100vw'
  },

  icon: {
    color: 'white'
  }
});

function img(url) {
  return 'https://hophacks-website.s3.amazonaws.com' + '/images/' + url;
}

const Nav = function Nav() {
  //props removed because not used for now, add in when needed
  /*let history = useHistory();
  async function handleLogout() {
    await props.logout();
    history.push('/');
  }*/

  const classes = useStyles();
  const isMobile = window.innerWidth <= 800;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const navItem = (
    <>
      <Button component={Link} to="/" color="inherit" className={classes.navBtn}>
        <Typography variant="h5" className={classes.title}>
          Home
        </Typography>
      </Button>

      {/* 
      <Button
        component={Link}
        onClick={() => {
          history.push('/reset_password/:token');
        }}
        color="inherit"
        className={classes.navBtn}
      >
        <Typography variant="h5" className={classes.title}>
          Reset Password?
        </Typography>
      </Button> */}

      {/* <Button
        component={Link}
        onClick={() => {
          history.push('/confirm_email/:token');
        }}
        color="inherit"
        className={classes.navBtn}
      >
        <Typography variant="h5" className={classes.title}>
          Email Confirmation
        </Typography>
      </Button> */}

      {/* <Button
        component={Link}
        onClick={() => {
          history.push('/user_auth/signup/signupimage');
        }}
        color="inherit"
        className={classes.navBtn}
      >
        <Typography variant="h5" className={classes.title}>
          SignUp Image
        </Typography>
      </Button> */}

      {/* <Button
        component={Link}
        onClick={() => (window.location = '/#schedule')}
        color="inherit"
        className={classes.navBtn}
      >
        <Typography variant="h5" className={classes.title}>
          Schedule
        </Typography>
      </Button> */}
      {/* <Button
        component={Link}
        onClick={() => (window.location = '/#prizes')}
        color="inherit"
        className={classes.navBtn}
      >
        <Typography variant="h5" className={classes.title}>
          Prizes
        </Typography>
      </Button> */}
      {/* <Button
        component={Link}
        onClick={() => (window.location = '/#tracks')}
        color="inherit"
        className={classes.navBtn}
      >
        <Typography variant="h5" className={classes.title}>
          Tracks
        </Typography>
      </Button> */}
      {/* <Button
        component={Link}
        onClick={() => (window.location = '/#sponsors')}
        color="inherit"
        className={classes.navBtn}
      >
        <Typography variant="h5" className={classes.title}>
          Sponsors
        </Typography>
      </Button> */}
      {/* <Button
        component={Link}
        onClick={() => (window.location = '/#faq')}
        color="inherit"
        className={classes.navBtn}
      >
        <Typography variant="h5" className={classes.title}>
          FAQ
        </Typography>
      </Button> */}
      <Button
        component={Link}
        to="/team" //{history.push('/team')}
        color="inherit"
        className={classes.navBtn}
      >
        <Typography variant="h5" className={classes.title}>
          Organizers
        </Typography>
      </Button>
      {/*}
      <Button component={Link} to="/teamMatching" color="inherit" className={classes.navBtn}>
        <Typography variant="h5" className={classes.title}>
          Team Matching
        </Typography>
      </Button>
      {!props.isLoggedIn && (
        <Button
          onClick={() => {
            window.location = '/register/login';
          }}
          color="inherit"
          className={classes.navBtn}
        >
          <Typography variant="h5" className={classes.title}>
            Login
          </Typography>
        </Button>
      )}

      {props.isLoggedIn && (
        <Button
          onClick={() => {
            window.location = '/profile';
          }}
          color="inherit"
          className={classes.navBtn}
        >
          <Typography variant="h5" className={classes.title}>
            Profile
          </Typography>
        </Button>
      )}

      {props.isLoggedIn && (
        <Button onClick={handleLogout} color="inherit" className={classes.navBtn}>
          <Typography variant="h5" className={classes.title}>
            Logout
          </Typography>
        </Button>
      )}*/}
    </>
  );

  if (isMobile) {
    return (
      <div>
        <AppBar position="sticky" className={classes.drawer}>
          <Toolbar style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <section>
              <Button component={Link} to={'/'} color="inherit">
                <img src={img('logo2023.png')} width={'55px'} />
              </Button>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setIsDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                classes={{ paper: classes.drawer }}
              >
                <div>
                  <IconButton onClick={handleDrawerClose} className={classes.icon}>
                    <ChevronLeftIcon />
                  </IconButton>
                </div>
                <Divider />

                {navItem}
              </Drawer>

              <a
                id="mlh-trust-badge"
                style={{
                  display: 'block',
                  maxWidth: '100px',
                  minWidth: '60px',
                  position: 'fixed',
                  right: '50px',
                  top: '0',
                  width: '10%',
                  zIndex: '10000'
                }}
                href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2023-season&utm_content=gray"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://hophacks-website.s3.amazonaws.com/images/mlh-trust-badge-2025-white.svg"
                  alt="Major League Hacking 2024 Hackathon Season"
                  style={{ width: '100%' }}
                ></img>
              </a>
            </section>
          </Toolbar>
        </AppBar>
      </div>
    );
  }

  return (
    <AppBar position="sticky" className={classes.drawer}>
      <Toolbar
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}
      >
        {/* Left-aligned HopHacks Logo */}
        <Button
          component={Link}
          to="/"
          color="inherit"
          className={classes.hophacksButton}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <img
            src="https://hophacks-website.s3.amazonaws.com/images/Hophacks_logo_clean.png"
            alt="HopHacks Logo"
            width={'55px'}
          />
          <Typography variant="h4" className={classes.title} style={{ marginLeft: '15px' }}>
            HopHacks
          </Typography>
        </Button>

        {/* Centered Navigation */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '20px'
          }}
        >
          {navItem}
        </div>

        {/* Right-aligned MLH Trust Badge */}
        <a
          id="mlh-trust-badge"
          style={{
            display: 'block',
            maxWidth: '100px',
            minWidth: '60px',
            position: 'absolute',
            right: '50px',
            top: '0',
            width: '10%',
            zIndex: '10000'
          }}
          href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2023-season&utm_content=gray"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://hophacks-website.s3.amazonaws.com/images/mlh-trust-badge-2025-white.svg"
            alt="Major League Hacking 2024 Hackathon Season"
            style={{ width: '100%' }}
          />
        </a>
      </Toolbar>
    </AppBar>
  );
};

export default withAuthProps(Nav);
