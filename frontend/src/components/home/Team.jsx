import React from 'react';

import Box from '@material-ui/core/Box';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles({
  box: {
    width: '100%'
  },

  root: {
    flexGrow: 1,
    backgroundColor: '#D9D9D9'
  },

  title: {
    color: '#172759',
    fontFamily: 'Proxima-Nova',
    fontWeight: 'bold',
    justifyContent: 'center'
  },

  team: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '10px',
    justifyContent: 'center',
    backgroundColor: '#D9D9D9'
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
    backgroundColor: '#D9D9D9'
  },

  memberPic: {
    width: '210px',
    height: '210px',
    borderRadius: '10px'
  },

  memberBg: {
    width: '210px',
    height: '210px',
    borderRadius: '10px',
    backgroundColor: 'black',
    textAlign: 'right',
    position: 'relative'
  },
  menu: {
    backgroundColor: '#76879B',
    borderRadius: '20px',
    width: '90%',
    borderBottomRightRadius: '0px'
  },

  nameText: {
    color: '#172759'
  },

  tabTitle: {
    color: '#F3F6FB',
    fontWeight: 'bold',
    width: '14%',
    minWidth: '14%'
  },
  mobileTabTitle: {
    color: '#F3F6FB',
    fontWeight: 'bold'
  },

  cardBackground: {
    backgroundColor: '#D9D9D9',
    boxShadow: '0vw 0vw #76879B'
  }
});

function img(url) {
  //return process.env.PUBLIC_URL + '/images/' + url;
  return 'https://hophacks-website.s3.amazonaws.com/images/' + url;
}

