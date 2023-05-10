import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';

import { useHistory } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { Typography } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";

import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { withAuthProps } from '../util/auth';
import Login from './LoginDialog';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({

  title: {
    fontFamily: "Inter",
    textAlign: 'center',
    justifyContent: 'center',
    color: '#B4E3F7',
    marginLeft: 20,
  },

  rightTitle: {
    fontFamily: "Inter",
    textAlign: 'center',
    justifyContent: 'center',
    color: '#B4E3F7',
    marginRight: "13vw",
    marginLeft: 20,

  },

  hophacksButton: {
    marginLeft: 20,
    marginRight: 20,
  },


  drawer: {
    background: "#141230",
    width: "100vw"
  },

  icon: {
    color: "white"
  },

  textButton:{
    marginLeft: 10,
  },

  birdButton:
  {
      marginRight:'auto'
  },

  birdIcon: {
    width: "5vh",
    height:"5vh",
  }

});

const Nav = function Nav(props) {
  let history = useHistory();
  async function handleLogout() {
    await props.logout();
    history.push("/");
  }

  const classes = useStyles();
  const isMobile = window.innerWidth <= 650;


  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
  function img(url) {
    return "https://hophacks-website.s3.amazonaws.com"+ "/images/" + url;
  }

  if (isMobile) {
    return (
      <div>


        <AppBar position="sticky">
          <Toolbar style={{ justifyContent: 'center' }}>
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
                <img src={img("logo2022.png")} class={classes.birdIcon}/>
              </Button>
              <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} classes={{paper : classes.drawer}} >
                <div>
                  <IconButton onClick={handleDrawerClose} className={classes.icon}>
                    <ChevronLeftIcon /> 
                  </IconButton>
                </div>
                <Divider />

                

                <Button onClick={() => {
                    window.location = "/#about";
                }} color="inherit">
                  <Typography variant="h5" className={classes.title}> About </Typography>
                </Button>
                <Button onClick={() => {
                    window.location = "/";
                }} color="inherit">
                  <Typography variant="h5" className={classes.title}> Schedule </Typography>
                </Button>

                <Button onClick={() => {
                    window.location = "/";
                }} color="inherit">
                  <Typography variant="h5" className={classes.title}> Sponsors </Typography>
                </Button>

                <Button onClick={() => {
                    window.location = "/";
                }} color="inherit">
                  <Typography variant="h5" className={classes.title}> FAQ</Typography>
                </Button>

                <Button onClick={() => {
                    window.location = "/team";
                }} color="inherit">
                  <Typography variant="h5" className={classes.title}> Team </Typography>
                </Button>
                {/* {!props.isLoggedIn && 
                <Button onClick={() => {
                  window.location = "/register";
                }} color="inherit">
                  <Typography variant="h5" className={classes.title}> Register </Typography>
                </Button>
                } */}

                {!props.isLoggedIn && <Login />
                }

                {props.isLoggedIn &&
                  <Button onClick={() => {
                    window.location = "/profile";
                  }} color="inherit">
                    <Typography variant="h5" className={classes.title}> Profile </Typography>
                  </Button>
                }

                {props.isLoggedIn &&
                  <Button onClick={handleLogout} color="inherit">
                    <Typography variant="h5" className={classes.leftTitle}>Logout</Typography>
                  </Button>
                }

                
              </Drawer>    

              <a id="mlh-trust-badge"
                style={{display: "block", maxWidth: "100px", minWidth: "60px", position: "fixed", right: "50px", top: "0", width: "10%", zIndex: "10000"}}
                href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2023-season&utm_content=gray"
                target="_blank"
              >
                <img src="https://s3.amazonaws.com/logged-assets/trust-badge/2023/mlh-trust-badge-2023-gray.svg" alt="Major League Hacking 2023 Hackathon Season" style={{ width: "100%" }}></img>
              </a>
            </section>
          </Toolbar>
        </AppBar>
      </div>



    );
  }

  return (
    <AppBar position="sticky" >
      <Toolbar style={{ flexDirection: 'row', justifyContent: 'center', background:'#141230'}}>
        
      <Button component={HashLink} smooth to={'/#home'} color="inherit" className={classes.birdButton} >
        <img src={img("logo2022.png")} className={classes.birdIcon}/>
      </Button>
      <section className={classes.textButton}>
          <Button component={HashLink} smooth to={'/#about'} color="inherit" >
            <Typography variant="h5" className={classes.title}> About </Typography>
          </Button>

          <Button component={HashLink} smooth to={'/#schedule'} color="inherit" >
            <Typography variant="h5" className={classes.title}> Schedule </Typography>
          </Button>

          <Button component={HashLink} smooth to={'/#prizes'} color="inherit" >
            <Typography variant="h5" className={classes.title}> Prizes</Typography>
          </Button>
          <Button component={HashLink} smooth to={'/#sponsors'} color="inherit">
            <Typography variant="h5" className={classes.title}> Sponsors </Typography>
          </Button>

          <Button component={HashLink} smooth to={'/#faq'} color="inherit">
            <Typography variant="h5" className={classes.title}> FAQ </Typography>
          </Button>

          <Button onClick={() => {
            window.location = "/team";
          }} color="inherit">
            <Typography variant="h5" className={classes.title}> Team </Typography>
          </Button>
          
          {/* {!props.isLoggedIn && <Button onClick={() => {
            window.location = "/register";
          }} color="inherit">
            <Typography variant="h5" className={classes.title}> Register </Typography>
          </Button>
              } */}
          {!props.isLoggedIn && <Login />
          }

          {props.isLoggedIn &&
            <Button onClick={() => {
              window.location = "/profile";
            }} color="inherit">
              <Typography variant="h5" className={classes.title}> Profile </Typography>
            </Button>
          }

          {props.isLoggedIn &&
            <Button onClick={handleLogout} color="inherit">
              <Typography variant="h5" className={classes.rightTitle}>Logout</Typography>
            </Button>
          }
        </section>
          <a id="mlh-trust-badge"
            style={{display: "block", maxWidth: "100px", minWidth: "60px", position: "fixed", right: "50px", top: "0", width: "10%", zIndex: "10000"}}
            href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2023-season&utm_content=gray"
            target="_blank"
          >
            <img src="https://s3.amazonaws.com/logged-assets/trust-badge/2023/mlh-trust-badge-2023-gray.svg" alt="Major League Hacking 2023 Hackathon Season" style={{ width: "100%" }}></img>
          </a>
      </Toolbar>
    </AppBar>
  );
}

export default withAuthProps(Nav);
