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
    },

    title: {
        color: "#7289da",
        fontFamily: "VCR OSD Mono",
    },

    team: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent:'space-between'
    },

    teambox: {
        // border: '1px solid',
        // borderColor:'#f3f3f3',
        textAlign: 'center',
        marginTop: '30px',
        minHeight: '230px',
        minWidth: '230px',
        maxWidth: '300px',
        maxHeight: '300px',
        // padding: '32px',
        // borderRadius: '8px',
        // boxShadow:'0 5px 15px rgb(0 0 0 / 7%)',
        display: 'flex',
        justifyContent: 'center',
    },

    memberPic: {
        width:'230px',
        height:'230px',
        borderRadius: '10px',
    },


});

function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
}

function MemberItem(props) {
    const [buttons, setButtons] = React.useState({display: 'none'});

    const classes = useStyles();
    let linkedin = (null);
    let github = (null);
    let personal = (null);



    if (props.linkedin) {
        linkedin = <a href={`${props.linkedin}`}><img style={buttons} className="social-icon" src={img("social/linkedin.png")} alt="linkedin" /></a>;
    }

    if (props.github) {
        github = <a href={`${props.github}`}><img style={buttons} className="social-icon" src={img("social/github.png")} alt="github" /></a>;
    }

    if (props.personal) {
        personal = <a href={`${props.personal}`}><img style={buttons} className="social-icon" src={img("social/personal.png")} alt="personal" /></a>;
    }

    return (
        <Grid item >
            {/* <div className="grid-item"> */}
                <div
                    onMouseEnter={e => {
                        setButtons({display: ''});
                    }}
                    onMouseLeave={e => {
                        setButtons({display: 'none'})
                    }}
                >
                    <picture className = {classes.memberPic}>
                        <source type="image/webp" srcSet={img(`team/webp/${props.imgURL}.webp`)} />
                        <img className = {classes.memberPic} src={img(`team/jpg/${props.imgURL}.jpg`)} alt="loading" />
                    </picture>
                    <Typography color="textSecondary"><strong>{props.memberName}</strong></Typography>
                    <Typography>{props.memberTitle}</Typography>
                
                    {linkedin}
                    {github}
                    {personal}
                </div>
            {/* </div> */}
        </Grid>
    );

}

export default function Team() {

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const classes = useStyles();

    return (
        <Box py={2}>
            <Card>
                <CardContent>
                    <Typography className={classes.title} variant="h4" gutterBottom>Our Perfect Team</Typography>
                    <Paper className={classes.root}>
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
                        {value === 0 && <div>
                            <div className = {classes.teambox}>
                                <MemberItem imgURL="jimmy_headshot" memberName="Jimmy Shi" memberTitle="Design/Website" personal="https://www.jimmyshi.com/" linkedin="https://www.linkedin.com/in/jimmyshi360/" github="https://github.com/jimmyshi360" />
                            </div>
                        </div>}
                        {value === 1 && <div>
                            <div className = {classes.teambox}>
                                <MemberItem imgURL="curtis_headshot" memberName="Curtis 2" memberTitle="Website" />
                            </div>
                        </div>}
                        {value === 2 && <div>
                            <div className = {classes.teambox}>
                                <MemberItem imgURL="curtis_headshot" memberName="Curtis 3" memberTitle="Website" />
                            </div>
                        </div>}
                        {value === 3 && <div>
                            <div className = {classes.teambox}>
                                <MemberItem imgURL="curtis_headshot" memberName="Curtis 4" memberTitle="Website" />
                            </div>
                        </div>}
                        {value === 4 && <div>
                            <div className = {classes.teambox}>
                                <MemberItem imgURL="curtis_headshot" memberName="Curtis 5" memberTitle="Website" />
                            </div>
                        </div>}
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
