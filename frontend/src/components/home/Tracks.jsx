import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  title: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: '3rem',
    color: '#1D539F'
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
    gap: '5rem',
    padding: '5rem'
  },
  squareBox: {
    backgroundColor: '#4a4a4a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '2rem',
    fontWeight: 600,
    aspectRatio: 1
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
});

function img(url) {
  return 'https://hophacks-website.s3.amazonaws.com' + '/images/' + url;
}

const Tracks = () => {
  const classes = useStyles();
  const handleClick = () => {
    window.location = '/tracks';
  };

  return (
    <Box marginTop={'10rem'} justifyContent="center" className="tracks-container" id="tracks">
      <Typography className={classes.title} variant="h3" gutterBottom>
        Tracks
      </Typography>
      <div className={classes.container}>
        <Box className={classes.squareBox} onClick={handleClick}>
          <img src={img('tracks_general.png')} className={classes.image} />
        </Box>
        <Box className={classes.squareBox} onClick={handleClick}>
          <img src={img('tracks_bgb.png')} className={classes.image} />
        </Box>
        <Box className={classes.squareBox} onClick={handleClick}>
          <img src={img('tracks_biotechnology.png')} className={classes.image} />
        </Box>
        <Box className={classes.squareBox} onClick={handleClick}>
          <img src={img('tracks_medicine.png')} className={classes.image} />
        </Box>
        <Box className={classes.squareBox} />
        <Box className={classes.squareBox} />
        <Box className={classes.squareBox} />
        <Box className={classes.squareBox} />
      </div>
    </Box>
  );
};

export default Tracks;
