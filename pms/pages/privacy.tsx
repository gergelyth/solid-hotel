import { PrivacyDashboard } from "../../common/components/privacy-dashboard";
import { PrivacyTokensUrl } from "../../common/consts/solidIdentifiers";
import { Grid, Typography, Box } from "@material-ui/core";

function PrivacyDashboardPage(): JSX.Element {
  return (
    <Grid
      container
      spacing={7}
      justify="center"
      alignItems="stretch"
      direction="column"
    >
      <Grid item>
        <Typography variant="h4">
          <Box textAlign="center">Privacy dashboard</Box>
        </Typography>
        <Typography variant="caption">
          <Box fontStyle="italic" textAlign="center">
            Entries with the latest expiry date are highlighted
          </Box>
        </Typography>
      </Grid>

      <Grid item>
        <PrivacyDashboard
          privacyTokenContainerUrl={PrivacyTokensUrl}
          tokenGrouping={(token) => token.guest}
          deleteButton={() => null}
        />
      </Grid>
    </Grid>
  );
}

export default PrivacyDashboardPage;
