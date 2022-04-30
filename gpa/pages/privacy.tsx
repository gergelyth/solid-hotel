import { Button, Container, Typography, Box } from "@material-ui/core";
import { PrivacyDashboard } from "../../common/components/privacy-dashboard";
import { useGuestPrivacyTokens } from "../../common/hooks/usePrivacyTokens";
import { GuestPrivacyToken } from "../../common/types/GuestPrivacyToken";
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
      onClick={() => {
        const guestPrivacyToken = token as GuestPrivacyToken;
        if (!guestPrivacyToken) {
          throw new Error(
            "Delete button clicked with something other than GuestPrivacyToken!"
          );
        }
        SubmitPrivacyTokenDeletionRequest(guestPrivacyToken);
      }}
    >
      Request delete
    </Button>
  );
}

function PrivacyDashboardPage(): JSX.Element {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">
          <Box textAlign="center">Privacy dashboard</Box>
        </Typography>
        <Typography variant="caption">
          <Box fontStyle="italic" textAlign="center">
            Entries with the latest expiry date are highlighted
          </Box>
        </Typography>
      </Box>

      <PrivacyDashboard
        retrieval={useGuestPrivacyTokens(GetUserPrivacyPodUrl())}
        tokenGrouping={(token) => token.hotel}
        deleteButton={CreateDeleteButton}
      />
    </Container>
  );
}

export default PrivacyDashboardPage;
