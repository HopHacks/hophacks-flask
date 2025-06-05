import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(10)
  },

  title: {
    fontWeight: 'bold',
    color: 'white',
    paddingBottom: theme.spacing(0.5),
  },

  subtitle: {
    color: 'white',
    paddingBottom: theme.spacing(3.5),
    fontWeight: 'bold',
    letterSpacing: '1px'
  },

  dropdownContainer: {
    display: 'flex',
    width: '90%',
    maxWidth: 700,
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    alignItems: 'center'
  },

  // You can use these minimal styles that depend on the theme overrides
  textField: {
    minWidth: theme.custom?.teamPage.textField.minWidth || 150,
    flexGrow: 1,
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    '& .MuiInputBase-root': {
      backgroundColor: '#ffffff',
      borderRadius: '16px'
    }
  },

  container: {
    height: 'fit-content',
    minHeight: theme.custom?.teamPage.container.minHeight || '404px',
    margin: '16px auto',
    padding: '16px'
  },

  tabsContainer: {
    display: 'flex',
    justifyContent: 'center',
    minWidth: '200px',
    width: '75%'
  },

  gridContainer: {
    display: 'flex',
    justifyContent: 'center'
  },

  formControl: {
    backgroundColor: '#ffb51f', // gold
    borderRadius: '16px', // higher border radius
    color: 'white',
    fontWeight: 'bold'
  },

  selectRoot: {
    color: 'white', // light blue text
    fontWeight: 600 // semi-bold
  },

  tabRoot: {
    borderBottom: '2px solid rgba(255, 255, 255, 0.1)', // default border
    transition: 'border-color 0.3s ease',
    fontWeight: 500,
    fontSize: '.8rem',
    color: '#ffffff',
    minWidth: 80, // default is 72px, but MUI makes it larger unless overridden
    padding: '6px 12px' // less horizontal padding
  },

  tabSelected: {
    borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
    color: '#ffffff'
  }
}));

export default useStyles;
