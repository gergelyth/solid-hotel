import { Button, Grid, Typography, Box } from "@material-ui/core";
import { PrivacyDashboard } from "../../common/components/privacy-dashboard";
import { PrivacyToken } from "../../common/types/PrivacyToken";
import { GetUserPrivacyPodUrl } from "../../common/util/solid";
import { SubmitPrivacyTokenDeletionRequest } from "../util/outgoingCommunications";

function CreateDeleteButton(token: PrivacyToken): JSX.Element {
  return (
    <Button
      variant="contained"
      color="secondary"
      size="small"
      disabled={token.expiry >= new Date()}
      onClick={() => SubmitPrivacyTokenDeletionRequest(token)}
    >
      Request delete
    </Button>
  );
}

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
          privacyTokenContainerUrl={GetUserPrivacyPodUrl()}
          tokenGrouping={(token) => token.hotel}
          deleteButton={CreateDeleteButton}
        />
      </Grid>
    </Grid>
  );
}

export default PrivacyDashboardPage;
