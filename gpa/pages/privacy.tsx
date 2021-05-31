import { Box, Grid, Typography } from "@material-ui/core";

function PrivacyDashboard(): JSX.Element {
  return (
    <Box>
      <Grid item justify="flex-start">
        <Typography variant="body1">
          <Box px={2} fontWeight="fontWeightBold">
            Hotel name
          </Box>
        </Typography>
      </Grid>
      <Grid item>
        <Box px={2}></Box>
      </Grid>
    </Box>
  );
}

export default PrivacyDashboard;
