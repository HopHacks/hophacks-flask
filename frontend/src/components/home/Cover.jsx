import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { motion, useViewportScroll, useTransform } from 'framer-motion';

const useStyles = makeStyles({
  images: {
    position: 'absolute',
    overflow: 'hidden',
    top: '-40vw',
    left: '0%',
    width: '100%'
  },
  mobileImages: {
    position: 'absolute',
    overflow: 'hidden',
    //top: '-40vw',
    left: '0%',
    width: '100%'
  }
});

function img(url) {
  return 'https://hophacks-website.s3.amazonaws.com' + '/images/' + url;
}
export default function Cover() {
  //const [imageLoading, setImageLoading] = useState(true);
  //const [pulsing, setPulsing] = useState(true);
  const { scrollYProgress } = useViewportScroll();

  const mobileScale = useTransform(scrollYProgress, [0, 0.02], [0.4, 0.4]);
  //const mobileScale = useTransform(scrollYProgress, [0, 0.02], [10, 3]);
  // const mobileRegisterScale = useTransform(scrollYProgress, [0, 0.02], [0.13, 0.3]);
  //const mobileOpacity = useTransform(scrollYProgress, [0, 0.02, 0.025, 0.06], [1, 1, 1, 0]);
  // const mobileYRight = useTransform(scrollYProgress, [0, 0.02], ['20em', '40em']);
  // const mobileRegisterYRight = useTransform(scrollYProgress, [0, 0.02], ['0em', '-3em']);

  const classes = useStyles();
  if (window.innerWidth <= 500) {
    const scale = useTransform(scrollYProgress, [0, 0.08], [3.7, 1.9]);
    const registerScale = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      [0.13, 0.19, 0.25, 0.43]
    );
    const opacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.3], [1, 1, 1, 0]);
    const yRight = useTransform(scrollYProgress, [0, 0.08], ['15em', '50em']);
    const registerYRight = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      ['0.3em', '-1.1em', '-2.5em', '-6.2em']
    );
    const logoScale = useTransform(scrollYProgress, [0, 0.08], [0.5, 0.5]);
    const logoOpacity = useTransform(scrollYProgress, [0.08, 0.083], [1, 1]);
    const logoRight = useTransform(scrollYProgress, [0.08, 0.09], ['-7em', '-7em']);
    return (
      <div>
        <div style={{}}>
          <motion.div
            style={{
              scale,
              registerScale,
              opacity,
              yRight,
              registerYRight,
              logoScale,
              logoOpacity,
              logoRight
            }}
          ></motion.div>
          <img
            src={img('homepage-desktop.png')}
            style={{
              width: '100vw'
            }}
          />
          <motion.div style={{ scale: logoScale, opacity: logoOpacity }}>
            <img
              src={img('logo.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
              style={{ top: '-495px' }}
            />
          </motion.div>
          <motion.div
            style={{
              scale: mobileScale
            }}
          >
            <img
              src={img('register.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
              onClick={() => {
                window.location = '/register/login';
              }}
              style={{ top: '-550px' }}
            />
          </motion.div>
        </div>
      </div>
    );
  } else if (window.innerWidth <= 530) {
    const scale = useTransform(scrollYProgress, [0, 0.08], [3.7, 1.9]);
    const registerScale = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      [0.13, 0.19, 0.25, 0.43]
    );
    const opacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.3], [1, 1, 1, 0]);
    const yRight = useTransform(scrollYProgress, [0, 0.08], ['15em', '50em']);
    const registerYRight = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      ['0.3em', '-1.1em', '-2.5em', '-6.2em']
    );
    const logoScale = useTransform(scrollYProgress, [0, 0.08], [0.5, 0.5]);
    const logoOpacity = useTransform(scrollYProgress, [0.08, 0.083], [1, 1]);
    const logoRight = useTransform(scrollYProgress, [0.08, 0.09], ['-7em', '-7em']);
    return (
      <div>
        <div style={{}}>
          <img
            src={img('homepage-desktop.png')}
            style={{
              width: '100vw'
            }}
          />
          <motion.div
            style={{
              scale,
              registerScale,
              opacity,
              yRight,
              registerYRight,
              logoScale,
              logoOpacity,
              logoRight
            }}
          ></motion.div>
          <motion.div style={{ scale: logoScale, opacity: logoOpacity }}>
            <img
              src={img('logo.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
              style={{ top: '-515px' }}
            />
          </motion.div>
          <motion.div
            style={{
              scale: mobileScale
            }}
          >
            <img
              src={img('register.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
              onClick={() => {
                window.location = '/register/login';
              }}
              style={{ top: '-580px' }}
            />
          </motion.div>
        </div>
      </div>
    );
  } else if (window.innerWidth <= 560) {
    const scale = useTransform(scrollYProgress, [0, 0.08], [3.7, 1.9]);
    const registerScale = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      [0.13, 0.19, 0.25, 0.43]
    );
    const opacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.3], [1, 1, 1, 0]);
    const yRight = useTransform(scrollYProgress, [0, 0.08], ['15em', '50em']);
    const registerYRight = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      ['0.3em', '-1.1em', '-2.5em', '-6.2em']
    );
    const logoScale = useTransform(scrollYProgress, [0, 0.08], [0.5, 0.5]);
    const logoOpacity = useTransform(scrollYProgress, [0.08, 0.083], [1, 1]);
    const logoRight = useTransform(scrollYProgress, [0.08, 0.09], ['-7em', '-7em']);
    return (
      <div>
        <div style={{}}>
          <img
            src={img('homepage-desktop.png')}
            style={{
              width: '100vw'
            }}
          />
          <motion.div
            style={{
              scale,
              registerScale,
              opacity,
              yRight,
              registerYRight,
              logoScale,
              logoOpacity,
              logoRight
            }}
          ></motion.div>
          <motion.div style={{ scale: logoScale, opacity: logoOpacity }}>
            <img
              src={img('logo.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
              style={{ top: '-515px' }}
            />
          </motion.div>
          <motion.div
            style={{
              scale: mobileScale
            }}
          >
            <img
              src={img('register.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
              onClick={() => {
                window.location = '/register/login';
              }}
              style={{ top: '-580px' }}
            />
          </motion.div>
        </div>
      </div>
    );
  } else if (window.innerWidth <= 590) {
    const scale = useTransform(scrollYProgress, [0, 0.08], [3.7, 1.9]);
    const registerScale = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      [0.13, 0.19, 0.25, 0.43]
    );
    const opacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.3], [1, 1, 1, 0]);
    const yRight = useTransform(scrollYProgress, [0, 0.08], ['15em', '50em']);
    const registerYRight = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      ['0.3em', '-1.1em', '-2.5em', '-6.2em']
    );
    const logoScale = useTransform(scrollYProgress, [0, 0.08], [0.5, 0.5]);
    const logoOpacity = useTransform(scrollYProgress, [0.08, 0.083], [1, 1]);
    const logoRight = useTransform(scrollYProgress, [0.08, 0.09], ['-7em', '-7em']);
    return (
      <div>
        <div style={{}}>
          <motion.div
            style={{
              scale,
              registerScale,
              opacity,
              yRight,
              registerYRight,
              logoScale,
              logoOpacity,
              logoRight
            }}
          ></motion.div>
          <img
            src={img('homepage-desktop.png')}
            style={{
              width: '100vw'
            }}
          />
          <motion.div style={{ scale: logoScale, opacity: logoOpacity }}>
            <img
              src={img('logo.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
              style={{ top: '-545px' }}
            />
          </motion.div>
          <motion.div
            style={{
              scale: mobileScale
            }}
          >
            <img
              src={img('register.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
              onClick={() => {
                window.location = '/register/login';
              }}
              style={{ top: '-610px' }}
            />
          </motion.div>
        </div>
      </div>
    );
  } else if (window.innerWidth <= 620) {
    const scale = useTransform(scrollYProgress, [0, 0.08], [3.7, 1.9]);
    const registerScale = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      [0.13, 0.19, 0.25, 0.43]
    );
    const opacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.3], [1, 1, 1, 0]);
    const yRight = useTransform(scrollYProgress, [0, 0.08], ['15em', '50em']);
    const registerYRight = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      ['0.3em', '-1.1em', '-2.5em', '-6.2em']
    );
    const logoScale = useTransform(scrollYProgress, [0, 0.08], [0.5, 0.5]);
    const logoOpacity = useTransform(scrollYProgress, [0.08, 0.083], [1, 1]);
    const logoRight = useTransform(scrollYProgress, [0.08, 0.09], ['-7em', '-7em']);
    return (
      <div>
        <div style={{}}>
          <motion.div
            style={{
              scale,
              registerScale,
              opacity,
              yRight,
              registerYRight,
              logoScale,
              logoOpacity,
              logoRight
            }}
          ></motion.div>
          <img
            src={img('homepage-desktop.png')}
            style={{
              width: '100vw'
            }}
          />
          <motion.div style={{ scale: logoScale, opacity: logoOpacity }}>
            <img
              src={img('logo.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
              style={{ top: '-575px' }}
            />
          </motion.div>
          <motion.div
            style={{
              scale: mobileScale
            }}
          >
            <img
              src={img('register.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
              onClick={() => {
                window.location = '/register/login';
              }}
              style={{ top: '-640px' }}
            />
          </motion.div>
        </div>
      </div>
    );
  } else if (window.innerWidth <= 650) {
    const scale = useTransform(scrollYProgress, [0, 0.08], [3.7, 1.9]);
    const registerScale = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      [0.13, 0.19, 0.25, 0.43]
    );
    const opacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.3], [1, 1, 1, 0]);
    const yRight = useTransform(scrollYProgress, [0, 0.08], ['15em', '50em']);
    const registerYRight = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      ['0.3em', '-1.1em', '-2.5em', '-6.2em']
    );
    const logoScale = useTransform(scrollYProgress, [0, 0.08], [0.5, 0.5]);
    const logoOpacity = useTransform(scrollYProgress, [0.08, 0.083], [1, 1]);
    const logoRight = useTransform(scrollYProgress, [0.08, 0.09], ['-6em', '-6em']);
    return (
      <div>
        <div style={{}}>
          <motion.div
            style={{
              scale,
              registerScale,
              opacity,
              yRight,
              registerYRight,
              logoScale,
              logoOpacity,
              logoRight
            }}
          ></motion.div>
          <img
            src={img('homepage-desktop.png')}
            style={{
              width: '100vw'
            }}
          />
          <motion.div style={{ scale: logoScale, opacity: logoOpacity }}>
            <img
              src={img('logo.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
              style={{ top: '-615px' }}
            />
          </motion.div>
          <motion.div
            style={{
              scale: mobileScale
            }}
          >
            <img
              src={img('register.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
              onClick={() => {
                window.location = '/register/login';
              }}
              style={{ top: '-680px' }}
            />
          </motion.div>

          {/* <motion.div
            style={{
              scale: mobileScale,
              opacity: mobileOpacity,
              y: mobileYRight,
              x: 0
            }}
          >
            <img
              src={img('sky.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('stage0530.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('crowd0530.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('foreground-2.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <motion.div
              style={{
                scale: mobileRegisterScale,
                opacity: mobileOpacity,
                y: mobileRegisterYRight,
                x: 0
              }}
            >
              <img
                src={img('register.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
                onClick={() => {
                  window.location = '/register/login';
                }}
              />
            </motion.div>
          </motion.div> */}
        </div>
      </div>
    );
  } else if (window.innerWidth <= 780) {
    console.log(window.innerWidth);
    const scale = useTransform(scrollYProgress, [0, 0.08], [3.7, 1.9]);
    const registerScale = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      [0.13, 0.19, 0.25, 0.43]
    );
    const opacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.3], [1, 1, 1, 0]);
    const yRight = useTransform(scrollYProgress, [0, 0.08], ['15em', '50em']);
    const registerYRight = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      ['0.3em', '-1.1em', '-2.5em', '-6.2em']
    );
    const logoScale = useTransform(scrollYProgress, [0, 0.08], [0.5, 0.5]);
    const logoOpacity = useTransform(scrollYProgress, [0.08, 0.083], [0, 1]);
    const logoRight = useTransform(scrollYProgress, [0.08, 0.09], ['-7em', '-7em']);
    return (
      <div>
        <div>
          <motion.div
            style={{
              scale,
              opacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('sky.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('stage0530.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('crowd0530.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('foreground-2.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <motion.div style={{ scale: logoScale, opacity: logoOpacity, y: logoRight }}>
              <img
                src={img('logo.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
              />
            </motion.div>
            <motion.div
              style={{
                scale: registerScale,
                opacity,
                y: registerYRight,
                x: 0
              }}
            >
              <img
                src={img('register.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
                onClick={() => {
                  window.location = '/register/login';
                }}
              />
            </motion.div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            ></div>
          </motion.div>
        </div>
      </div>
    );
  } else if (window.innerWidth <= 880) {
    console.log(window.innerWidth);
    const scale = useTransform(scrollYProgress, [0, 0.08], [3.7, 1.35]);
    const registerScale = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      [0.13, 0.19, 0.23, 0.43]
    );
    const opacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.3], [1, 1, 1, 0]);
    const yRight = useTransform(scrollYProgress, [0, 0.08], ['15em', '50em']);
    const registerYRight = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      ['0.3em', '-1.1em', '-2.2em', '-7.3em']
    );
    const logoScale = useTransform(scrollYProgress, [0, 0.08], [0.5, 0.5]);
    const logoOpacity = useTransform(scrollYProgress, [0.08, 0.083], [0, 1]);
    const logoRight = useTransform(scrollYProgress, [0.08, 0.09], ['-8em', '-8em']);
    return (
      <div>
        <div>
          <motion.div
            style={{
              scale,
              opacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('sky.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('stage0530.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('crowd0530.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('foreground-2.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <motion.div style={{ scale: logoScale, opacity: logoOpacity, y: logoRight }}>
              <img
                src={img('logo.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
              />
            </motion.div>
            <motion.div
              style={{
                scale: registerScale,
                opacity,
                y: registerYRight,
                x: 0
              }}
            >
              <img
                src={img('register.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
                onClick={() => {
                  window.location = '/register/login';
                }}
              />
            </motion.div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            ></div>
          </motion.div>
        </div>
      </div>
    );
  } else if (window.innerWidth <= 970) {
    console.log(window.innerWidth);
    const scale = useTransform(scrollYProgress, [0, 0.08], [3.7, 1.15]);
    const registerScale = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      [0.13, 0.19, 0.23, 0.45]
    );
    const opacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.3], [1, 1, 1, 0]);
    const yRight = useTransform(scrollYProgress, [0, 0.08], ['15em', '50em']);
    const registerYRight = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      ['0.3em', '-1.25em', '-2.5em', '-9em']
    );
    const logoScale = useTransform(scrollYProgress, [0, 0.08], [0.5, 0.5]);
    const logoOpacity = useTransform(scrollYProgress, [0.08, 0.083], [0, 1]);
    const logoRight = useTransform(scrollYProgress, [0.08, 0.09], ['-10em', '-10em']);
    return (
      <div>
        <div>
          <motion.div
            style={{
              scale,
              opacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('sky.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('stage0530.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('crowd0530.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('foreground-2.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <motion.div style={{ scale: logoScale, opacity: logoOpacity, y: logoRight }}>
              <img
                src={img('logo.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
              />
            </motion.div>
            <motion.div
              style={{
                scale: registerScale,
                opacity,
                y: registerYRight,
                x: 0
              }}
            >
              <img
                src={img('register.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
                onClick={() => {
                  window.location = '/register/login';
                }}
              />
            </motion.div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            ></div>
          </motion.div>
        </div>
      </div>
    );
  } else if (window.innerWidth <= 1100) {
    console.log(window.innerWidth);
    const scale = useTransform(scrollYProgress, [0, 0.08], [3.7, 1.05]);
    const registerScale = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      [0.13, 0.19, 0.23, 0.45]
    );
    const opacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.3], [1, 1, 1, 0]);
    const yRight = useTransform(scrollYProgress, [0, 0.08], ['15em', '50em']);
    const registerYRight = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      ['0.3em', '-1.5em', '-2.8em', '-10em']
    );
    const logoScale = useTransform(scrollYProgress, [0, 0.08], [0.5, 0.5]);
    const logoOpacity = useTransform(scrollYProgress, [0.08, 0.083], [0, 1]);
    const logoRight = useTransform(scrollYProgress, [0.08, 0.09], ['-11em', '-11em']);
    return (
      <div>
        <div>
          <motion.div
            style={{
              scale,
              opacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('sky.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('stage0530.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('crowd0530.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('foreground-2.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <motion.div style={{ scale: logoScale, opacity: logoOpacity, y: logoRight }}>
              <img
                src={img('logo.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
              />
            </motion.div>
            <motion.div
              style={{
                scale: registerScale,
                opacity,
                y: registerYRight,
                x: 0
              }}
            >
              <img
                src={img('register.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
                onClick={() => {
                  window.location = '/register/login';
                }}
              />
            </motion.div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            ></div>
          </motion.div>
        </div>
      </div>
    );
  } else if (window.innerWidth <= 1250) {
    const scale = useTransform(scrollYProgress, [0, 0.08], [3.7, 1]);
    const registerScale = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      [0.13, 0.2, 0.24, 0.5]
    );
    const opacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.3], [1, 1, 1, 0]);
    const yRight = useTransform(scrollYProgress, [0, 0.08], ['15em', '50em']);
    const registerYRight = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      ['0.3em', '-2em', '-3.5em', '-13em']
    );
    const logoScale = useTransform(scrollYProgress, [0, 0.08], [0.5, 0.5]);
    const logoOpacity = useTransform(scrollYProgress, [0.08, 0.083], [0, 1]);
    const logoRight = useTransform(scrollYProgress, [0.08, 0.09], ['-15em', '-15em']);
    return (
      <div>
        <div>
          <motion.div
            style={{
              scale,
              opacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('sky.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('stage0530.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('crowd0530.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('foreground-2.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <motion.div style={{ scale: logoScale, opacity: logoOpacity, y: logoRight }}>
              <img
                src={img('logo.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
              />
            </motion.div>

            <motion.div
              style={{
                scale: registerScale,
                opacity,
                y: registerYRight,
                x: 0
              }}
            >
              <img
                src={img('register.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
                onClick={() => {
                  window.location = '/register/login';
                }}
              />
            </motion.div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            ></div>
          </motion.div>
        </div>
      </div>
    );
  } else {
    const scale = useTransform(scrollYProgress, [0, 0.08], [4, 1]);
    const registerScale = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      [0.13, 0.2, 0.24, 0.5]
    );
    const opacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.3], [1, 1, 1, 0]);
    const yRight = useTransform(scrollYProgress, [0, 0.08], ['10em', '55em']);
    const registerYRight = useTransform(
      scrollYProgress,
      [0, 0.02, 0.04, 0.08],
      ['0.3em', '-2em', '-4.5em', '-15em']
    );
    const logoScale = useTransform(scrollYProgress, [0, 0.08], [0.5, 0.5]);
    const logoOpacity = useTransform(scrollYProgress, [0.08, 0.083], [0, 1]);
    const logoRight = useTransform(scrollYProgress, [0.08, 0.09], ['-17em', '-17em']);

    return (
      <div>
        <div>
          <motion.div
            style={{
              scale,
              opacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('sky.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('stage0530.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('crowd0530.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('foreground-2.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <motion.div style={{ scale: logoScale, opacity: logoOpacity, y: logoRight }}>
              <img
                src={img('logo.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
              />
            </motion.div>

            <motion.div
              style={{
                scale: registerScale,
                opacity,
                y: registerYRight,
                x: 0
              }}
            >
              <img
                src={img('register.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
                onClick={() => {
                  window.location = '/register/login';
                }}
              />
            </motion.div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            ></div>
          </motion.div>
        </div>
      </div>
    );
  }
}
