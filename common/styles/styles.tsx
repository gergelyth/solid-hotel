import { makeStyles, createStyles } from "@material-ui/core/styles";
import { purple } from "@material-ui/core/colors";

// Create a theme instance.
const styles = makeStyles(() =>
  createStyles({
    selectedGridItem: {
      color: purple[200],
    },
  })
);

export default styles;
