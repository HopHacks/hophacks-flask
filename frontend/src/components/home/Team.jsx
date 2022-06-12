import React from "react";

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles({

  root: {
    flexGrow: 1,
    backgroundColor: "#eef7ff"
  },

  title: {
    color: "#7289da",
    fontFamily: "VCR OSD Mono",
  },

  team: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '10px',
    justifyContent: 'center',
  },

  firstRow: {
    textAlign: 'center',
    marginTop: '30px',
    minHeight: '190px',
    minWidth: '190px',
    maxWidth: '300px',
    maxHeight: '300px',
    margin: '10px',
    padding: '2.5px 50px',
    display: 'flex',
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

  memberPic1: {
    width: '210px',
    height: '210px',
    borderRadius: '10px',
    opacity: 1.0,
    '&:hover': {
      opacity: 0.8,
    },
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
  return process.env.PUBLIC_URL + '/images/' + url;
}

function MemberItem(props) {
  const [buttons, setButtons] = React.useState({ display: 'none' });

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
        }}
        onMouseLeave={e => {
          setButtons({ display: 'none' })
        }}
      >
        <div className={classes.memberBg}>
          <div className={classes.memberPic1}>
            <img className={classes.memberPic} src={img(`team/img/${props.imgURL}.jpg`)} alt="loading" />
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

  const [value, setValue] = React.useState(2);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const classes = useStyles();

  return (
    <Box py={2}>
      <Card>
        <CardContent>
          <Typography className={classes.title} variant="h4" gutterBottom>Our Perfect Team</Typography>
          <Paper className={classes.root} style={{ padding: '5px', marginBottom: '10px' }}>
            <div className={classes.team}>
              <div className={classes.firstRow}>
                <MemberItem imgURL="curtis_headshot" memberName="Curtis Ahn" memberTitle="Director" linkedin="linkedin.com/in/ctsahn" />
              </div>
              <div className={classes.firstRow}>
                <MemberItem imgURL="joanne" memberName="Joanne Selinski" memberTitle="Faculty Advisor" />
              </div>
              <div className={classes.firstRow}>
                <MemberItem imgURL="kelly" memberName="Kelly Culotta" memberTitle="Admin Coordinator" />
              </div>
            </div>
          </Paper>
          <Paper className={classes.root} style={{ padding: '5px' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="DESIGN" />
              <Tab label="LOGISTICS" />
              <Tab label="SOCIAL/PR" />
              <Tab label="SPONSORS" />
              <Tab label="WEBSITE" />
            </Tabs>
            {value === 0 && <Grid className={classes.team} container>
              <div className={classes.teambox}>
                <MemberItem imgURL="jimmy_headshot" memberName="Jimmy Shi" memberTitle="Design/Website" personal="https://www.jimmyshi.com/" linkedin="https://www.linkedin.com/in/jimmyshi360/" github="https://github.com/jimmyshi360" />
              </div>
            </Grid>}
            {value === 1 && <Grid className={classes.team} container>
              <div className={classes.teambox}>
                <MemberItem imgURL="AnhTran" memberName="Trần Thế Anh" memberTitle="Logistics Head" linkedin="https://www.linkedin.com/in/anh-the-tran/"/>
              </div>
              <div className={classes.teambox}>
                <MemberItem imgURL="SejalSrivastava" memberName="Sejal Srivastava" memberTitle="Logistics" linkedin="linkedin.com/in/sejal-srivastava0123"/>
              </div>
              <div className={classes.teambox}>
                <MemberItem imgURL="AkhilDeo" memberName="Akhil Deo" memberTitle="Logistics" linkedin="https://www.linkedin.com/in/akhildeo" github="https://github.com/akhildeo"/>
              </div>
              <div className={classes.teambox}>
                <MemberItem imgURL="IrisGupta" memberName="Iris Gupta" memberTitle="Logistics" linkedin="https://www.linkedin.com/in/iris-gupta-5b422a190" />
              </div>
            </Grid>}
            {value === 2 && <Grid className={classes.team} container>
              <div className={classes.teambox}>
                <MemberItem imgURL="ZoeKim" memberName="Zoe Kim" memberTitle="Social/PR Co-Head" linkedin="https://www.linkedin.com/in/kimminjeong/"/>
              </div>
              <div className={classes.teambox}>
                <MemberItem imgURL="ElizabethHsieh" memberName="Elizabeth Hsieh" memberTitle="Social/PR" linkedin="https://www.linkedin.com/in/elizabeth-hsieh/"/>
              </div>
              <div className={classes.teambox}>
                <MemberItem imgURL="RuoyanShang" memberName="Ruoyan Shang" memberTitle="Social/PR" linkedin="https://www.linkedin.com/in/ruoyan-shang/" github="https://github.com/Elvaaaaaa"/>
              </div>
            </Grid>}
            {value === 3 && <Grid className={classes.team} container>
              <div className={classes.teambox}>
                <MemberItem imgURL="DhruvDubey" memberName="Dhruv Dubey" memberTitle="Sponsors" linkedin="https://www.linkedin.com/in/dhruv-dubey-51660b1b7/"/>
              </div>
              <div className={classes.teambox}>
                <MemberItem imgURL="JosephineDeng" memberName="Josephine Deng" memberTitle="Sponsors" linkedin="https://www.linkedin.com/in/josephine-deng"/>
              </div>
            </Grid>}
            {value === 4 && <Grid className={classes.team} container>
              <div className={classes.teambox}>
                <MemberItem imgURL="AlanLi" memberName="Alan Li" memberTitle="Website Head" linkedin="https://www.linkedin.com/in/alan-li-a45aa7197/" />
              </div>
              <div className={classes.teambox}>
                <MemberItem imgURL="NicholasBowen" memberName="Nicholas Bowen" memberTitle="Website" linkedin="www.linkedin.com/in/nicholas-bowen24"/>
              </div>
              <div className={classes.teambox}>
                <MemberItem imgURL="ShaopengZeng" memberName="Shaopeng Zeng" memberTitle="Website" linkedin="https://www.linkedin.com/in/shaopeng-zeng-862154149/"/>
              </div>
            </Grid>}
          </Paper>

        </CardContent>
      </Card>
    </Box>

    // <Box py={2}>
    //     <Card>
    //         <CardContent>
    //             {/*TODO material UI*/}
    //             <Typography className={classes.title} variant="h4" gutterBottom>Meet The Team!</Typography>

    //                 <Typography>
    //                     We're a group of undergraduate students passionate about the intersection of
    //                     <b> technology</b>,
    //                     <b> innovation</b>,
    //                     <b> social good</b>, and
    //                     <b> fun</b>!
    //                     <font size="2"> (and pineapple on pizza) </font>

    //                     <p></p>
    //                 </Typography>


    //             <br />

    //             <Box mx="10%">

    //                 {/*TODO make this grid better (spaced with 8? narrower?) */}
    //                 <Grid className={classes.team} container>
    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="marc_headshot" memberName="Marc Helou" memberTitle="Director" />
    //                     </div>

    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="brandon_headshot" memberName="Brandon Wong" memberTitle="Head of Membership/ Logistics" />
    //                     </div>

    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="alan_headshot" memberName="Alan Li" memberTitle="Head of Website" />
    //                     </div>

    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="patrick_headshot" memberName="Patrick Herbert" memberTitle="Head of Logistics" />
    //                     </div>

    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="theanh_headshot" memberName="Trần Thế Anh" memberTitle="Head of Logistics/ Sponsors" />
    //                     </div>

    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="elizabeth_headshot" memberName="Elizabeth Cho" memberTitle="Head of Design" />
    //                     </div>

    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="amber" memberName="Amber Zhou" memberTitle="Co-Head of Judges" />
    //                     </div>

    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="stella_headshot" memberName="Stella Li" memberTitle="Co-Head of Judges/ Sponsors" />
    //                     </div>

    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="alison_headshot" memberName="Alison Lee" memberTitle="Head of Sponsors/ Design" />
    //                     </div>

    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="Neha" memberName="Neha Nandiwada" memberTitle="Logistics" />
    //                     </div>

    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="curtis_headshot" memberName="Curtis Ahn" memberTitle="Website" />
    //                     </div>

    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="jimmy_headshot" memberName="Jimmy Shi" memberTitle="Design/Website" personal="https://www.jimmyshi.com/" linkedin="https://www.linkedin.com/in/jimmyshi360/" github="https://github.com/jimmyshi360" />
    //                     </div>

    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="elaine_headshot" memberName="Elaine He" memberTitle="Design/Website" />
    //                     </div>

    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="charissa_headshot" memberName="Charissa Zou" memberTitle="Design/Website" />
    //                     </div>

    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="kavan_headshot" memberName="Kavan Bansal" memberTitle="Social/PR/ Sponsors" />
    //                     </div>

    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="zoe_headshot" memberName="Zoe Kim" memberTitle="Social & PR/Sponsors" />
    //                     </div>

    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="laine_headshot" memberName="Laine Wang" memberTitle="Social/PR" />
    //                     </div>

    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="joanne" memberName="Joanne Selinski" memberTitle="Faculty Advisor" />
    //                     </div>

    //                     <div className = {classes.teambox}>
    //                     <MemberItem imgURL="kelly" memberName="Kelly Culotta" memberTitle="Admin Coordinator" />
    //                     </div>

    //                     {/* <MemberItem imgURL="xiangyu" memberName="Xiangyu Shen" memberTitle="Website" /> */}

    //                     {/* <MemberItem imgURL="arielle" memberName="Arielle Summitt" memberTitle="Social/PR" /> */}

    //                 </Grid>
    //             </Box>
    //             <br />
    //             <br />


    //         </CardContent>
    //     </Card>
    // </Box>
  );
}
