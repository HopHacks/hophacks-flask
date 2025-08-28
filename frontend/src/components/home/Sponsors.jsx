import SectionHeader from '../../components/ui/SectionHeader';
import { makeStyles } from '@material-ui/core/styles';
import SectionParagraph from '../ui/SectionParagraph';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles({
  root: { marginTop: '50px' },
  sponsorTitle: {
    fontSize: '3rem',
    color: '#061a40',
    fontFamily: 'Inter',
    fontWeight: 'bold'
  },
  title: {
    fontSize: '3rem',
    color: '#061a40',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: '30px'
  },
  contact: {
    fontFamily: 'Inter',
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: '1rem',
    margin: '0.5rem',
    color: '#1D539F',
    marginBottom: '40px'
  },
  comingSoon: {
    fontFamily: 'Inter',
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: '1.5rem',
    margin: '0.5rem',
    color: '#1D539F'
  },
  sponsorBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'transparent',
    border: 'none',
    margin: '0.5rem',
    padding: 0,
    maxWidth: '100%'
  },
  sponsorImage: {
    width: 'auto',
    height: '100%',
    maxWidth: '100%',
    objectFit: 'contain'
  },
  labelText: {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  gridRow: {
    marginBottom: '20px',
    justifyContent: 'center'
  }
});

function SponsorBox({ imageUrl, size }) {
  const classes = useStyles();
  return (
    <div className={classes.sponsorBox} style={{ height: size.height }}>
      <img src={imageUrl} className={classes.sponsorImage} alt="sponsor" />
    </div>
  );
}

export default function Sponsors() {
  const classes = useStyles();
  const img = (url) => 'https://hophacks-website.s3.amazonaws.com' + '/images/' + url;

  const sizes = {
    large: { height: '130px' },
    medium: { height: '70px' },
    small: { height: '50px' }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 p-8 md:py-8 md:px-8 overflow-x-hidden">
      <SectionHeader className="text-left mb-20">Sponsors</SectionHeader>
      <Grid
        container
        spacing={3}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          width: '100%'
        }}
      >
        {/* Row 1 — Bloomberg */}
        <Grid
          container
          spacing={3}
          className={classes.gridRow}
          style={{ margin: 0, width: '100%' }}
        >
          <Grid item>
            <SponsorBox size={sizes.large} imageUrl={img('sponsors-2025/bloomberg.png')} />
          </Grid>
        </Grid>

        {/* Row 2 — Marshall Wace */}
        <Grid
          container
          spacing={3}
          className={classes.gridRow}
          style={{ margin: 0, width: '100%' }}
        >
          <Grid item>
            <SponsorBox size={sizes.large} imageUrl={img('sponsors-2025/marshall_wace.png')} />
          </Grid>
        </Grid>

        {/* Row 3 — SpacetimeDB & Orcava */}
        <Grid
          container
          spacing={3}
          className={classes.gridRow}
          style={{ margin: 0, width: '100%' }}
        >
          <Grid item>
            <SponsorBox size={sizes.medium} imageUrl={img('sponsors-2025/spacetimedb.png')} />
          </Grid>
          <Grid item>
            <SponsorBox size={sizes.medium} imageUrl={img('sponsors-2025/orcava.png')} />
          </Grid>
        </Grid>

        {/* Row 4 — Commure & PILGRIM */}
        <Grid
          container
          spacing={3}
          className={classes.gridRow}
          style={{ margin: 0, width: '100%' }}
        >
          <Grid item>
            <SponsorBox size={sizes.medium} imageUrl={img('sponsors-2025/commure.png')} />
          </Grid>
          <Grid item>
            <SponsorBox size={sizes.medium} imageUrl={img('sponsors-2025/pilgrim.png')} />
          </Grid>
        </Grid>

        {/* Row 5 */}
        <Grid
          container
          spacing={3}
          className={classes.gridRow}
          style={{ margin: 0, width: '100%' }}
        >
          <Grid item>
            <SponsorBox size={sizes.small} imageUrl={img('sponsors-2025/broccoli_ai.png')} />
          </Grid>
          <Grid item>
            <SponsorBox size={sizes.small} imageUrl={img('sponsors-2025/pava.png')} />
          </Grid>
          <Grid item>
            <SponsorBox size={{ height: '30px' }} imageUrl={img('sponsors-2025/roblox.png')} />
          </Grid>
          <Grid item>
            <SponsorBox size={sizes.small} imageUrl={img('sponsors-2025/jhu_cs.png')} />
          </Grid>
        </Grid>

        {/* Row 6 */}
        <Grid
          container
          spacing={3}
          className={classes.gridRow}
          style={{ margin: 0, width: '100%' }}
        >
          <Grid item>
            <SponsorBox size={sizes.small} imageUrl={img('sponsors-2025/mentormates.png')} />
          </Grid>
          <Grid item>
            <SponsorBox size={sizes.small} imageUrl={img('sponsors-2025/apl.png')} />
          </Grid>
          <Grid item>
            <SponsorBox size={sizes.small} imageUrl={img('sponsors-2025/beid.png')} />
          </Grid>
          <Grid item>
            <SponsorBox size={sizes.small} imageUrl={img('sponsors-2025/scm.png')} />
          </Grid>
        </Grid>

        {/* Row 7 */}
        <Grid
          container
          spacing={3}
          className={classes.gridRow}
          style={{ margin: 0, width: '100%' }}
        >
          <Grid item>
            <SponsorBox size={sizes.small} imageUrl={img('sponsors-2025/restruct.png')} />
          </Grid>
          <Grid item>
            <SponsorBox size={sizes.small} imageUrl={img('sponsors-2025/jhu_meche.png')} />
          </Grid>
          <Grid item>
            <SponsorBox size={sizes.small} imageUrl={img('sponsors-2025/mlh.png')} />
          </Grid>
        </Grid>
      </Grid>

      <SectionParagraph className="mt-10 text-center text-sm">
        Interested in sponsoring HopHacks? Email us at{' '}
        <a className="underline" href={`mailto:hophacks.sponsors@gmail.com`}>
          hophacks.sponsors@gmail.com
        </a>
      </SectionParagraph>
    </div>
  );
}
