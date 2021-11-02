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

export default function Alumni() {


    const classes = useStyles();

    return (
        <Box py={2}>
            <Card>
                <CardContent>
                    {/*TODO material UI*/}
                    <Typography className={classes.title} variant="h4" gutterBottom>Alumni</Typography>

                        <Typography>
                           Check out some of our alumni!
                        </Typography>

                        <br />






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
                            <MemberItem imgURL="brice" memberName="Brice Halder" memberTitle="Facebook" linkedin="https://www.linkedin.com/in/brice-halder/" github="https://github.com/bhalder2" />
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

                            <div className = {classes.teambox}>
                            <MemberItem imgURL="aubin" memberName="Aubin Lohier" memberTitle="Facebook" />
                            </div>


                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
