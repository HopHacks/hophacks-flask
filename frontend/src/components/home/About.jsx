import React from 'react';
import Box from '@material-ui/core/Box';
import styled from 'styled-components';

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  color: rgba(255, 255, 255);
`;

const AboutText = styled.p`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
`;

const Highlight = styled.span`
  color: rgb(181, 227, 247);
  font-weight: 800;
`;

const PlaceHolderWhiteBox = styled.div`
  background-color: white;
  width: 80%;
  height: 400px;
  margin: auto;
`;

function img(url) {
  return process.env.PUBLIC_URL + '/images/' + url;
}

export default function About() {
  const introTextP1 = (
    <AboutText>
      HopHacks is a <Highlight>36-hour biannual Hackathon</Highlight> held at the Johns Hopkins
      University that encourages engineers, designers, and entrepreneurs to explore new ideas and
      create new applications.
    </AboutText>
  );

  const introTextP2 = (
    <AboutText>
      Teams of up to <Highlight>4 university students</Highlight> work on projects from scratch.At
      the end of the hackathon, teams present their projects to judges and compete for prizes($1024,
      $512, $256 for top 3 winners and sponsor specific prizes) !
    </AboutText>
  );

  return (
    <div id="about">
      <div className="about-flex title-align">
        <Box flex={1}>
          <Title>About</Title>
        </Box>
        <Box>
          <img src={img('logo2023.png')} width={'160px'} />
        </Box>
        <Box flex={1}></Box>
      </div>
      <div className="about-flex">
        <Box flex={1}>
          {introTextP1}
          <Box height={20}></Box>
          {introTextP2}
        </Box>
        {/* <Box flex={1}>
          <PlaceHolderWhiteBox />
        </Box> */}
      </div>
    </div>
  );
}
