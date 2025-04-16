// src/theme/index.js
import { createMuiTheme } from '@material-ui/core';
import { colors } from './teamColors';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: colors.primaryLight,
      main: colors.primaryMain,
      dark: colors.primaryDark
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary
    },
    background: {
      default: colors.bgLight,
      paper: colors.bgPaper
    },
    typography: {
      fontFamily: "'Montserrat', 'sans-serif'"
    }
  },

  overrides: {
    MuiOutlinedInput: {
      root: {
        borderRadius: 16,
        '& $notchedOutline': {
          borderRadius: 16 // Ensures the outline is rounded even when not focused
        },
        '&$focused $notchedOutline': {
          borderColor: '#FFE194', // gold border
          boxShadow: '0 0 10px 10px rgba(255, 215, 0, 0.2)' // gold glow
        }
      }
    }
  },

  // Custom theme properties for your specific components
  custom: {
    // These can be used in your component styles
    teamPage: {
      header: {
        titleColor: colors.textLight,
        subtitleColor: colors.textLight
      },
      dropdownContainer: {
        spacing: 2, // in theme.spacing units
        maxWidth: 900
      },
      textField: {
        borderRadius: '30px',
        minWidth: 150
      },
      formControl: {
        minWidth: 200,
        marginRight: 2 // in theme.spacing units
      },
      container: {
        minHeight: '404px'
      }
    }
  }
});

export default theme;
