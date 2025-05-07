import React, { useState, useEffect } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { useLocation } from 'react-router-dom';
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
  // AppBar fixed to the top with full width
  appBar: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    height: 50,
    transition: 'height 0.3s ease',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1100 // ensure it stays on top of other elements
  },
  toolbar: {
    minHeight: '50px',
    padding: '0 16px',
    position: 'relative'
  },
  logo: {
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Inter',
    color: '#F7F3FF',
    fontSize: '0.9rem'
  },
  hophacksButton: {
    marginRight: 20
  },
  navBtn: {
    textTransform: 'none',
    margin: '0 0.5rem',
    padding: '4px 8px',
    opacity: 0.8,
    transition: 'opacity 0.3s ease',
    fontSize: '0.8rem',
    '&:hover': {
      opacity: 1
    }
  },
  activeNavBtn: {
    fontWeight: 'bold',
    borderBottom: '2px solid white',
    opacity: 1
  },
  drawerPaper: {
    background: '#1D539F',
    width: '100vw'
  },
  icon: {
    color: 'white'
  },
  // Container for nav items; reserves 100px on right for the MLH banner.
  navItemsContainer: {
    marginLeft: 'auto',
    marginRight: 100,
    display: 'flex',
    alignItems: 'center'
  },
  mlhBanner: {
    position: 'absolute',
    right: 0,
    top: 0,
    maxWidth: 100,
    minWidth: 60,
    width: '100%',
    zIndex: 1200
  }
});

const Navigation = function Navigation() {
  const classes = useStyles();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('cover');
  const isHome = location.pathname === '/';

  // Update isMobile on window resize.
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 800);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update scroll state and active section only if on home page
  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => {
      const sections = ['cover', 'about', 'prizes', 'faq'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  // Define cover nav items (only active if home page, otherwise no active style)
  const coverSections = [
    { id: 'cover', label: 'HOME' }
    // { id: 'about', label: 'ABOUT' },
    // { id: 'prizes', label: 'PRIZES' },
    // { id: 'faq', label: 'FAQ' }
  ];

  const coverNavItems = coverSections.map((section) => {
    const isActive = isHome && activeSection === section.id;
    return (
      <Button
        key={section.id}
        component={Link}
        smooth
        to={`/#${section.id}`}
        className={`${classes.navBtn} ${isActive ? classes.activeNavBtn : ''}`}
      >
        <Typography variant="body2" className={classes.title}>
          {section.label}
        </Typography>
      </Button>
    );
  });

  // Define other nav items with route paths and active matching via location.pathname
  const otherNavItemsData = [
    { path: '/team', label: 'TEAM' },
    { path: '/Recap', label: 'RECAP' }
  ];

  /* Past Navigation items
  <>
    <Button component={Link} to="/team" color="inherit" className={classes.navBtn}>
      <Typography variant="h5" className={classes.title}>
        Team
      </Typography>
    </Button>
    <Button component={Link} to="/Recap" color="inherit" className={classes.navBtn}>
      <Typography variant="h5" className={classes.title}>
        Recap
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
    </Button>
    <Button
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
    </Button>
    <Button
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
    </Button>
    <Button
      component={Link}
      onClick={() => (window.location = '/#schedule')}
      color="inherit"
      className={classes.navBtn}
    >
      <Typography variant="h5" className={classes.title}>
        Schedule
      </Typography>
    </Button>
    <Button
      component={Link}
      onClick={() => (window.location = '/#prizes')}
      color="inherit"
      className={classes.navBtn}
    >
      <Typography variant="h5" className={classes.title}>
        Prizes
      </Typography>
    </Button>
    <Button
      component={Link}
      onClick={() => (window.location = '/#tracks')}
      color="inherit"
      className={classes.navBtn}
    >
      <Typography variant="h5" className={classes.title}>
        Tracks
      </Typography>
    </Button>
    <Button
      component={Link}
      onClick={() => (window.location = '/#sponsors')}
      color="inherit"
      className={classes.navBtn}
    >
      <Typography variant="h5" className={classes.title}>
        Sponsors
      </Typography>
    </Button>
    <Button
      component={Link}
      onClick={() => (window.location = '/#faq')}
      color="inherit"
      className={classes.navBtn}
    >
      <Typography variant="h5" className={classes.title}>
        FAQ
      </Typography>
    </Button>
  </>
  */

  const otherNavItems = otherNavItemsData.map((item) => {
    const isActive = location.pathname === item.path;
    return (
      <Button
        key={item.path}
        component={Link}
        to={item.path}
        className={`${classes.navBtn} ${isActive ? classes.activeNavBtn : ''}`}
      >
        <Typography variant="body2" className={classes.title}>
          {item.label}
        </Typography>
      </Button>
    );
  });

  // Combined navigation items for cover sections and other items
  const navItems = (
    <>
      {coverNavItems}
      {otherNavItems}
    </>
  );

  // Mobile view
  if (isMobile) {
    return (
      <div>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Button
              component={Link}
              smooth
              to="/"
              color="inherit"
              className={classes.hophacksButton}
            >
              <img
                src="https://hophacks-website.s3.us-east-1.amazonaws.com/images/website2025/hophacks2025logo.png"
                alt="HopHacks Logo"
                width={'55px'}
              />
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
              classes={{ paper: classes.drawerPaper }}
            >
              <div>
                <IconButton onClick={() => setIsDrawerOpen(false)} className={classes.icon}>
                  <ChevronLeftIcon />
                </IconButton>
              </div>
              <Divider />
              {navItems}
            </Drawer>
            <a
              id="mlh-trust-badge"
              className={classes.mlhBanner}
              href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2023-season&utm_content=gray"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="https://hophacks-website.s3.amazonaws.com/images/mlh-badge-2025-blue.svg"
                alt="Major League Hacking 2024 Hackathon Season"
                style={{ width: '100%' }}
              />
            </a>
          </Toolbar>
        </AppBar>
      </div>
    );
  }

  // Desktop view
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Button component={Link} smooth to="/" color="inherit" className={classes.hophacksButton}>
          <img
            src="https://hophacks-website.s3.us-east-1.amazonaws.com/images/website2025/hophacks2025logo.png"
            alt="HopHacks Logo"
            width={'55px'}
          />
        </Button>
        <div className={classes.navItemsContainer}>{navItems}</div>
        <a
          id="mlh-trust-badge"
          className={classes.mlhBanner}
          href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2023-season&utm_content=gray"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://hophacks-website.s3.amazonaws.com/images/mlh-badge-2025-blue.svg"
            alt="Major League Hacking 2024 Hackathon Season"
            style={{ width: '100%' }}
          />
        </a>
      </Toolbar>
    </AppBar>
  );
};

export default withAuthProps(Navigation);
