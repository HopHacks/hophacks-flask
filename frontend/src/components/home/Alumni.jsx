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
});



function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
}

function MemberItem(props) {
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
        <Grid item xs={6} sm={3} md={2}>

            <div className="grid-item">
                <picture>
                    <source type="image/webp" srcSet={img(`team/webp/${props.imgURL}.webp`)} />
                    <img src={img(`team/jpg/${props.imgURL}.jpg`)} alt="loading" />
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
    
                    <Typography className={classes.title} variant="h4" gutterBottom>
                                Alumni
                            </Typography>
                      
                            <Typography>
         Check out some of our alumni! 

         <p></p>
                        </Typography>

                    
                    <Box mx="10%">
                        <Grid container spacing={1}>
                            <MemberItem imgURL="dan" memberName="Daniel Qian" memberTitle="Bloomberg" personal="https://danqian.net/" />
                            <MemberItem imgURL="melody" memberName="Melody Hsu" memberTitle="Class of 2021" />
                            <MemberItem imgURL="david" memberName="David Yang" memberTitle="Accenture" />
                            <MemberItem imgURL="rachel" memberName="Rachel Rosset" memberTitle="Microsoft" />
                            <MemberItem imgURL="az" memberName="Andrew Zhang" memberTitle="Datadog" />
                            <MemberItem imgURL="brice" memberName="Brice Halder" memberTitle="Yext" linkedin="https://www.linkedin.com/in/brice-halder/" github="https://github.com/bhalder2" />
                            <MemberItem imgURL="jwong" memberName="Jason Wong" memberTitle="Facebook" />


                            <MemberItem imgURL="kristin" memberName="Kristin Yim" memberTitle="Google" />
                            <MemberItem imgURL="jessie" memberName="Jessie Bai" memberTitle="Goldman Sachs" />
                            <MemberItem imgURL="jz" memberName="Jason Zhang" memberTitle="MongoDB" />
                            <MemberItem imgURL="will" memberName="Will Ye" memberTitle="Capital One" />
                            {/* <MemberItem imgURL="frank" memberName="Frank Miao" memberTitle="Head of Transportation" /> */}
                            {/* <MemberItem imgURL="stanley" memberName="Stanley Wang" memberTitle="Sponsors" /> */}
                            <MemberItem imgURL="elaine" memberName="Elaine Wong" memberTitle="Facebook" />
                            <MemberItem imgURL="awong" memberName="Andrew Wong" memberTitle="Atlassian" />
                            <MemberItem imgURL="ryan" memberName="Ryan Demo" memberTitle="Lyft" />
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
