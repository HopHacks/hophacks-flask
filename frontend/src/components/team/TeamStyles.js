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
    paddingBottom: theme.spacing(0.5)
  },

  subtitle: {
    color: 'white',
    paddingBottom: theme.spacing(3.5)
  },

  dropdownContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(theme.custom?.teamPage.dropdownContainer.spacing || 2),
    maxWidth: theme.custom?.teamPage.dropdownContainer.maxWidth || 900,
    flexWrap: 'wrap',
    gap: theme.spacing(2)
  },

  // You can use these minimal styles that depend on the theme overrides
  textField: {
    minWidth: theme.custom?.teamPage.textField.minWidth || 150
  },

  formControl: {
    minWidth: theme.custom?.teamPage.formControl.minWidth || 200,
    marginRight: theme.spacing(theme.custom?.teamPage.formControl.marginRight || 2)
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
    width: '100%'
  },

  gridContainer: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

export default useStyles;
