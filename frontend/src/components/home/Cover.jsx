import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
//import Button from '@material-ui/core/Button';
//import { motion, useScroll } from "framer-motion/dist/framer-motion"; // Needs to be added to requirements.txt
import { motion, useViewportScroll, useTransform } from 'framer-motion/dist/framer-motion';

const useStyles = makeStyles({
  images: {
    position: 'fixed',
    overflow: 'hidden',
    top: '-40vw',
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
  const scale = useTransform(scrollYProgress, [0, 0.08], [4, 1.165]);
  const opacity = useTransform(scrollYProgress, [0, 0.08, 0.08], [1, 1, 0]);
  const mobileScale = useTransform(scrollYProgress, [0, 0.02], [10, 3.4]);
  const mobileOpacity = useTransform(scrollYProgress, [0, 0.02, 0.03], [1, 1, 0]);
  //const yRight = useTransform(scrollYProgress, [0, 0.08], ['-70vh', '0vh']);
  //const centerString = center.current + 'vw';
  // const imageLoaded = () => {
  //   setImageLoading(false);
  //   setTimeout(() => setPulsing(false), 600);
  // };

  const classes = useStyles();
  if (window.innerWidth <= 650) {
    return (
      <div style={{}}>
        <div>
          <motion.div
            style={{
              scale: mobileScale,
              opacity: mobileOpacity
            }}
          >
            <img
              src={img('demo_sky.png')}
              style={{
                position: 'absolute',
                overflow: 'hidden',
                top: '0vw',
                left: '0%',
                width: '100%'
              }}
              alt="hello"
            />
            <img
              src={img('demo_stage.png')}
              style={{
                position: 'absolute',
                overflow: 'hidden',
                top: '0vw',
                left: '0%',
                width: '100%'
              }}
              alt="hello"
            />
            <img
              src={img('demo_crowds.png')}
              style={{
                position: 'absolute',
                overflow: 'hidden',
                top: '0vw',
                left: '0%',
                width: '100%'
              }}
              alt="hello"
            />
            <img
              src={img('demo_foreground.png')}
              style={{
                position: 'absolute',
                top: '0vw',
                left: '0%',
                width: '100%'
              }}
              alt="hello"
            />

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
    return (
      <div style={{}}>
        <div>
          <motion.div
            style={{
              scale,
              opacity
              //top: yRight
            }}
          >
            <img
              src={img('sky.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('stage.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('crowds.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />
            <img
              src={img('foreground.png')}
              //style={{ top: center(scale.current) }}
              className={classes.images}
              alt="image_could_not_load"
            />

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
