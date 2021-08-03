import { createMuiTheme } from '@material-ui/core/styles';
import createPalette from '@material-ui/core/styles/createPalette';

const theme = createMuiTheme({

  typography:{
    fontFamily:"Seravek" //change font here
  },

    spacing: 8,
    palette: createPalette({
      primary: {
        main: "#141230",
      },
      background: {
        default: "#0F1827",
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
