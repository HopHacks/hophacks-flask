import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'montserrat' //change font here
  },

  spacing: 8,
  palette: {
    primary: {
      main: '#141230'
    },
    background: {
      default: '#0F1827'
    }
  },
  //   overrides: {
  //     MuiCard: {
  //       root: {
  //         background: '#dfe6ee'
  //       }
  //     }
  //   }
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          '&:hover': {
            cursor: 'pointer'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          '&:hover': {
            cursor: 'pointer'
          }
        }
      }
    }
  }
});

export { theme };