function MemberItem(props) {
  const [buttons, setButtons] = React.useState({ display: 'none' });
  const [background, setBackground] = React.useState({ opacity: 1 });

  const classes = useStyles();
  let linkedin = null;
  let github = null;
  let personal = null;

  if (props.linkedin) {
    linkedin = (
      <a target="_blank" href={`${props.linkedin}`} rel="noreferrer">
        <img
          style={buttons}
          className="social-icon linkedin"
          src={img('social/linkedin-white.png')}
          alt="linkedin"
        />
      </a>
    );
  }

  if (props.github) {
    github = (
      <a target="_blank" href={`${props.github}`} rel="noreferrer">
        <img
          style={buttons}
          className="social-icon github"
          src={img('social/github-white.png')}
          alt="github"
        />
      </a>
    );
  }

  if (props.personal) {
    personal = (
      <a target="_blank" href={`${props.personal}`} rel="noreferrer">
        <img
          style={buttons}
          className="social-icon personal"
          src={img('social/personal-white.png')}
          alt="personal"
        />
      </a>
    );
  }

  return (
    <Grid item>
      <div
        onMouseEnter={() => {
          setButtons({ display: '' });
          setBackground({ opacity: 0.7 });
        }}
        onMouseLeave={() => {
          setButtons({ display: 'none' });
          setBackground({ opacity: 1 });
        }}
      >
        <div className={classes.memberBg}>
          <div className={classes.memberPic}>
            <img
              className={classes.memberPic}
              style={background}
              src={img(`team/img/${props.imgURL}`)}
              alt="loading"
            />
            {linkedin}
            {github}
            {personal}
          </div>
        </div>
        <Typography className={classes.nameText}>
          <strong>{props.memberName}</strong>
        </Typography>
        <Typography className={classes.nameText}>{props.memberTitle}</Typography>
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

  function tabs() {
    if (window.innerWidth <= 650) {
      return (
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          indicatorColor="primary"
          textColor="#F3F6FB"
          centered
          className={classes.menu}
        >
          <Tab label="DIRECTORS" className={classes.mobileTabTitle} />
          <Tab label="DESIGN" className={classes.mobileTabTitle} />
          <Tab label="LOGISTICS" className={classes.mobileTabTitle} />
          <Tab label="SOCIAL/PR" className={classes.mobileTabTitle} />
          <Tab label="SPONSORS" className={classes.mobileTabTitle} />
          <Tab label="WEBSITE" className={classes.mobileTabTitle} />
          <Tab label="ALUMNI" className={classes.mobileTabTitle} />
        </Tabs>
      );
    } else {
      return (
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          indicatorColor="primary"
          textColor="#F3F6FB"
          centered
          className={classes.menu}
        >
          <Tab label="DIRECTORS" className={classes.tabTitle} />
          <Tab label="DESIGN" className={classes.tabTitle} />
          <Tab label="LOGISTICS" className={classes.tabTitle} />
          <Tab label="SOCIAL/PR" className={classes.tabTitle} />
          <Tab label="SPONSORS" className={classes.tabTitle} />
          <Tab label="WEBSITE" className={classes.tabTitle} />
          <Tab label="ALUMNI" className={classes.tabTitle} />
        </Tabs>
      );
    }
  }
  return (
    <Box className={classes.box}>
      <Typography className={classes.title} variant="h4" gutterBottom>
        Our Team
      </Typography>
      <Paper className={classes.cardBackground}>
        {tabs()}
        {value === 0 && (
          <Grid className={classes.team} container>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="Josephine.png"
                memberName="Josephine Deng"
                memberTitle="Director"
                linkedin="https://www.linkedin.com/in/josephine-deng"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="Muxi.png"
                memberName="Muxi Lyu"
                memberTitle="Director"
                linkedin="www.linkedin.com/in/muxi-lyu-652a04223/"
                github="https://github.com/MuxiLyuLucy"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="joanne.jpg"
                memberName="Joanne Selinski"
                memberTitle="Faculty Advisor"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem imgURL="lyn.jpg" memberName="Lyn Doan" memberTitle="Admin Coordinator" />
            </div>
          </Grid>
        )}
        {value === 1 && (
          <Grid className={classes.team} container>
            <div className={classes.teambox}>
              <MemberItem imgURL="Emily.png" memberName="Emily Kim" memberTitle="Design" />
            </div>
            <div className={classes.teambox}>
              <MemberItem imgURL="Cynthia.png" memberName="Cynthia Wang" memberTitle="Design" />
            </div>
          </Grid>
        )}
        {value === 2 && (
          <Grid className={classes.team} container>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="Minoo.jpg"
                memberName="Minoo Kim"
                memberTitle="Logistics Head"
                linkedin="https://www.linkedin.com/in/minoo-kim-166b50231/"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem imgURL="Eva.png" memberName="Eva Loftus" memberTitle="Logistics" />
            </div>
            <div className={classes.teambox}>
              <MemberItem imgURL="Liam.png" memberName="Liam Finn" memberTitle="Logistics" />
            </div>
          </Grid>
        )}
        {value === 3 && (
          <Grid className={classes.team} container>
            <div className={classes.teambox}>
              <MemberItem imgURL="Anvi.png" memberName="Anvi Mishra" memberTitle="Marketing Head" />
            </div>
            <div className={classes.teambox}>
              <MemberItem imgURL="Daniel.jpg" memberName="Daniel Song" memberTitle="Marketing" />
            </div>
          </Grid>
        )}
        {value === 4 && (
          <Grid className={classes.team} container>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="Malcolm.png"
                memberName="Malcolm Krolick"
                memberTitle="Sponsors"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem imgURL="Jasmine.png" memberName="Jasmine Yoon" memberTitle="Sponsors" />
            </div>
            <div className={classes.teambox}>
              <MemberItem imgURL="Lia.png" memberName="Lia Kim" memberTitle="Sponsors" />
            </div>
          </Grid>
        )}
        {value === 5 && (
          <Grid className={classes.team} container>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="Nish.jpg"
                memberName="Nishikar Paruchuri"
                memberTitle="Website Head"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem imgURL="Clara.png" memberName="Clara Jeon" memberTitle="Website" />
            </div>
            <div className={classes.teambox}>
              <MemberItem imgURL="Sujin.jpg" memberName="Sujin Lee" memberTitle="Website" />
            </div>
            <div className={classes.teambox}>
              <MemberItem imgURL="Lucy.png" memberName="Lucy Wu" memberTitle="Website" />
            </div>
            <div className={classes.teambox}>
              <MemberItem imgURL="Jayden.png" memberName="Jayden Moon" memberTitle="Website" />
            </div>
            <div className={classes.teambox}>
              <MemberItem imgURL="Ryan.png" memberName="Ryan Wu" memberTitle="Website" />
            </div>
          </Grid>
        )}
        {value === 6 && (
          <Grid className={classes.team} container>
            <div className={classes.teambox}>
              <MemberItem imgURL="Akhil.jpg" memberName="Akhil Deo" memberTitle="JHU" />
            </div>

            <div className={classes.teambox}>
              <MemberItem imgURL="Julia.jpg" memberName="Julia Bian" memberTitle="Meta" />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="Shaopeng.jpg"
                memberName="Shaopeng Zeng"
                memberTitle="Amazon"
                linkedin="https://www.linkedin.com/in/shaopeng-zeng-862154149/"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="Jacky.jpg"
                memberName="Jacky Wang"
                memberTitle="Website"
                linkedin="https://www.linkedin.com/in/jiaqi-jacky-wang/, https://github.com/JiaqiWang18"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="Elva.jpg"
                memberName="Ruoyan Shang"
                memberTitle="DataBricks"
                linkedin="https://www.linkedin.com/in/ruoyan-shang/"
                github="https://github.com/Elvaaaaaa"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="Sejal.jpg"
                memberName="Sejal Srivastava"
                memberTitle="Accenture"
                linkedin="https://www.linkedin.com/in/sejal-srivastava0123"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="Jam.jpg"
                memberName="Jam Navarro"
                memberTitle="JHU"
                linkedin="https://www.linkedin.com/in/jam-navarro"
                github="https://github.com/jamnavarro"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="Elizabeth.jpg"
                memberName="Elizabeth Hsieh"
                linkedin="https://www.linkedin.com/in/elizabeth-hsieh/"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="curtis_headshot.jpg"
                memberName="Curtis Ahn"
                memberTitle="Amazon"
                linkedin="https://www.linkedin.com/in/ctsahn/"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="kelly.jpg"
                memberName="Kelly Culotta"
                memberTitle="Admin Coordinator"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="ElizabethCho.jpg"
                memberName="Elizabeth Cho"
                memberTitle="Capital One"
                linkedin="https://www.linkedin.com/in/elizabeth-c-cho/"
                github="https://github.com/Elizabeth-Cho"
                personal="https://elizabeth-cho.github.io/"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="LaurenBack.jpg"
                memberName="Lauren Back"
                memberTitle=""
                linkedin="https://www.linkedin.com/in/backs/"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="ElaineHe.jpg"
                memberName="Elaine He"
                memberTitle=""
                linkedin="https://www.linkedin.com/in/jiayi-elaine-he/"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="AnhTran.jpg"
                memberName="Trần Thế Anh"
                memberTitle="Mission Data"
                linkedin="https://www.linkedin.com/in/anh-the-tran/"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="ZoeKim.jpg"
                memberName="Zoe Kim"
                memberTitle="Masters at UMichigan"
                linkedin="https://www.linkedin.com/in/kimminjeong/"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="LaineWang.jpg"
                memberName="Laine Wang"
                memberTitle=""
                linkedin="https://www.linkedin.com/in/yuelian-wang-9a48b71a4/"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="StellaLi.jpg"
                memberName="Stella Li"
                memberTitle=""
                linkedin="https://www.linkedin.com/in/stella-li-1106/"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem imgURL="AlanLi.jpg" memberName="Alan Li" memberTitle="" linkedin="" />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="NicholasBowen.jpg"
                memberName="Nicolas Bowen"
                memberTitle="Palantir"
                linkedin="https://www.linkedin.com/in/nicholas-bowen24/"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="brandon_headshot.jpg"
                memberName="Brandon Wong"
                memberTitle="Nuro"
                linkedin="https://linkedin.com/in/brandonynwong"
                github="https://github.com/bwong19"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="elaine.jpg"
                memberName="Elaine Wong"
                memberTitle="Meta"
                linkedin="https://www.linkedin.com/in/ewong127/"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem imgURL="alison_headshot.jpg" memberName="Alison Lee" memberTitle="Meta" />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="az.jpg"
                memberName="Andrew Zhang"
                memberTitle="Datadog"
                linkedin="https://www.linkedin.com/in/yzhan289/"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem imgURL="jimmy_headshot.jpg" memberName="Jimmy Shi" />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="kavan_headshot.jpg"
                memberName="Kavan Bansal"
                memberTitle="Amazon"
                linkedin="https://www.linkedin.com/in/kavanbansal/"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="charissa_headshot.jpg"
                memberName="Charissa Zou"
                memberTitle="Meta"
                linkedin="https://www.linkedin.com/in/charissa-zou/"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="dan.jpg"
                memberName="Daniel Qian"
                memberTitle="Bloomberg"
                linkedin="https://www.linkedin.com/in/daniel-qian/"
              />
            </div>
            <div className={classes.teambox}>
              <MemberItem
                imgURL="brice.jpg"
                memberName="Brice Halder"
                memberTitle="Meta"
                linkedin="https://www.linkedin.com/in/brice-halder/"
              />
            </div>
          </Grid>
        )}
      </Paper>
    </Box>
  );
}
