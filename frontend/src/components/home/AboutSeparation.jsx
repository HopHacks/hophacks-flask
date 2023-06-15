// https://hophacks-website.s3.amazonaws.com/images/cloud1.png

import React from 'react';
// import Box from '@material-ui/core/Box';
import { Container } from '@material-ui/core';
import { Box } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';

export default function AboutSeparation() {
  function img(url) {
    return 'https://hophacks-website.s3.amazonaws.com' + '/images/' + url;
  }

  return (
    <div id="about">
      <Box display="flex" flexDirection="column" align="center" marginTop={'-2rem'}>
        <Container maxWidth="lg">
          <img src={img('clouds.png')} width={'100%'} />
        </Container>
      </Box>
    </div>
  );
}
