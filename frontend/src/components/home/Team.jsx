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
                    <Typography className={classes.title} variant="h4" gutterBottom>Meet The Team!</Typography>
                    
                        <Typography>
                            We're a group of undergraduate students passionate about the intersection of
                            <b> technology</b>,
                            <b> innovation</b>,
                            <b> social good</b>, and
                            <b> fun</b>!
                            <font size="2"> (and pineapple on pizza) </font>

                            <p></p>
                        </Typography>
    

                    <br />

                    <Box mx="10%">

                        {/*TODO make this grid better (spaced with 8? narrower?) */}
                        <Grid container spacing={1} mx={20}>
                            <MemberItem imgURL="Marc_Helou" memberName="Marc Helou" memberTitle="Director" />
                            <MemberItem imgURL="bwong" memberName="Brandon Wong" memberTitle="Head of Membership/ Logistics" />
                            <MemberItem imgURL="Alan_Li" memberName="Alan Li" memberTitle="Head of Website" />
                            <MemberItem imgURL="patrick" memberName="Patrick Herbert" memberTitle="Head of Logistics" />
                            <MemberItem imgURL="theanh" memberName="Trần Thế Anh" memberTitle="Head of Logistics/ Sponsors" />

                            <MemberItem imgURL="elizabeth" memberName="Elizabeth Cho" memberTitle="Head of Design" />
                            <MemberItem imgURL="amber" memberName="Amber Zhou" memberTitle="Co-Head of Judges" />

                            <MemberItem imgURL="stella" memberName="Stella Li" memberTitle="Co-Head of Judges/ Sponsors" />
                            <MemberItem imgURL="alison" memberName="Alison Lee" memberTitle="Head of Sponsors/ Design" />

                            {/* <MemberItem imgURL="xiangyu" memberName="Xiangyu Shen" memberTitle="Website" /> */}

                            <MemberItem imgURL="Neha" memberName="Neha Nandiwada" memberTitle="Logistics" />
                            <MemberItem imgURL="Curtis_Ahn" memberName="Curtis Ahn" memberTitle="Website" />


                            <MemberItem imgURL="jimmy" memberName="Jimmy Shi" memberTitle="Design/Website" personal="https://www.jimmyshi.com/" linkedin="https://www.linkedin.com/in/jimmyshi360/" github="https://github.com/jimmyshi360" />

                            <MemberItem imgURL="Elaine_He" memberName="Elaine He" memberTitle="Design/Website" />

                            <MemberItem imgURL="charissa" memberName="Charissa Zou" memberTitle="Design/Website" />
                            <MemberItem imgURL="Kavan_Bansal" memberName="Kavan Bansal" memberTitle="Social/PR/ Sponsors" />
                            <MemberItem imgURL="aubin" memberName="Aubin Lohier" memberTitle="Social/PR" />
                            <MemberItem imgURL="Laine_wang" memberName="Laine Wang" memberTitle="Social/PR" />

                            {/* <MemberItem imgURL="arielle" memberName="Arielle Summitt" memberTitle="Social/PR" /> */}




                            <MemberItem imgURL="joanne" memberName="Joanne Selinski" memberTitle="Faculty Advisor" />
                            <MemberItem imgURL="kelly" memberName="Kelly Culotta" memberTitle="Admin Coordinator" />
                        </Grid>
                    </Box>
            
                </CardContent>
            </Card>
        </Box>
    );
}
