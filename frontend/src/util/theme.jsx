import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'montserrat',
  },
  spacing: 8,
  palette: {
    primary: {
      main: '#141230',
    },
    background: {
      default: '#0F1827',
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },
    },
  },
});

export { theme };
