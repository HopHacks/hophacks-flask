import React, { useState, useEffect } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
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
    color: '#F7F3FF'
  },
  hophacksButton: {
    marginLeft: 20,
    marginRight: 20
  },
  navBtn: {
    textTransform: 'none',
    margin: '0 1rem',
    opacity: 0.8,
    transition: 'opacity 0.3s ease',
    '&:hover': {
      opacity: 1
    }
  },
  activeNavBtn: {
    fontWeight: 'bold',
    borderBottom: '2px solid white',
    opacity: 1
  },
  icon: {
    color: 'white'
  }
});

function img(url) {
  return 'https://hophacks-website.s3.amazonaws.com' + '/images/' + url;
}

const Navigation = function Navigation() {
  const classes = useStyles();
  const isMobile = window.innerWidth <= 800;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('cover');
  const [isScrolled, setIsScrolled] = useState(false);

  // Update scroll state and active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
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
  }, []);

  // The cover page sections – these now use HashLinks to scroll to anchors
  const coverSections = [
    { id: 'cover', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'prizes', label: 'PRIZES' },
    { id: 'faq', label: 'FAQ' }
  ];

  // Render cover nav items using HashLink for smooth scroll
  const coverNavItems = coverSections.map((section) => (
    <Button
      key={section.id}
      component={Link}
      smooth
      to={`/#${section.id}`}
      className={`${classes.navBtn} ${activeSection === section.id ? classes.activeNavBtn : ''}`}
    >
      <Typography variant="h5" className={classes.title}>
        {section.label}
      </Typography>
    </Button>
  ));

  // Other navigation items (as before)
  const otherNavItems = (
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
      */}
    </>
  );

  // Combined navigation items for both cover and other sections
  const navItems = (
    <>
      {coverNavItems}
      {otherNavItems}
    </>
  );

  // AppBar style adjusts based on scroll
  const appBarStyle = {
    padding: isScrolled ? '8px 0' : '16px 0',
    transition: 'all 0.3s ease'
  };

  if (isMobile) {
    return (
      <div>
        <AppBar position="sticky" className={classes.drawer} style={appBarStyle}>
          <Toolbar style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <section>
              <Button component={Link} smooth to="/#cover" color="inherit">
                <img src={img('logo2023.png')} width={'55px'} alt="HopHacks Logo" />
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
                  <IconButton onClick={() => setIsDrawerOpen(false)} className={classes.icon}>
                    <ChevronLeftIcon />
                  </IconButton>
                </div>
                <Divider />
                {navItems}
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
                />
              </a>
            </section>
          </Toolbar>
        </AppBar>
      </div>
    );
  }

  return (
    <AppBar position="sticky" className={classes.drawer} style={appBarStyle}>
      <Toolbar
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          position: 'relative'
        }}
      >
        <Button
          component={Link}
          smooth
          to="/#cover"
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

        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '20px'
          }}
        >
          {navItems}
        </div>

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

export default withAuthProps(Navigation);
