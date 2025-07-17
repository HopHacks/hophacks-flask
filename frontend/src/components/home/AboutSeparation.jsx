// https://hophacks-website.s3.amazonaws.com/images/cloud1.png

import React from 'react';
// import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
// import { makeStyles } from '@mui/styles';

export default function AboutSeparation() {
  function img(url) {
    return 'https://hophacks-website.s3.amazonaws.com' + '/images/' + url;
  }

  return (
    <div id="about">
      <Stack alignItems="center" sx={{ marginTop: '-2rem' }}>
        <Container maxWidth="lg">
          <img src={img('clouds.png')} width={'100%'} />
        </Container>
      </Stack>
    </div>
  );
}
