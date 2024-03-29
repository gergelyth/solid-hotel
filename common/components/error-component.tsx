import { Box, Grid, Typography } from "@material-ui/core";
import { ErrorOutline } from "@material-ui/icons";
import { red } from "@material-ui/core/colors";

/**
 * A general error component we can show instead of a component that failed to render for some reason.
 * @returns A component signaling that an error occurred and pointing the user to the console.
 */
export function ErrorComponent(): JSX.Element {
  return (
    <Box border={1} borderRadius={16}>
      <Box
        style={{
          backgroundColor: red[600],
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
        padding={3}
        textAlign="center"
      >
        <ErrorOutline style={{ fontSize: "400%", color: "white" }} />
      </Box>
      <Box p={3}>
        <Grid
          container
          spacing={1}
          alignItems="center"
          justifyContent="center"
          direction="column"
        >
          <Grid item>
            <Typography variant="h6" align="center">
              Error
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" align="center">
              Component cannot render. See console log for more information.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
