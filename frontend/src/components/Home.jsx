import React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

export default function Home() {
    return (
        <>
            <img src={process.env.PUBLIC_URL + '/images/parallax1.png'} />
            <Card>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        About
                    </Typography>
                    <Typography color="textSecondary">
                        HopHacks is a 36-hour biannual Hackathon held at Johns Hopkins University that encourages engineers, designers, and entrepreneurs to explore new ideas and create new applications. Teams of up to 4 university students work on projects from scratch. At the end of the hackathon, teams present their projects to judges and compete for prizes up to $1024!

                        Note: Due to the COVID-19 pandemic, we will be hosting HopHacks virtually via Discord and Zoom.
                    </Typography>
                </CardContent>
            </Card>
        </>
    );

}
