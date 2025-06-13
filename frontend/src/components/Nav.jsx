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
    background: 'linear-gradient(to bottom, rgba(28, 33, 81, 1) 8%, rgba(0, 29, 76, 0) 100%)',
    boxShadow: 'none',
    height: 70,
    transition: 'transform 0.3s ease',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1100,
    transform: 'translateY(0)'
  },
  appBarHidden: {
    transform: 'translateY(-100%)'
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
    color: '#F7F3FF',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 'bold',
    fontSize: '1.25rem',
    lineHeight: 2,
    letterSpacing: '0.0625rem',
    fontVariant: 'small-caps'
  },
  hophacksButton: {
    marginRight: 20
  },
  navBtn: {
    textTransform: 'none',
    margin: '0 0.5rem',
    padding: '4px 8px',
    opacity: 0.6,
    transition: 'opacity 0.3s ease',
    '&:hover': {
      opacity: 1
    }
  },
  activeNavBtn: {
    fontWeight: 'bold',
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
    marginLeft: 0,
    marginRight: 100,
    display: 'flex',
    alignItems: 'center'
  },
  mlhBanner: {
    position: 'fixed',
    top: 0,
    right: 0,
    maxWidth: 100,
    minWidth: 60,
    width: '100%'
  },
  whiteDivider: {
    opacity: 0.6,
    background: 'white',
    height: '1.5rem',
    alignSelf: 'center',
    width: '.15rem'
  }
});

const Navigation = function Navigation({ isLoggedIn, logout }) {
  const classes = useStyles();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('cover-section');
  const isHome = location.pathname === '/';
  const [showNavbar, setShowNavbar] = useState(true);

  const handleLogout = async () => {
    try {
      await logout(); // Calls your AuthProvider's logout
      window.location.href = '/'; // Refresh to root page
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Update isMobile on window resize.
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 800);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navbar dissapear on scroll effect
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let timeoutId = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // Scrolling down → hide navbar
        setShowNavbar(false);
      } else {
        // Scrolling up or stopped → show navbar
        setShowNavbar(true);
      }

      lastScrollY = currentScrollY;

      // Re-show navbar if user stops scrolling after a delay
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setShowNavbar(true), 500); // adjust delay if needed
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update scroll state and active section only if on home page
  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => {
      const sections = ['cover-section', 'about-section', 'prizes-section', 'faq-section'];
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
    { id: 'cover-section', label: 'Home' },
    { id: 'about-section', label: 'About' },
    { id: 'faq-section', label: 'FAQs' }
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
        onClick={() => isMobile && setIsDrawerOpen(false)}
      >
        <Typography variant="body2" className={classes.title}>
          {section.label}
        </Typography>
      </Button>
    );
  });

  // Define other nav items with route paths and active matching via location.pathname
  const otherNavItemsData = [
    { path: '/team', label: 'Team' },
    { path: '/Recap', label: 'Recap' }
  ];

  const otherNavItems = otherNavItemsData.map((item) => {
    const isActive = location.pathname === item.path;
    return (
      <Button
        key={item.path}
        component={Link}
        to={item.path}
        className={`${classes.navBtn} ${isActive ? classes.activeNavBtn : ''}`}
        onClick={() => isMobile && setIsDrawerOpen(false)}
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
      {/* Only need the divider on mobile */}
      {!isMobile && (
        <Divider
          orientation="vertical"
          flexItem
          className={classes.whiteDivider}
          variant="middle"
        />
      )}
      {otherNavItems}
    </>
  );

  // Mobile view
  if (isMobile) {
    return (
      <div>
        <AppBar
          position="fixed"
          className={`${classes.appBar} ${!showNavbar ? classes.appBarHidden : ''}`}
        >
          <Toolbar className={classes.toolbar}>
            <Button
              component={Link}
              smooth
              to="/#cover-section"
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
              {isLoggedIn ? (
                <Button onClick={handleLogout} className={classes.navBtn}>
                  <Typography variant="body2" className={classes.title}>
                    Logout
                  </Typography>
                </Button>
              ) : (
                <Button component={Link} to="/login" className={classes.navBtn}>
                  <Typography variant="body2" className={classes.title}>
                    Login
                  </Typography>
                </Button>
              )}
              <a
                id="mlh-trust-badge"
                className={classes.mlhBanner}
                href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=blue"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://s3.amazonaws.com/logged-assets/trust-badge/2026/mlh-trust-badge-2026-blue.svg"
                  alt="Major League Hacking 2026 Hackathon Season"
                  className="w-full"
                />
              </a>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }

  // Desktop view
  return (
    <AppBar
      position="fixed"
      className={`${classes.appBar} ${!showNavbar ? classes.appBarHidden : ''}`}
    >
      <Toolbar className={classes.toolbar}>
        <Button
          component={Link}
          smooth
          to="/#cover-section"
          color="inherit"
          className={classes.hophacksButton}
        >
          <img
            src="https://hophacks-website.s3.us-east-1.amazonaws.com/images/website2025/hophacks2025logo.png"
            alt="HopHacks Logo"
            width={'55px'}
          />
        </Button>
        <div className={classes.navItemsContainer}>{navItems}</div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: 'auto',
            paddingRight: '110px'
          }}
        >
          {isLoggedIn ? (
            <Button onClick={handleLogout} className={classes.navBtn}>
              <Typography variant="body2" className={classes.title}>
                Logout
              </Typography>
            </Button>
          ) : (
            <Button component={Link} to="/register/login" className={classes.navBtn}>
              <Typography variant="body2" className={classes.title}>
                Login
              </Typography>
            </Button>
          )}
        </div>
        <a
          id="mlh-trust-badge"
          className={classes.mlhBanner}
          href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=blue"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://s3.amazonaws.com/logged-assets/trust-badge/2026/mlh-trust-badge-2026-blue.svg"
            alt="Major League Hacking 2026 Hackathon Season"
            className="w-full"
          />
        </a>
      </Toolbar>
    </AppBar>
  );
};

export default withAuthProps(Navigation);
