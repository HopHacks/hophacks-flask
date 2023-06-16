import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { motion, useViewportScroll, useTransform } from 'framer-motion';

const useStyles = makeStyles({
  images: {
    position: 'absolute',
    overflow: 'hidden',
    top: '-34vw',
    left: '0.05%',
    width: '100%'
  },
  imagesNew: {
    position: 'absolute',
    overflow: 'hidden',
    top: '-27vw',
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

  const mobileScale = useTransform(scrollYProgress, [0, 0.02], [0.35, 0.35]);
  //const mobileScale = useTransform(scrollYProgress, [0, 0.02], [10, 3]);
  // const mobileRegisterScale = useTransform(scrollYProgress, [0, 0.02], [0.13, 0.3]);
  //const mobileOpacity = useTransform(scrollYProgress, [0, 0.02, 0.025, 0.06], [1, 1, 1, 0]);
  // const mobileYRight = useTransform(scrollYProgress, [0, 0.02], ['20em', '40em']);
  // const mobileRegisterYRight = useTransform(scrollYProgress, [0, 0.02], ['0em', '-3em']);

  const classes = useStyles();
  if (window.innerWidth <= 850) {
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
            src={img('zoomedouteverything0614.png')}
            style={{
              width: '100vw'
            }}
          />
          <motion.div
            style={{
              scale: mobileScale
            }}
          >
            <img
              src={img('register_button_alone.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
              onClick={() => {
                window.location = '/register/login';
              }}
              style={{ top: '-65vw', left: '4%' }}
            />
          </motion.div>
        </div>
      </div>
    );
  } else if (window.innerWidth <= 920) {
    const scale = useTransform(scrollYProgress, [0, 0.08], [1.7, 0.7423]);
    const registerScale = useTransform(scrollYProgress, [0, 0.08], [0.3, 0.3]);

    const backgroundScale = useTransform(scrollYProgress, [0, 0.08], [2.841, 1.3]);

    // const registerScale = useTransform(
    //   scrollYProgress,
    //   [0, 0.02, 0.04, 0.08],
    //   [0.13, 0.2, 0.24, 0.5]
    // );
    const opacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.3], [1, 1, 1, 0]);
    const backGroundOpacity = useTransform(scrollYProgress, [0, 0.04, 0.041, 0.3], [1, 1, 0, 0]);

    const registerOpacity = useTransform(
      scrollYProgress,
      [0, 0.08, 0.082, 0.16, 0.3],
      [0, 0, 1, 1, 0]
    );
    const yRight = useTransform(scrollYProgress, [0, 0.08], ['16vw', '83vw']);
    const registerYRight = useTransform(scrollYProgress, [0, 0.08], ['94vw', '94vw']);
    //const backgroundYRight = useTransform(scrollYProgress, [0.04, 0.08], ['10vw', '40vw']);

    // const registerYRight = useTransform(
    //   scrollYProgress,
    //   [0, 0.02, 0.04, 0.08],
    //   ['0.3em', '-2em', '-4.5em', '-15em']
    // );

    return (
      <div>
        <div>
          <motion.div
            style={{
              scale: backgroundScale,
              opacity: opacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('zoomedouteverything0614.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
          </motion.div>
          <motion.div
            style={{
              scale,
              opacity: backGroundOpacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('zoomedineverything0614.png')}
              //style={{ top: center(scale.current) }}
              className={classes.imagesNew}
              alt="image_could_not_load"
            />
          </motion.div>
          <motion.div
            style={{
              scale: backgroundScale,
              opacity: opacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('foreground-2.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
          </motion.div>
          <motion.div
            style={{
              scale: registerScale,
              opacity: registerOpacity,
              y: registerYRight,
              x: 0
            }}
          >
            <img
              src={img('register_button_alone.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
              onClick={() => {
                  window.location = '/register/login';
                }}
            />
          </motion.div>
          {/* <img
                src={img('register.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
                onClick={() => {
                  window.location = '/register/login';
                }}
              /> */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          ></div>
        </div>
      </div>
    );
  } else if (window.innerWidth <= 1000) {
    const scale = useTransform(scrollYProgress, [0, 0.08], [1.7, 0.571]);
    const registerScale = useTransform(scrollYProgress, [0, 0.08], [0.3, 0.3]);

    const backgroundScale = useTransform(scrollYProgress, [0, 0.08], [2.841, 1]);

    // const registerScale = useTransform(
    //   scrollYProgress,
    //   [0, 0.02, 0.04, 0.08],
    //   [0.13, 0.2, 0.24, 0.5]
    // );
    const opacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.3], [1, 1, 1, 0]);
    const backGroundOpacity = useTransform(scrollYProgress, [0, 0.04, 0.041, 0.3], [1, 1, 0, 0]);

    const registerOpacity = useTransform(
      scrollYProgress,
      [0, 0.08, 0.082, 0.16, 0.3],
      [0, 0, 1, 1, 0]
    );
    const yRight = useTransform(scrollYProgress, [0, 0.08], ['14vw', '73vw']);
    const registerYRight = useTransform(scrollYProgress, [0, 0.08], ['84vw', '84vw']);
    //const backgroundYRight = useTransform(scrollYProgress, [0.04, 0.08], ['10vw', '40vw']);

    // const registerYRight = useTransform(
    //   scrollYProgress,
    //   [0, 0.02, 0.04, 0.08],
    //   ['0.3em', '-2em', '-4.5em', '-15em']
    // );

    return (
      <div>
        <div>
          <motion.div
            style={{
              scale: backgroundScale,
              opacity: opacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('zoomedouteverything0614.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
          </motion.div>
          <motion.div
            style={{
              scale,
              opacity: backGroundOpacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('zoomedineverything0614.png')}
              //style={{ top: center(scale.current) }}
              className={classes.imagesNew}
              alt="image_could_not_load"
            />
          </motion.div>
          <motion.div
            style={{
              scale: backgroundScale,
              opacity: opacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('foreground-2.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
          </motion.div>
          <motion.div
            style={{
              scale: registerScale,
              opacity: registerOpacity,
              y: registerYRight,
              x: 0
            }}
          >
            <img
              src={img('register_button_alone.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
              onClick={() => {
                window.location = '/register/login';
              }}
            />
          </motion.div>
          {/* <img
                src={img('register.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
                onClick={() => {
                  window.location = '/register/login';
                }}
              /> */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          ></div>
        </div>
      </div>
    );
  } else if (window.innerWidth <= 1090) {
    const scale = useTransform(scrollYProgress, [0, 0.08], [1.7, 0.571]);
    const registerScale = useTransform(scrollYProgress, [0, 0.08], [0.3, 0.3]);

    const backgroundScale = useTransform(scrollYProgress, [0, 0.08], [2.841, 1]);

    // const registerScale = useTransform(
    //   scrollYProgress,
    //   [0, 0.02, 0.04, 0.08],
    //   [0.13, 0.2, 0.24, 0.5]
    // );
    const opacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.3], [1, 1, 1, 0]);
    const backGroundOpacity = useTransform(scrollYProgress, [0, 0.04, 0.041, 0.3], [1, 1, 0, 0]);

    const registerOpacity = useTransform(
      scrollYProgress,
      [0, 0.08, 0.082, 0.16, 0.3],
      [0, 0, 1, 1, 0]
    );
    const yRight = useTransform(scrollYProgress, [0, 0.08], ['11vw', '70vw']);
    const registerYRight = useTransform(scrollYProgress, [0, 0.08], ['81vw', '81vw']);

    //const backgroundYRight = useTransform(scrollYProgress, [0.04, 0.08], ['10vw', '40vw']);

    // const registerYRight = useTransform(
    //   scrollYProgress,
    //   [0, 0.02, 0.04, 0.08],
    //   ['0.3em', '-2em', '-4.5em', '-15em']
    // );

    return (
      <div>
        <div>
          <motion.div
            style={{
              scale: backgroundScale,
              opacity: opacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('zoomedouteverything0614.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
          </motion.div>
          <motion.div
            style={{
              scale,
              opacity: backGroundOpacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('zoomedineverything0614.png')}
              //style={{ top: center(scale.current) }}
              className={classes.imagesNew}
              alt="image_could_not_load"
            />
          </motion.div>
          <motion.div
            style={{
              scale: backgroundScale,
              opacity: opacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('foreground-2.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
          </motion.div>
          <motion.div
            style={{
              scale: registerScale,
              opacity: registerOpacity,
              y: registerYRight,
              x: 0
            }}
          >
            <img
              src={img('register_button_alone.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
              onClick={() => {
                window.location = '/register/login';
              }}
            />
          </motion.div>
          {/* <img
                src={img('register.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
                onClick={() => {
                  window.location = '/register/login';
                }}
              /> */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          ></div>
        </div>
      </div>
    );
  } else if (window.innerWidth <= 1200) {
    const scale = useTransform(scrollYProgress, [0, 0.08], [1.7, 0.571]);
    const registerScale = useTransform(scrollYProgress, [0, 0.08], [0.3, 0.3]);

    const backgroundScale = useTransform(scrollYProgress, [0, 0.08], [2.841, 1]);

    // const registerScale = useTransform(
    //   scrollYProgress,
    //   [0, 0.02, 0.04, 0.08],
    //   [0.13, 0.2, 0.24, 0.5]
    // );
    const opacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.3], [1, 1, 1, 0]);
    const backGroundOpacity = useTransform(scrollYProgress, [0, 0.04, 0.041, 0.3], [1, 1, 0, 0]);

    const registerOpacity = useTransform(
      scrollYProgress,
      [0, 0.08, 0.082, 0.16, 0.3],
      [0, 0, 1, 1, 0]
    );
    const yRight = useTransform(scrollYProgress, [0, 0.08], ['11vw', '65vw']);
    const registerYRight = useTransform(scrollYProgress, [0, 0.08], ['75vw', '75vw']);

    //const backgroundYRight = useTransform(scrollYProgress, [0.04, 0.08], ['10vw', '40vw']);

    // const registerYRight = useTransform(
    //   scrollYProgress,
    //   [0, 0.02, 0.04, 0.08],
    //   ['0.3em', '-2em', '-4.5em', '-15em']
    // );

    return (
      <div>
        <div>
          <motion.div
            style={{
              scale: backgroundScale,
              opacity: opacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('zoomedouteverything0614.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
          </motion.div>
          <motion.div
            style={{
              scale,
              opacity: backGroundOpacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('zoomedineverything0614.png')}
              //style={{ top: center(scale.current) }}
              className={classes.imagesNew}
              alt="image_could_not_load"
            />
          </motion.div>
          <motion.div
            style={{
              scale: backgroundScale,
              opacity: opacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('foreground-2.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
          </motion.div>
          <motion.div
            style={{
              scale: registerScale,
              opacity: registerOpacity,
              y: registerYRight,
              x: 0
            }}
          >
            <img
              src={img('register_button_alone.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
              onClick={() => {
                window.location = '/register/login';
              }}
            />
          </motion.div>
          {/* <img
                src={img('register.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
                onClick={() => {
                  window.location = '/register/login';
                }}
              /> */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          ></div>
        </div>
      </div>
    );
  } else {
    const scale = useTransform(scrollYProgress, [0, 0.08], [1.7, 0.571]);
    const registerScale = useTransform(scrollYProgress, [0, 0.08], [0.3, 0.3]);

    const backgroundScale = useTransform(scrollYProgress, [0, 0.08], [2.841, 1]);

    // const registerScale = useTransform(
    //   scrollYProgress,
    //   [0, 0.02, 0.04, 0.08],
    //   [0.13, 0.2, 0.24, 0.5]
    // );
    const opacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.3], [1, 1, 1, 0]);
    const backGroundOpacity = useTransform(scrollYProgress, [0, 0.04, 0.041, 0.3], [1, 1, 0, 0]);

    const registerOpacity = useTransform(
      scrollYProgress,
      [0, 0.08, 0.082, 0.16, 0.3],
      [0, 0, 1, 1, 0]
    );
    const yRight = useTransform(scrollYProgress, [0, 0.08], ['11vw', '58vw']);
    const registerYRight = useTransform(scrollYProgress, [0, 0.08], ['69vw', '69vw']);
    //const pos = useTransform(scrollYProgress, [0, 0.08, 0.16], ['fixed', 'fixed', 'absolute']);
    //const backgroundYRight = useTransform(scrollYProgress, [0.04, 0.08], ['10vw', '40vw']);

    // const registerYRight = useTransform(
    //   scrollYProgress,
    //   [0, 0.02, 0.04, 0.08],
    //   ['0.3em', '-2em', '-4.5em', '-15em']
    // );

    return (
      <div>
        <div>
          <motion.div
            style={{
              scale: backgroundScale,
              opacity: opacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('zoomedouteverything0614.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
          </motion.div>
          <motion.div
            style={{
              scale,
              opacity: backGroundOpacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('zoomedineverything0614.png')}
              //style={{ top: center(scale.current) }}
              className={classes.imagesNew}
              alt="image_could_not_load"
            />
          </motion.div>
          <motion.div
            style={{
              scale: backgroundScale,
              opacity: opacity,
              y: yRight,
              x: 0
            }}
          >
            <img
              src={img('foreground-2.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
          </motion.div>
          <motion.div
            style={{
              scale: registerScale,
              opacity: registerOpacity,
              y: registerYRight,
              x: 0
            }}
          >
            <img
              src={img('register_button_alone.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
              onClick={() => {
                window.location = '/register/login';
              }}
            />
          </motion.div>
          {/* <img
                src={img('register.png')}
                //style={{ top: center(scale.current) }}
                className={classes.images}
                alt="image_could_not_load"
                onClick={() => {
                  window.location = '/register/login';
                }}
              /> */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          ></div>
        </div>
      </div>
    );
  }
}
