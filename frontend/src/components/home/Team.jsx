import React from "react";

import Box from '@material-ui/core/Box';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles({

  box: {
    width: '100%',
  },

  root: {
    flexGrow: 1,
    backgroundColor: "#eef7ff",
  },

  title: {
    color: "#7289da",
    fontFamily: "Inter",
  },

  team: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '10px',
    justifyContent: 'center',
  },

  teambox: {
    textAlign: 'center',
    marginTop: '30px',
    minHeight: '210px',
    minWidth: '210px',
    maxWidth: '300px',
    maxHeight: '300px',
    margin: '10px',
    padding: '2.5px 20px',
    display: 'flex',
    justifyContent: 'center',
  },

  memberPic: {
    width: '210px',
    height: '210px',
    borderRadius: '10px',
  },

  memberBg: {
    width: '210px',
    height: '210px',
    borderRadius: '10px',
    backgroundColor: 'black',
    textAlign: 'right',
    position: 'relative',
  },

});

function img(url) {
  //return process.env.PUBLIC_URL + '/images/' + url;
  return "https://hophacks-website.s3.amazonaws.com/images/" + url 
}

function MemberItem(props) {
  const [buttons, setButtons] = React.useState({ display: 'none' });
  const [background, setBackground] = React.useState({ opacity: 1 });

  const classes = useStyles();
  let linkedin = (null);
  let github = (null);
  let personal = (null);

  if (props.linkedin) {
    linkedin = <a target="_blank" href={`${props.linkedin}`}><img style={buttons} className="social-icon linkedin" src={img("social/linkedin-white.png")} alt="linkedin" /></a>;
  }

  if (props.github) {
    github = <a target="_blank" href={`${props.github}`}><img style={buttons} className="social-icon github" src={img("social/github-white.png")} alt="github" /></a>;
  }

  if (props.personal) {
    personal = <a target="_blank" href={`${props.personal}`}><img style={buttons} className="social-icon personal" src={img("social/personal-white.png")} alt="personal" /></a>;
  }

  return (
    <Grid item >
      <div
        onMouseEnter={e => {
          setButtons({ display: '' });
          setBackground({ opacity: 0.7 })
        }}
        onMouseLeave={e => {
          setButtons({ display: 'none' })
          setBackground({ opacity: 1 })
        }}
      >
        <div className={classes.memberBg}>
          <div className={classes.memberPic}>
            <img className={classes.memberPic} style={background} src={img(`team/img/${props.imgURL}.jpg`)} alt="loading" />
            {linkedin}
            {github}
            {personal}
          </div>

        </div>
        <Typography color="textSecondary"><strong>{props.memberName}</strong></Typography>
        <Typography>{props.memberTitle}</Typography>
      </div>
    </Grid>
  );

}

