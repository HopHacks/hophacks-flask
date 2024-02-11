import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles({
  margin: {
    marginBottom: '20px'
  },
  title: {
    color: '#000000',
    fontFamily: 'PT Sans'
  },
  button: {
    color: '#841584'
  },
  btn_text: {
    color: '#ffffff'
  }
});

export default function PrizeHighlight() {
  const classes = useStyles();
  const prizeSample = (
    <Typography className={classes.title}>
      <h2>Track/Prize: Teamname</h2>
      <h3>Description and more details</h3>
    </Typography>
  );

  return (
    <Grid container>
      <Grid container xs={8} sm={8} md={8}>
        {/* for pictures */}
        <Grid item sm={10}>
          <img
            src={
              'https://lh3.googleusercontent.com/pw/ABLVV85mXrwbTpvhlGIroPZpy5C1BIEueAYYR3QxE33onJCdh_KGEhi6qeaRUSGqUc4NbVBOf074GC-48b9zP1Ho5TRsCSSZz1-WvFFUFNMTisZjbUwGVuhEXWiomK8vX9wwWrwpxkUIGH3FzWqIOmEd2ZeZ=w1317-h878-s-no-gm?authuser=0'
            }
            style={{ width: '250px', margin: '1px 250px 5px', justifyContent: 'center' }}
          />
        </Grid>
        <Grid item sm={3}>
          <img
            src={
              'https://lh3.googleusercontent.com/pw/ABLVV86RHOGrBL0zI4u6gRnuIzooJuUj36pqZB41ctAEtQyKO6c47ZJeZaLQJQ9Mtam8NM6ePMw7mcTz_vdqBKKfenEqqQpzy1EoPMJOtvNW0w-PEJg8f05dOYrR0T2gm3vGCps_H_EIgsrpgf1nnJV8Gvb0=w1317-h878-s-no-gm?authuser=0'
            }
            style={{ width: '200px', margin: '1px 50px 5px' }}
          />
        </Grid>
        <Grid item sm={3}>
          <img
            src={
              'https://lh3.googleusercontent.com/pw/ABLVV86zzJbVTl6acaCi2fNckBqE1p4L8teF7Umav3UlPTa3uX_NGj8qlpDuEg--E2HGX7gvWAUOze-6oeFU06t7s6GST6bgVEgf9SwOBkWYkC7Gy3FZOharrVEfK2fdI1W5QpgUc4GjoS4gDBEWoF-_EVuR=w1317-h878-s-no-gm?authuser=0'
            }
            style={{ width: '200px', margin: '1px 50px 5px' }}
          />
        </Grid>
        <Grid item sm={3}>
          <img
            src={
              'https://lh3.googleusercontent.com/pw/ABLVV85kUjSEr7YQGGFyB_D4A5o-jwIm1KqnoIfOspCuKGVdUVlf1yBWouQXGtMVWuj1FXWrx8iL1ImVkcOE1t9DX0LGbAKD_lCB_VQC33MRlRwnBJ_CauPoFMa8cQ5LvFKRf3DKGNTK-WuphdQJGoRlpaNr=w1317-h878-s-no-gm?authuser=0'
            }
            style={{ width: '200px', margin: '1px 50px 5px' }}
          />
        </Grid>
        <Grid item sm={10}>
          <img
            src={
              'https://lh3.googleusercontent.com/pw/ABLVV849a38oDelf3sNm5bti7xqwpfZcXhYP8xe2OfO7JI9OX1-_alnoJ1OUQcCQepWm8txMn2-vSziWcEcwCNhzVLqm4t2MKLcOmcyU1FLDtCuZCgxWYsMOBju-mBHDzKjPHIBjzo2ORzluTep_lKEnOidg=w1317-h878-s-no-gm?authuser=0'
            }
            style={{ width: '250px', margin: '1px 250px 5px', justifyContent: 'center' }}
          />
        </Grid>
      </Grid>
      <Grid container xs={4} sm={4} md={4}>
        {/* for prize descriptions */}
        <Grid item lg={8}>
          {prizeSample}
        </Grid>
        <Grid item lg={8}>
          {prizeSample}
        </Grid>
        <Grid item lg={8}>
          {prizeSample}
        </Grid>
        <Grid item lg={8}>
          {prizeSample}
        </Grid>
      </Grid>
    </Grid>
  );
}
