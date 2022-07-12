import { createMuiTheme } from '@material-ui/core/styles';
import createPalette from '@material-ui/core/styles/createPalette';

const theme = createMuiTheme({

  typography:{
    fontFamily:"PT Sans" //change font here
  },

    spacing: 8,
    palette: createPalette({
      primary: {
        main: "#141230",
      },
      background: {
        default: "#15ABFB",
      },
    }),
    overrides: {
      MuiCard: {
        root: {
          background: '#dfe6ee',
        },
      },

      

    },
  
});

export {theme};