export default function Team() {

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    if (!Number.isInteger(newValue)) {
      newValue = newValue.props.value;
    }
    setValue(newValue);    
  };

  const classes = useStyles();

  return (
    <Box className={classes.box} py={2}> 
      <Typography className={classes.title} variant="h4" gutterBottom>Our Perfect Team</Typography>
      <Paper className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="DIRECTORS" />
          <Tab label="DESIGN" />
          <Tab label="LOGISTICS" />
          <Tab label="SOCIAL/PR" />
          <Tab label="SPONSORS" />
          <Tab label="WEBSITE" />
          <Tab label="ALUMNI" />
        </Tabs>
        {value === 0 && <Grid className={classes.team} container>
          <div className={classes.teambox}>
            <MemberItem imgURL="Akhil" memberName="Akhil Deo" memberTitle="Director" linkedin="https://www.linkedin.com/in/akhildeo" github="https://github.com/akhildeo" />
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="joanne" memberName="Joanne Selinski" memberTitle="Faculty Advisor" />
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="kelly" memberName="Kelly Culotta" memberTitle="Admin Coordinator" />
          </div>
        </Grid>}
        {value === 1 && <Grid className={classes.team} container>
          <div className={classes.teambox}>
          <MemberItem imgURL="Elizabeth" memberName="Elizabeth Hsieh" memberTitle="Design Head" linkedin="https://www.linkedin.com/in/elizabeth-hsieh/"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="Miranda" memberName="Miranda Bian" memberTitle="Design"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="Jam" memberName="Jam Navarro" memberTitle="Design" linkedin="https://www.linkedin.com/in/jam-navarro" github="https://github.com/jamnavarro"/>
          </div>
          {/* <div className={classes.teambox}>
            <MemberItem imgURL="Quinyue" memberName="Quinyue Huang" memberTitle="Design"/>
          </div> */}
          <div className={classes.teambox}>
            <MemberItem imgURL="ElizabethCho" memberName="Elizabeth Cho" memberTitle="Design" linkedin="https://www.linkedin.com/in/elizabeth-c-cho/" github="https://github.com/Elizabeth-Cho" personal="https://elizabeth-cho.github.io/"/>
          </div>
        </Grid>}
        {value === 2 && <Grid className={classes.team} container>
          <div className={classes.teambox}>
            <MemberItem imgURL="Sejal" memberName="Sejal Srivastava" memberTitle="Logistics Head" linkedin="https://www.linkedin.com/in/sejal-srivastava0123"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="Iris" memberName="Iris Gupta" memberTitle="Logistics" linkedin="https://www.linkedin.com/in/iris-gupta-5b422a190" />
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="Minoo" memberName="Minoo Kim" memberTitle="Logistics" linkedin="https://www.linkedin.com/in/minoo-kim-166b50231/"/>
          </div>
          {/* <div className={classes.teambox}>
            <MemberItem imgURL="Daniel" memberName="Daniel Song" memberTitle="Logistics"/>
          </div> */}
          
        </Grid>}
        {value === 3 && <Grid className={classes.team} container>
          <div className={classes.teambox}>
            <MemberItem imgURL="Elizabeth" memberName="Elizabeth Hsieh" memberTitle="Social/PR Head" linkedin="https://www.linkedin.com/in/elizabeth-hsieh/"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="Elva" memberName="Ruoyan Shang" memberTitle="Social/PR" linkedin="https://www.linkedin.com/in/ruoyan-shang/" github="https://github.com/Elvaaaaaa"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="Milton" memberName="Milton Diaz" memberTitle="Social/PR" linkedin="https://www.linkedin.com/in/milton-diaz/"/>
          </div>
        </Grid>}
        {value === 4 && <Grid className={classes.team} container>
          <div className={classes.teambox}>
           <MemberItem imgURL="Josephine" memberName="Josephine Deng" memberTitle="Sponsors Head" linkedin="https://www.linkedin.com/in/josephine-deng"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="Dhruv" memberName="Dhruv Dubey" memberTitle="Sponsors" linkedin="https://www.linkedin.com/in/dhruv-dubey-51660b1b7/"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="Sky" memberName="Anthony Sky Ng-Thow-Hing" memberTitle="Sponsors" linkedin="https://www.linkedin.com/in/anthony-sky-ng-thow-hing-9b1352193/" github="https://github.com/skynth"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="Sujin" memberName="Sujin Lee" memberTitle="Sponsors" linkedin="https://www.linkedin.com/in/sujin-lee-6a0766258" github="https://github.com/lsj0232191"/>
          </div>
          {/* <div className={classes.teambox}>
            <MemberItem imgURL="Liwen" memberName="Liwen Tran" memberTitle="Sponsors"/>
          </div> */}
        </Grid>}
        {value === 5 && <Grid className={classes.team} container>
          <div className={classes.teambox}>
           <MemberItem imgURL="Julia" memberName="Julia Bian" memberTitle="Website Head" linkedin="https://www.linkedin.com/in/juliabian/"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="Shaopeng" memberName="Shaopeng Zeng" memberTitle="Website" linkedin="https://www.linkedin.com/in/shaopeng-zeng-862154149/"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="Muxi" memberName="Muxi Lyu" memberTitle="Website" linkedin="www.linkedin.com/in/muxi-lyu-652a04223/" github="https://github.com/MuxiLyuLucy"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="Jacky" memberName="Jacky Wang" memberTitle="Website" linkedin="https://www.linkedin.com/in/jiaqi-jacky-wang/, https://github.com/JiaqiWang18"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="Nish" memberName="Nishikar Paruchuri" memberTitle="Website"/>
          </div>
        </Grid>}
        {value === 6 && <Grid className={classes.team} container>
          <div className={classes.teambox}>
            <MemberItem imgURL="curtis_headshot" memberName="Curtis Ahn" memberTitle="Amazon" linkedin="https://www.linkedin.com/in/ctsahn/"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="LaurenBack" memberName="Lauren Back" memberTitle="" linkedin="https://www.linkedin.com/in/backs/"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="ElaineHe" memberName="Elaine He" memberTitle="" linkedin="https://www.linkedin.com/in/jiayi-elaine-he/"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="AnhTran" memberName="Trần Thế Anh" memberTitle="Mission Data" linkedin="https://www.linkedin.com/in/anh-the-tran/"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="ZoeKim" memberName="Zoe Kim" memberTitle="Masters at UMichigan" linkedin="https://www.linkedin.com/in/kimminjeong/"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="LaineWang" memberName="Laine Wang" memberTitle="" linkedin="https://www.linkedin.com/in/yuelian-wang-9a48b71a4/"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="StellaLi" memberName="Stella Li" memberTitle="" linkedin="https://www.linkedin.com/in/stella-li-1106/"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="AlanLi" memberName="Alan Li" memberTitle="" linkedin=""/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="NicholasBowen" memberName="Nicolas Bowen" memberTitle="Palantir" linkedin="https://www.linkedin.com/in/stella-li-1106/"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="brandon_headshot" memberName="Brandon Wong" memberTitle="Nuro" linkedin="https://linkedin.com/in/brandonynwong" github="https://github.com/bwong19"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="elaine" memberName="Elaine Wong" memberTitle="Meta" linkedin="https://www.linkedin.com/in/ewong127/"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="alison_headshot" memberName="Alison Lee" memberTitle="Meta"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="az" memberName="Andrew Zhang" memberTitle="Datadog" linkedin="https://www.linkedin.com/in/yzhan289/"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="jimmy_headshot" memberName="Jimmy Shi"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="kavan_headshot" memberName="Kavan Bansal" memberTitle="Amazon" linkedin="https://www.linkedin.com/in/kavanbansal/"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="charissa_headshot" memberName="Charissa Zou" memberTitle="Meta" linkedin="https://www.linkedin.com/in/charissa-zou/"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="dan" memberName="Daniel Qian" memberTitle="Bloomberg" linkedin="https://www.linkedin.com/in/daniel-qian/"/>
          </div>
          <div className={classes.teambox}>
            <MemberItem imgURL="brice" memberName="Brice Halder" memberTitle="Meta" linkedin="https://www.linkedin.com/in/brice-halder/"/>
          </div>
        </Grid>}
      </Paper>
    </Box>
  );
}