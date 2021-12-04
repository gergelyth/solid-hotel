import { Grid, Typography, Box, LinearProgress, Card } from "@material-ui/core";
import { SnackbarContent } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import { forwardRef } from "react";

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

const CustomProgressSnackbar = forwardRef<
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
          <Grid container spacing={2} justify="center" direction="column">
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

export default CustomProgressSnackbar;
