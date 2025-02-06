import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import { motion, useViewportScroll, useTransform } from 'framer-motion';

function img(url) {
  return 'https://hophacks-website.s3.amazonaws.com' + '/images/' + url;
}

const useStyles = makeStyles({
  images: {
    // position: 'absolute',
    overflow: 'hidden',
    top: '0vw',
    left: '0.05%',
    width: '100%'
  },
  imagesNew: {
    // position: 'absolute',
    overflow: 'hidden',
    top: '-27vw',
    left: '0%',
    width: '100%'
  },
  mobileImages: {
    // position: 'absolute',
    overflow: 'hidden',
    //top: '-40vw',
    left: '0%',
    width: '100%'
  },
  tempPageeBackground: {
    backgroundColor: '#172759',
    paddingBottom: '20vh',
    backgroundImage: `url("https://hophacks-website.s3.amazonaws.com/images/About.png")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    // backgroundSize: 'auto 100% 100%'
    // backgroundSize: '100%'
    backgroundSize: 'cover', // Ensure the background image covers the entire element
    height: '100vh'
    // height: '100vh'
    // marginBottom: '10vh'
  },
  tempImageBackground: {
    overflow: 'hidden',
    display: 'flex', // Use flexbox for centering
    justifyContent: 'center', // Horizontally center content
    alignItems: 'center', // Vertically center content
    width: '100%',
    // margin: '1px',

    // height: '100vh' // Adjust height as needed

    // top: '0vw'
    paddingTop: '13vh'
    // paddingBottom: '0vh'
  },
  tempTextHeader: {
    textAlign: 'center', // Center text horizontally
    fontSize: '8rem', // Example font size
    // fontWeight: 'bold', // Example font weight
    paddingTop: '3vh',
    // color: '#B4E3F7' // Example text color
    color: 'white'
    // padding: '1px',
    // paddingBottom: '0vh'

    // marginTop: '20px' // Adjust vertical spacing as needed
  },
  tempTextSubtext: {
    textAlign: 'center', // Center text horizontally
    fontSize: '2rem', // Example font size
    // fontWeight: 'bold', // Example font weight
    // color: '#B4E3F7', // Example text color
    color: 'white',
    marginTop: '5px' // Adjust vertical spacing as needed
  },
  tempRegisterButton: {
    // textAlign: 'center', // Center text horizontally
    // fontSize: '1.5rem', // Example font size
    // // fontWeight: 'bold', // Example font weight
    // color: '#B4E3F7', // Example text color
    // marginTop: '20px' // Adjust vertical spacing as needed
    display: 'flex', // Use flexbox for centering
    justifyContent: 'center', // Horizontally center content
    alignItems: 'center', // Vertically center content
    width: '100%'
    // overflow: 'hidden'
  }
});

export default function Cover() {
  //const [imageLoading, setImageLoading] = useState(true);
  //const [pulsing, setPulsing] = useState(true);
  // const { scrollYProgress } = useViewportScroll();

  // const mobileScale = useTransform(scrollYProgress, [0, 0.02], [0.35, 0.35]);
  //const mobileScale = useTransform(scrollYProgress, [0, 0.02], [10, 3]);
  // const mobileRegisterScale = useTransform(scrollYProgress, [0, 0.02], [0.13, 0.3]);
  //const mobileOpacity = useTransform(scrollYProgress, [0, 0.02, 0.025, 0.06], [1, 1, 1, 0]);
  // const mobileYRight = useTransform(scrollYProgress, [0, 0.02], ['20em', '40em']);
  // const mobileRegisterYRight = useTransform(scrollYProgress, [0, 0.02], ['0em', '-3em']);

  const classes = useStyles();
  if (window.innerWidth <= 850 && 1 < 0) {
    return (
      <div className={classes.tempPageeBackground}>
        <div className={classes.tempImageBackground}>
          <img
            src={img('hophacks_bird_default.png')}
            style={{
              width: '100vw',
              marginTop: '20vw'
            }}
          />
        </div>
      </div>
    );
  } else {
    //const pos = useTransform(scrollYProgress, [0, 0.08, 0.16], ['fixed', 'fixed', 'absolute']);
    //const backgroundYRight = useTransform(scrollYProgress, [0.04, 0.08], ['10vw', '40vw']);

    // const registerYRight = useTransform(
    //   scrollYProgress,
    //   [0, 0.02, 0.04, 0.08],
    //   ['0.3em', '-2em', '-4.5em', '-15em']
    // );

    return (
      <div className={classes.tempPageeBackground}>
        {/* <div className={classes.tempImageBackground}> */}
        {/* <img
            src={img('hophacks_bird_default.png')}
            //style={{ top: center(scale.current) }}
            // className={classes.images}
            alt="image_could_not_load"
          /> */}
        {/* <br></br> */}
        {/* <img
                src={img('register.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
                onClick={() => {
                  window.location = '/register/login';
                }}
              /> */}
        {/* </div> */}
        <div className={classes.tempTextHeader}>HOPHACKS</div>
        <div className={classes.tempTextSubtext}>September 13 - 15, 2024</div>
        <div className={classes.tempRegisterButton}>
          <img
            src={img('register_button_alone.png')}
            //style={{ top: center(scale.current) }}
            style={{ width: '20%' }}
            alt="image_could_not_load"
            onClick={() => {
            //   window.location = '/register/login';
            }}
          />
        </div>

        {/* <button> Register</button> */}
      </div>
    );
  }
}
