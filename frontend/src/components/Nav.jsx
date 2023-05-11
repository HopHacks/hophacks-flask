import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
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
import Login from './LoginDialog';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  title: {
    fontFamily: 'Inter',
    flexGrow: 1,
    textAlign: 'center',
    color: 'white'
  },

  hophacksButton: {
    marginLeft: 20,
    marginRight: 20
  },

  otherButton: {
    marginLeft: 'auto'
  },

  navBtn: {
    textTransform: 'none',
    marginRight: '3rem'
  },

  drawer: {
    background: '#33073E',
    width: '100vw'
  },

  icon: {
    color: 'white'
  }
});

function img(url) {
  return process.env.PUBLIC_URL + '/images/' + url;
}

const Nav = function Nav(props) {
  let history = useHistory();
  async function handleLogout() {
    await props.logout();
    history.push('/');
  }

  const classes = useStyles();
  const isMobile = window.innerWidth <= 650;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  if (isMobile) {
    return (
      <div>
        <AppBar position="sticky">
          <Toolbar style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setIsDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <section>
              <Button component={Link} to={'/'} color="inherit">
                <Typography variant="h5" className={classes.title}>
                  {' '}
                  Hophacks{' '}
                </Typography>
              </Button>
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

                <Button
                  onClick={() => {
                    window.location = '/';
                  }}
                  color="inherit"
                >
                  <Typography variant="h5" className={classes.title}>
                    {' '}
                    Home{' '}
                  </Typography>
                </Button>

                {/* {!props.isLoggedIn && 
                <Button onClick={() => {
                  window.location = "/register";
                }} color="inherit">
                  <Typography variant="h5" className={classes.title}> Register </Typography>
                </Button>
                } */}

                {!props.isLoggedIn && <Login />}

                {props.isLoggedIn && (
                  <Button
                    onClick={() => {
                      window.location = '/profile';
                    }}
                    color="inherit"
                  >
                    <Typography variant="h5" className={classes.title}>
                      {' '}
                      Profile{' '}
                    </Typography>
                  </Button>
                )}

                {props.isLoggedIn && (
                  <Button onClick={handleLogout} color="inherit">
                    <Typography variant="h5" className={classes.title}>
                      Logout
                    </Typography>
                  </Button>
                )}

                <Button
                  onClick={() => {
                    window.location = '/team';
                  }}
                  color="inherit"
                >
                  <Typography variant="h5" className={classes.title}>
                    {' '}
                    Team{' '}
                  </Typography>
                </Button>
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
                  src="https://s3.amazonaws.com/logged-assets/trust-badge/2023/mlh-trust-badge-2023-gray.svg"
                  alt="Major League Hacking 2023 Hackathon Season"
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
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginRight: '8rem'
        }}
      >
        <Button
          component={Link}
          onClick={() => (window.location = '/')}
          color="inherit"
          className={classes.hophacksButton}
        >
          <img src={img('logo2023.png')} width={'55px'} />
          <Typography variant="h4" className={classes.title}>
            HopHacks
          </Typography>
        </Button>

        <section
          className={classes.otherButton}
          style={{
            margin: 'auto'
          }}
        >
          <Button
            component={Link}
            onClick={() => (window.location = '#about')}
            color="inherit"
            className={classes.navBtn}
          >
            <Typography variant="h5" className={classes.title}>
              About
            </Typography>
          </Button>

          <Button
            component={Link}
            onClick={() => (window.location = '#schedule')}
            color="inherit"
            className={classes.navBtn}
          >
            <Typography variant="h5" className={classes.title}>
              Schedule
            </Typography>
          </Button>
          <Button
            component={Link}
            onClick={() => (window.location = '#sponsors')}
            color="inherit"
            className={classes.navBtn}
          >
            <Typography variant="h5" className={classes.title}>
              Sponsors
            </Typography>
          </Button>
          <Button
            component={Link}
            onClick={() => (window.location = '#faq')}
            color="inherit"
            className={classes.navBtn}
          >
            <Typography variant="h5" className={classes.title}>
              FAQ
            </Typography>
          </Button>

          <Button
            onClick={() => {
              window.location = '/team';
            }}
            className={classes.navBtn}
            color="inherit"
          >
            <Typography variant="h5" className={classes.title}>
              Team
            </Typography>
          </Button>

          {/* {!props.isLoggedIn && <Button onClick={() => {
            window.location = "/register";
          }} color="inherit">
            <Typography variant="h5" className={classes.title}> Register </Typography>
          </Button>
              } */}

          {!props.isLoggedIn && <Login />}

          {props.isLoggedIn && (
            <Button
              onClick={() => {
                window.location = '/profile';
              }}
              color="inherit"
            >
              <Typography variant="h5" className={classes.title}>
                {' '}
                Profile{' '}
              </Typography>
            </Button>
          )}

          {props.isLoggedIn && (
            <Button onClick={handleLogout} color="inherit">
              <Typography variant="h5" className={classes.title}>
                Logout
              </Typography>
            </Button>
          )}

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
              src="https://s3.amazonaws.com/logged-assets/trust-badge/2023/mlh-trust-badge-2023-white.svg"
              alt="Major League Hacking 2023 Hackathon Season"
              style={{ width: '100%' }}
            ></img>
          </a>
        </section>
      </Toolbar>
    </AppBar>
  );
};

export default withAuthProps(Nav);
