import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
const useStyles = makeStyles({
    margin: {
      marginBottom: '20px'
    },
    title: {
      color: '#000000',
      fontFamily: 'PT Sans'
    },
    button: {
      color: '#841584'
    },
    btn_text: {
      color: '#ffffff'
    }
  });

export default function Sponsors() {
    const classes = useStyles();
    const title = (
      <Typography
        className={classes.title}
        variant="h3"
        gutterBottom
        style={{
          display: 'flex',
          alignItems: 'left',
          justifyContent: 'left',
          height: '80%'
        }}
      >
        Sponsors
      </Typography>
    );

    const subtext = (
      <Typography
        variant="h5"
        style={{
          display: 'flex',
          alignItems: 'left',
          justifyContent: 'left',
          height: '10%'
        }}
      >
        Interested in sponsoring us? Email us at hophacks.sponsors@gmail.com 
      </Typography>
    );

    const goldBox = {
        backgroundColor: ' #FFD700',
        width: '80px',
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '30px',
    };

    const gold = (
        <div style = {goldBox}>
            <Typography
                variant = "h4"
                style={{
                    display: 'inline-block', transform: 'rotate(270deg)'
                }}
            >
                GOLD
            </Typography>
        </div>
        
    );

    const sableBox = {
        backgroundColor: '#4f9e4c',
        width: '80px',
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '30px',
    };

    const sable = (
        <div style = {sableBox}>
            <Typography
                variant = "h4"
                style={{
                    display: 'inline-block', transform: 'rotate(270deg)'
                }}
            >
                SABLE
            </Typography>
        </div>
        
    );

    const blueBox = {
        backgroundColor: 'blue',
        width: '80px',
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '30px',
    };

    const blue = (
        <div style = {blueBox}>
            <Typography
                variant = "h4"
                style={{
                    display: 'inline-block', transform: 'rotate(270deg)'
                }}
            >
                BLUE
            </Typography>
        </div>
        
    );

    const starterBox = {
        backgroundColor: 'red',
        width: '80px',
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '30px',
    };

    const starter = (
        <div style = {starterBox}>
            <Typography
                variant = "h4"
                style={{
                    display: 'inline-block', transform: 'rotate(270deg)'
                }}
            >
                STARTER
            </Typography>
        </div>
        
    );

    const goldStyle = {
        border: '20px solid gold', width: '250px'
    };

    const goldSponsor = (
        <img src={'https://hophacks-image.s3.amazonaws.com/hop.png'} style={goldStyle}/>
    );

    const sableStyle = {
        border: '20px solid #4f9e4c', width: '250px'
    };

    const sableSponsor = (
        <img src={'https://hophacks-image.s3.amazonaws.com/hop.png'} style={sableStyle}/>
    );

    const blueStyle = {
        border: '20px solid blue', width: '250px'
    };

    const blueSponsor = (
        <img src={'https://hophacks-image.s3.amazonaws.com/hop.png'} style={blueStyle}/>
    );

    const starterStyle = {
        border: '20px solid red', width: '250px'
    };

    const starterSponsor = (
        <img src={'https://hophacks-image.s3.amazonaws.com/hop.png'} style={starterStyle}/>
    );
  
    return (
      <div>
        <div className="hero">
          <Grid
            container
            spacing={3}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Grid item>
              <Grid container spacing={3}>
                <Grid item xs={10} s={10} md={10}>
                    {title}
                </Grid>
                <Grid item xs={10} s={10} md={10}>
                    {subtext}
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item>
                    {gold}
                </Grid>
                <Grid item>
                    {goldSponsor}
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item>
                    {sable}
                </Grid>
                <Grid item>
                    {sableSponsor}
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item>
                    {blue}
                </Grid>
                <Grid item>
                    {blueSponsor}
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item>
                    {starter}
                </Grid>
                <Grid item>
                    {starterSponsor}
                </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }

// import React from 'react';

// import Box from '@material-ui/core/Box';

// import { makeStyles } from '@material-ui/core/styles';

// // function img(url) {
// //   return 'https://hophacks-website.s3.amazonaws.com/images/sponsor/png/' + url;
// // }

// const useStyles = makeStyles({
//   title: {
//     fontFamily: 'Inter',
//     textAlign: 'center',
//     fontWeight: 'bold',
//     fontSize: '3rem',
//     color: '#1D539F',
//     margin: '0 0rem'
//   },
//   contact: {
//     fontFamily: 'Inter',
//     fontStyle: 'italic',
//     textAlign: 'center',
//     fontSize: '1rem',
//     margin: '0.5rem',
//     color: '#1D539F'
//   },
//   comingSoon: {
//     fontFamily: 'Inter',
//     fontStyle: 'italic',
//     textAlign: 'center',
//     fontSize: '1.5rem',
//     margin: '0.5rem',
//     color: '#1D539F'
//   }
// });

// // function SponsorItem({ size, logo, width = '85%', link = '#sponsors' }) {
// //   return (
// //     <a
// //       style={{ display: 'table-cell', textDecoration: 'none' }}
// //       href={link}
// //       target={'_blank'}
// //       rel={'noreferrer'}
// //     >
// //       <div className="sponsor-wrapper">
// //         <div className={`sponsor-foreground sponsor-${size} sponsor-children`}>
// //           <img src={img(logo)} style={{ width }} className="sponsor-img" />
// //           <div className={`sponsor-background sponsor-${size}`}></div>
// //         </div>
// //       </div>
// //     </a>
// //   );
// // }

// export default function Sponsors() {
//   const classes = useStyles();

//   return (
//     <Box marginTop={'10rem'} justifyContent="center" className="sponsor-container" id="sponsors">
//       <Box display="flex" className="sponsor-title">
//         <div className={classes.title}>Sponsors</div>
//         <div className={classes.contact}>
//           Interested in sponsoring us? Email us at
//           <a className={classes.contact} href={`mailto:hophacks.sponsors@gmail.com`}>
//             hophacks.sponsors@gmail.com
//           </a>
//         </div>
//       </Box>
//       <div className={classes.comingSoon}>Coming Soon!</div>
//       <div className="sponsor-row">
//         {/* Sponsors coming soon! */}
//         {/* <SponsorItem logo="it.png" size="sable" link="https://it.johnshopkins.edu/" />
//         <SponsorItem
//           logo="bloomberg23.png"
//           size="gold"
//           link="https://www.bloomberg.com/company/"
//           width="85%"
//         />
//         <SponsorItem
//           logo="PatientSafety.png"
//           size="sable"
//           link="https://www.patientsafetytech.com/"
//         />
//       </div>
//       <div className="sponsor-row">
//         <SponsorItem logo="twilio.png" size="sable" link="https://www.twilio.com/en-us" />
//         <SponsorItem
//           logo="bgb-white.png"
//           size="gold"
//           link="https://www.bgbgroup.com/"
//           width="95%"
//         />
//         <SponsorItem logo="scm.svg" size="sable" link="https://www.scm-lp.com/" />
//       </div>
//       <div className="sponsor-row">
//         <SponsorItem logo="cbid.png" size="lab" link="https://cbid.bme.jhu.edu/" />
//         <SponsorItem logo="jhuiaa.webp" size="lab" link="https://iaa.jhu.edu/" />
//         <SponsorItem
//           logo="jhmi_tic.png"
//           size="blue"
//           link="https://www.hopkinsmedicine.org/technology_innovation/"
//           width="70%"
//         />
//         <SponsorItem logo="jhu_cs.png" size="blue" link="https://www.cs.jhu.edu/" width="120%" />
//       </div>
//       <div className="sponsor-row">
//         <SponsorItem logo="jhume.jpg" size="blue" link="https://me.jhu.edu/" width="94%" />

//         <SponsorItem logo="tunnel.svg" size="blue" link="https://tunnel.dev/" width="85%" />
//         <SponsorItem logo="jhuapl.png" size="blue" link="https://www.jhuapl.edu/" width="120%" />
//         <SponsorItem logo="jhfcu_2.png" size="custom" link="https://www.jhfcu.org/" width="95%" />
//       </div>
//       <div className="sponsor-row">
//         <SponsorItem logo="GCP.png" size="inkind" link="https://cloud.google.com" width="60%" />
//         <SponsorItem logo="wolfram.png" size="inkind" link="https://www.wolframalpha.com/" />
//         <SponsorItem
//           logo="stickerMule.png"
//           size="inkind"
//           link="https://www.stickermule.com/uses/laptop-stickers?utm_source=referral_us&utm_medium=sponsorships_us&utm_campaign=hophacks2023"
//         />
//         <SponsorItem
//           logo="leading_learners.jpeg"
//           size="inkind"
//           link="https://www.leading-learners.com/"
//           width="40%"
//         />
//         <SponsorItem logo="verbwire.svg" size="inkind" link="https://www.verbwire.com/" />
//       </div>
//       <div className="sponsor-row">
//         <SponsorItem logo="echo3D.webp" size="inkind" link="https://www.echo3d.com/" />
//         <SponsorItem
//           logo="ffu.png"
//           size="inkind"
//           link="https://ventures.jhu.edu/programs-services/fastforward-u/"
//         />
//         <SponsorItem
//           logo="incogniblack.png"
//           size="inkind"
//           link="https://incogni.com/ "
//           width="80%"
//         /> */}
//       </div>
//     </Box>
//   );
// }
