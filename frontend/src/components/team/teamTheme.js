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
    }
  },

  overrides: {
    // Global styles for components
    MuiOutlinedInput: {
      root: {
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: `0 0 0 3px ${colors.glowLight}`,
          borderColor: '#FF0000'
        }
        // '&.Mui-focused': {
        //   boxShadow: `0 0 0 3px ${colors.glowStrong}`,
        //   '& .MuiOutlinedInput-notchedOutline': {
        //     borderColor: colors.primaryLight
        //   }
        // }
      },
      notchedOutline: {
        borderColor: colors.primaryLight
      },
      input: {
        color: colors.textLight, // Text color inside inputs
        '&::placeholder': {
          color: `${colors.textLight}`,
          opacity: 0.7
        }
      }
    },

    MuiFilledInput: {
      root: {
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: `0 0 0 3px ${colors.glowLight}`,
          borderColor: '#FF0000'
        }
        // '&.Mui-focused': {
        //   boxShadow: `0 0 0 3px ${colors.glowStrong}`,
        //   '& .MuiOutlinedInput-notchedOutline': {
        //     borderColor: colors.primaryLight
        //   }
        // }
      },
      notchedOutline: {
        borderColor: colors.primaryLight
      },
      input: {
        color: colors.textLight, // Text color inside inputs
        '&::placeholder': {
          color: `${colors.textLight}`,
          opacity: 0.7
        }
      }
    },

    MuiSelect: {
      root: {
        color: colors.textLight
      },
      icon: {
        color: colors.primaryMain
      },
      select: {
        '&:focus': {
          backgroundColor: 'transparent'
        }
      }
    },

    MuiMenuItem: {
      root: {
        '&.Mui-selected': {
          backgroundColor: colors.primaryLight,
          color: colors.textPrimary
        },
        '&.Mui-selected:hover': {
          backgroundColor: colors.primaryDark
        }
        // '&:hover': {
        //   backgroundColor: colors.primaryLight
        // }
      }
    },

    MuiInputLabel: {
      root: {
        color: colors.primaryMain,
        '&.Mui-focused': {
          color: colors.primaryLight
        }
      }
    },

    MuiTab: {
      root: {
        color: colors.tabDefault,
        backgroundColor: 'transparent',
        '&.Mui-selected': {
          color: colors.tabSelected
        }
      }
    },

    MuiTabScrollButton: {
      root: {
        color: colors.tabDefault,
        '&.Mui-disabled': {
          color: '#cccccc'
        }
      }
    }

    // Add more global component styles as needed
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
