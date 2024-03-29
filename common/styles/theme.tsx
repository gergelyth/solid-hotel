import { createTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

/**
 * Creates the default palette for the application.
 */
const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#B22222",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
});

export default theme;
