/*import React from 'react';
import Box from '@material-ui/core/Box';
import styled from 'styled-components';

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  font-style: italic;
  color: rgba(6, 26, 64, 1);
  text-align: ${(props) => props.align || 'left'};
`;

const AboutText = styled.p`
  font-size: 1.5rem;
  color: rgba(6, 26, 64, 1);
  text-align: ${(props) => props.align || 'center'};
`;

const Highlight = styled.span`
  background-color: rgba(250, 192, 19, 1);
  border-radius: 10px;
  padding: 6px;
  color: rgba(255, 255, 255, 1);
  font-weight: 800;
  font-style: bold;
`;

// function img(url) {
//   return process.env.PUBLIC_URL + '/images/' + url;
// }

export default function About() {
  const introTextP1 = (
    <AboutText>
      HopHacks is a <Highlight>36 hour annual Hackathon</Highlight> held at the Johns Hopkins
      University that encourages engineers, designers, and entrepreneurs to explore new ideas and
      create new applications.
    </AboutText>
  );

  const introTextP2 = (
    <AboutText>
      Teams of up to <Highlight>4 university students</Highlight> work on projects from scratch. At
      the end of the hackathon, teams present their projects to judges and compete for prizes
      ($1024, $512, $256 for top 3 winners and sponsor specific prizes)!
    </AboutText>
  );

  return (
    <div id="about" style={{}}>
      <Box align="center">
        <img src={img('logo2023.png')} width={'160px'} />
      </Box>
      <Box flex={1} marginTop={'-4rem'} align="center">
        <Title>About</Title>
      </Box>
      <Box flex={1} align="center">
        <Box flex={1} width={'80%'}>
          {introTextP1}
          <Box height={5}></Box>
          {introTextP2}
        </Box>
      </Box>
    </div>
  );
}
*/

import '../../stylesheets/about.css';

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="background">
        <img
          src="https://hophacks-website.s3.us-east-1.amazonaws.com/images/website2025/home/about_background.png"
          alt="About section background"
        />
      </div>
      <div className="container">
        {/*<div className="content">
          {/*<p>
            HopHacks is a 36 hour annual Hackathon held at the Johns Hopkins University that encourages engineers, designers, and entrepreneurs to explore new ideas and create new applications.
          </p>
        </div>*/}
        <h2>About</h2>
      </div>
    </section>
  );
}
