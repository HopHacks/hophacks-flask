import React from "react";

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles({

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
        border: '1px solid',
        borderColor:'#f3f3f3',
        textAlign: 'center',
        marginTop: '30px',
        minHeight: '225px',
        minWidth: '250px',
        maxWidth: '250px',
        maxHeight: '260px',
        padding: '32px',
        borderRadius: '8px',
        boxShadow:'0 5px 15px rgb(0 0 0 / 7%)',
        display: 'flex',
        justifyContent: 'center',
    },

    memberPic: {
        width:'100px',
        height: '100px',
    },


});



function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
}

function MemberItem(props) {
    const classes = useStyles();
    let linkedin = (null);
    let github = (null);
    let personal = (null);



    if (props.linkedin) {
        linkedin = <a href={`${props.linkedin}`}><img className="social-icon" src={img("social/linkedin.png")} alt="linkedin" /></a>;
    }

    if (props.github) {
        github = <a href={`${props.github}`}><img className="social-icon" src={img("social/github.png")} alt="github" /></a>;
    }

    if (props.personal) {
        personal = <a href={`${props.personal}`}><img className="social-icon" src={img("social/personal.png")} alt="personal" /></a>;
    }

    return (
        <Grid item >

            <div className="grid-item">
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
        </Grid>
    );

}

export default function Team() {


    const classes = useStyles();

    return (
        <Box py={2}>
            <Card>
                <CardContent>
                    {/*TODO material UI*/}
                    <Typography className={classes.title} variant="h4" gutterBottom>Meet The Team!</Typography>
                    <div>
                        <Typography>
                            We're a group of undergraduate students passionate about the intersection of
                            <b> technology</b>,
                            <b> innovation</b>,
                            <b> social good</b>, and
                            <b> fun</b>!
                            <font size="2"> (and pineapple on pizza) </font>

                            <p></p>
                        </Typography>
                    </div>

                    <br />

                    <Box mx="10%">

                        {/*TODO make this grid better (spaced with 8? narrower?) */}
                        <Grid className={classes.team} container>
                            <div className = {classes.teambox}>
                            <MemberItem imgURL="Marc_Helou" memberName="Marc Helou" memberTitle="Director" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="bwong" memberName="Brandon Wong" memberTitle="Head of Membership/ Logistics" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="Alan_Li" memberName="Alan Li" memberTitle="Head of Website" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="patrick" memberName="Patrick Herbert" memberTitle="Head of Logistics" />
                            </div>
                            
                            <div className = {classes.teambox}>
                            <MemberItem imgURL="theanh" memberName="Trần Thế Anh" memberTitle="Head of Logistics/ Sponsors" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="elizabeth" memberName="Elizabeth Cho" memberTitle="Head of Design" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="amber" memberName="Amber Zhou" memberTitle="Co-Head of Judges" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="stella" memberName="Stella Li" memberTitle="Co-Head of Judges/ Sponsors" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="alison" memberName="Alison Lee" memberTitle="Head of Sponsors/ Design" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="Neha" memberName="Neha Nandiwada" memberTitle="Logistics" />
                            </div>
                            
                            <div className = {classes.teambox}>
                            <MemberItem imgURL="Curtis_Ahn" memberName="Curtis Ahn" memberTitle="Website" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="jimmy" memberName="Jimmy Shi" memberTitle="Design/Website" personal="https://www.jimmyshi.com/" linkedin="https://www.linkedin.com/in/jimmyshi360/" github="https://github.com/jimmyshi360" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="Elaine_He" memberName="Elaine He" memberTitle="Design/Website" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="charissa" memberName="Charissa Zou" memberTitle="Design/Website" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="Kavan_Bansal" memberName="Kavan Bansal" memberTitle="Social/PR/ Sponsors" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="aubin" memberName="Aubin Lohier" memberTitle="Social/PR" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="Laine_wang" memberName="Laine Wang" memberTitle="Social/PR" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="joanne" memberName="Joanne Selinski" memberTitle="Faculty Advisor" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="kelly" memberName="Kelly Culotta" memberTitle="Admin Coordinator" />
                            </div>
                            {/* <MemberItem imgURL="xiangyu" memberName="Xiangyu Shen" memberTitle="Website" /> */}

                            {/* <MemberItem imgURL="arielle" memberName="Arielle Summitt" memberTitle="Social/PR" /> */}

                        </Grid>
                    </Box>
                    <br />
                    <br />

                    <Typography className={classes.title} variant="h4" gutterBottom>
                                Alumni
                    </Typography>

                    <Box mx="10%">
                        <Grid className= {classes.team} container>
                            <div className = {classes.teambox}>
                            <MemberItem imgURL="dan" memberName="Daniel Qian" memberTitle="Bloomberg" personal="https://danqian.net/" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="melody" memberName="Melody Hsu" memberTitle="Class of 2021" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="david" memberName="David Yang" memberTitle="Accenture" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="rachel" memberName="Rachel Rosset" memberTitle="Microsoft" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="az" memberName="Andrew Zhang" memberTitle="Datadog" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="brice" memberName="Brice Halder" memberTitle="" linkedin="https://www.linkedin.com/in/brice-halder/" github="https://github.com/bhalder2" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="jwong" memberName="Jason Wong" memberTitle="Facebook" />
                            </div>


                            <div className = {classes.teambox}>
                            <MemberItem imgURL="kristin" memberName="Kristin Yim" memberTitle="Google" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="jessie" memberName="Jessie Bai" memberTitle="Goldman Sachs" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="jz" memberName="Jason Zhang" memberTitle="MongoDB" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="will" memberName="Will Ye" memberTitle="Capital One" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="elaine" memberName="Elaine Wong" memberTitle="Facebook" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="awong" memberName="Andrew Wong" memberTitle="Atlassian" />
                            </div>

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="ryan" memberName="Ryan Demo" memberTitle="Lyft" />
                            </div>


                            {/* <MemberItem imgURL="frank" memberName="Frank Miao" memberTitle="Head of Transportation" /> */}
                            {/* <MemberItem imgURL="stanley" memberName="Stanley Wang" memberTitle="Sponsors" /> */}
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
