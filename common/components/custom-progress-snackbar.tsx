import { Grid, Typography, Box, LinearProgress, Card } from "@material-ui/core";
import { SnackbarContent } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import { forwardRef } from "react";

/**
 * Style made for custom snackbars.
 */
export const useCustomSnackbarStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up("sm")]: {
      minWidth: "344px !important",
    },
  },
  card: {
    width: "100%",
  },
}));

/**
 * Highlights that a major operation is going on in the background. Have to be closed manually when the operation is finished.
 * @returns A persisted snackbar in the lower right corner with an indefinite loading bar and the passed text displayed.
 */
export const CustomProgressSnackbar = forwardRef<
  HTMLDivElement,
  {
    key: string | number;
    message: string;
  }
>((props, ref) => {
  const classes = useCustomSnackbarStyles();
  return (
    <SnackbarContent ref={ref} className={classes.root} key={props.key}>
      <Card className={classes.card} raised>
        <Box m={2} p={2}>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            direction="column"
          >
            <Grid item>
              <Typography variant="h6">
                <Box fontWeight="fontWeightBold" textAlign="center">
                  {props.message}
                </Box>
              </Typography>
            </Grid>
            <Grid item>
              <LinearProgress />
            </Grid>
          </Grid>
        </Box>
      </Card>
    </SnackbarContent>
  );
});

CustomProgressSnackbar.displayName = "CustomProgressSnackbar";
