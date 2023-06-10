import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
//import Button from '@material-ui/core/Button';
//import { motion, useScroll } from "framer-motion/dist/framer-motion"; // Needs to be added to requirements.txt
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
// export default function Cover() {
//   return (
//     <div>
//       <div>
//         <img
//           src={img('homepage-desktop.png')}
//           style={{
//             width: '100vw'
//           }}
//         />
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center'
//           }}
//         ></div>
//       </div>
//     </div>
//   );
// }
export default function Cover() {
  //const [imageLoading, setImageLoading] = useState(true);
  //const [pulsing, setPulsing] = useState(true);
  const { scrollYProgress } = useViewportScroll();
  //fit to screen size:1.165
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

  const mobileScale = useTransform(scrollYProgress, [0, 0.02], [0.4, 0.4]);
  //const mobileScale = useTransform(scrollYProgress, [0, 0.02], [10, 3]);

  // const mobileRegisterScale = useTransform(scrollYProgress, [0, 0.02], [0.13, 0.3]);
  //const mobileOpacity = useTransform(scrollYProgress, [0, 0.02, 0.025, 0.06], [1, 1, 1, 0]);
  // const mobileYRight = useTransform(scrollYProgress, [0, 0.02], ['20em', '40em']);
  // const mobileRegisterYRight = useTransform(scrollYProgress, [0, 0.02], ['0em', '-3em']);

  const classes = useStyles();
  if (window.innerWidth <= 650) {
    return (
      <div>
        <div style={{}}>
          <img
            src={img('homepage-desktop.png')}
            style={{
              width: '100vw'
            }}
          />
          {/* <motion.div style={{ opacity: mobileOpacity }}>
            <img
              src={img('sky.png')}
              //style={{ top: center(scale.current) }}
              className={classes.mobileImages}
              alt="image_could_not_load"
            />
            <img
              src={img('stage0530.png')}
              //style={{ top: center(scale.current) }}
              className={classes.mobileImages}
              alt="image_could_not_load"
            />
            <img
              src={img('crowd0530.png')}
              //style={{ top: center(scale.current) }}
              className={classes.mobileImages}
              alt="image_could_not_load"
            />
            <img
              src={img('foreground-2.png')}
              //style={{ top: center(scale.current) }}
              className={classes.mobileImages}
              alt="image_could_not_load"
            /> */}
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            ></div>
          </motion.div> */}
        </div>
      </div>
    );
  } else {
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
      /*<div>
        <div ref={elemRef}>
          <img
            src={img("2023_theme.png")}
            style={{
              position: "absolute",
              top: "0%",
              left: "0%",
              width: "100%",
              height: "100%",
              %transform: `scale(${scale})`,

            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
          </div>
        </div>
      </div>*/
    );
  }
}
