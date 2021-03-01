import React from "react";

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
}

function MemberItem (props) {
    let linkedin = (null);
    let github = (null);
    let personal = (null);



    if (props.linkedin) {
        linkedin = <a href={`${props.linkedin}`}><img className="social-icon" src={img("social/linkedin.png")} alt="linkedin" /></a>;
    }

    if (props.github) {
        github = <a href={`${props.github}`}><img className="social-icon" src={img("social/github.png")}  alt="github" /></a>;
    }

    if (props.personal) {
        personal = <a href={`${props.personal}`}><img className="social-icon" src={img("social/personal.png")}  alt="personal" /></a>;
    }

    console.log(props)
    return (
        <div className="grid-item">
            <picture>
                <source type="image/webp" srcSet={img(`team/webp/${props.imgURL}.webp`)} />
                <img src={img(`team/jpg/${props.imgURL}.jpg`)} alt="loading" />
            </picture>
            <h3><strong>{props.memberName}</strong></h3>
            <h3>{props.memberTitle}</h3>
            {linkedin}
            {github}
            {personal}
        </div>
    );
    
}

export default function Team() {
    return (
        <Box py={2}>
            <Card>
                <CardContent>
                    {/*TODO material UI*/}
                    <div className="card-title quadon soft-blue-text">Meet the Team!</div>
                    <div>
                        <h3>
                        We're a group of undergraduate students passionate about the intersection of
                            <b> technology</b>,
                            <b> innovation</b>,
                            <b> social good</b>, and
                            <b> fun</b>!
                            <font size="2"> (and pineapple on pizza) </font>
                        </h3>
                    </div>

                    <br />

                    {/*TODO make this a grid with Material UI */}
                    <div className="grid-container">
                        <MemberItem imgURL="amber" memberName="Amber Zhou" memberTitle="Co-Director" />
                        <MemberItem imgURL="bwong" memberName="Brandon Wong" memberTitle="Co-Director" />
                        <MemberItem imgURL="dan" memberName="Daniel Qian" memberTitle="Head of Website" />
                        <MemberItem imgURL="melody" memberName="Melody Hsu" memberTitle="Co-Head of Design" />
                        <MemberItem imgURL="jimmy" memberName="Jimmy Shi" memberTitle="Co-Head of Design, Website" personal="https://www.jimmyshi.com/" linkedin="https://www.linkedin.com/in/jimmyshi360/" github="https://github.com/jimmyshi360" />
                        <MemberItem imgURL="david" memberName="David Yang" memberTitle="Head of Sponsors" />
                        <MemberItem imgURL="rachel" memberName="Rachel Rosset" memberTitle="Head of Social/PR" />
                        <MemberItem imgURL="az" memberName="Andrew Zhang" memberTitle="Head of Membership" />

                        <MemberItem imgURL="brice" memberName="Brice Halder" memberTitle="Website" linkedin="https://www.linkedin.com/in/brice-halder/" github="https://github.com/bhalder2" />
                        {/* <MemberItem imgURL="xiangyu" memberName="Xiangyu Shen" memberTitle="Website" /> */}
                        <MemberItem imgURL="jwong" memberName="Jason Wong" memberTitle="Logistics" />
                        <MemberItem imgURL="patrick" memberName="Patrick Herbert" memberTitle="Logistics" />
                        <MemberItem imgURL="theanh" memberName="Trần Thế Anh" memberTitle="Logistics" />
                        <MemberItem imgURL="elizabeth" memberName="Elizabeth Cho" memberTitle="Design" />
                        <MemberItem imgURL="charissa" memberName="Charissa Zou" memberTitle="Design" />
                        <MemberItem imgURL="stella" memberName="Stella Li" memberTitle="Sponsors" />
                        <MemberItem imgURL="alison" memberName="Alison Lee" memberTitle="Sponsors" />
                        <MemberItem imgURL="aubin" memberName="Aubin Lohier" memberTitle="Social/PR" />
                        {/* <MemberItem imgURL="arielle" memberName="Arielle Summitt" memberTitle="Social/PR" /> */}


                        <MemberItem imgURL="joanne" memberName="Joanne Selinski" memberTitle="Faculty Advisor" />
                        <MemberItem imgURL="kelly" memberName="Kelly Culotta" memberTitle="Admin Coordinator" />
                    </div>
                    <br />
                    <br />

                    <h2> Alumni </h2>
                    <div className="grid-container">
                        <MemberItem imgURL="kristin" memberName="Kristin Yim" memberTitle="Google" />
                        <MemberItem imgURL="jessie" memberName="Jessie Bai" memberTitle="Goldman Sachs" />
                        <MemberItem imgURL="jz" memberName="Jason Zhang" memberTitle="MongoDB" />
                        <MemberItem imgURL="will" memberName="Will Ye" memberTitle="Capital One" />
                        {/* <MemberItem imgURL="frank" memberName="Frank Miao" memberTitle="Head of Transportation" /> */}
                        {/* <MemberItem imgURL="stanley" memberName="Stanley Wang" memberTitle="Sponsors" /> */}
                        <MemberItem imgURL="elaine" memberName="Elaine Wong" memberTitle="Facebook" />
                        <MemberItem imgURL="awong" memberName="Andrew Wong" memberTitle="Atlassian" />
                        <MemberItem imgURL="ryan" memberName="Ryan Demo" memberTitle="Lyft" />
                    </div>

                </CardContent>
            </Card>
        </Box>
    );
}
