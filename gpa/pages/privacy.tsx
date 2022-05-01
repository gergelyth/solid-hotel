import { saveSolidDatasetInContainer } from "@inrupt/solid-client";
import { Button, Container, Typography, Box } from "@material-ui/core";
import { PrivacyDashboard } from "../../common/components/privacy-dashboard";
import { ShowErrorSnackbar } from "../../common/components/snackbar";
import { useGuestPrivacyTokens } from "../../common/hooks/usePrivacyTokens";
import { GuestPrivacyToken } from "../../common/types/GuestPrivacyToken";
import { PrivacyToken } from "../../common/types/PrivacyToken";
import { CreateGuestPrivacyTokenDataset } from "../../common/util/datasetFactory";
import { GetSession, GetUserPrivacyPodUrl } from "../../common/util/solid";
import { GetInboxUrlFromReservationUrl } from "../../common/util/urlParser";
import { reservationFieldToRdfMap } from "../../common/vocabularies/rdf_reservation";
import { SubmitPrivacyTokenDeletionRequest } from "../util/outgoingCommunications";

async function CreateInboxTokenUntilConfirmation(
  templateToken: GuestPrivacyToken
): Promise<void> {
  const session = GetSession();
  const privacyPodUrl = GetUserPrivacyPodUrl();
  if (!privacyPodUrl) {
    ShowErrorSnackbar("User not logged in");
    return;
  }

  const newToken = { ...templateToken };
  newToken.fieldList = [reservationFieldToRdfMap.inbox];
  newToken.urlAtGuest = undefined;
  newToken.reason =
    "The inbox URL to wait for the data protection profile removal confirmation.\nWill be removed as confirmation is received.";
  const newTokenDataset = CreateGuestPrivacyTokenDataset(newToken);

  await saveSolidDatasetInContainer(privacyPodUrl, newTokenDataset, {
    fetch: session.fetch,
  });
}

//send the inbox along to which GPA is expecting an answer and create a GuestPrivacyToken just for the GPA with the inbox in it,
//with the same datatargeturl as the data protection profile token is. The PMS, after sending the reply, doesnt delete the notification,
//but anonymizes the inbox URL. The GPA when gets the answer about the deletion, deletes both privacy tokens.
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
        if (!guestPrivacyToken.reservation) {
          throw new Error(
            "The reservation is undefined in the guestPrivacyToken. That shouldn't happen"
          );
        }
        const guestInboxUrl = GetInboxUrlFromReservationUrl(
          guestPrivacyToken.reservation
        );
        SubmitPrivacyTokenDeletionRequest(guestPrivacyToken, guestInboxUrl);
        CreateInboxTokenUntilConfirmation(guestPrivacyToken);
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
