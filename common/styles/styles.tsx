import { makeStyles, createStyles } from "@material-ui/core/styles";
import { grey, purple } from "@material-ui/core/colors";

/**
 * Some custom CSS styles for common elements, e.g. navigation bar, grid items, footer and main component.
 */
const styles = makeStyles(() =>
  createStyles({
    selectedGridItem: {
      color: purple[200],
    },
    navigationBar: {
      background: grey[500],
    },
    main: {
      padding: "1rem 0",
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    footer: {
      width: "100%",
      borderTop: "5px solid #eaeaea",
      borderBottom: "5px solid #eaeaea",
      display: "flex",
    },
  })
);

export default styles;
