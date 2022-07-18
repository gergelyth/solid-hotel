import { Button, Container, Typography, Box } from "@material-ui/core";
import { PrivacyDashboard } from "../../common/components/privacy-dashboard";
import { ShowErrorSnackbar } from "../../common/components/snackbar";
import { useGuestPrivacyTokens } from "../../common/hooks/usePrivacyTokens";
import { GuestPrivacyToken } from "../../common/types/GuestPrivacyToken";
import { PrivacyToken } from "../../common/types/PrivacyToken";
import { ReservationState } from "../../common/types/ReservationState";
import { CreateGuestPrivacyTokenDataset } from "../../common/util/datasetFactory";
import { GetUserPrivacyPodUrl } from "../../common/util/solid";
import { SafeSaveDatasetInContainer } from "../../common/util/solid_wrapper";
import { GetInboxUrlFromReservationUrl } from "../../common/util/urlParser";
import { reservationFieldToRdfMap } from "../../common/vocabularies/rdf_reservation";
import { SubmitPrivacyTokenDeletionRequest } from "../util/outgoingCommunications";

/**
 * See the description of the {@link CreateDeleteButton}.
 * Since we send the inbox along the request in which the GPA is expecting an answer, we create a GuestPrivacyToken just for the GPA with the inbox in it.
 * The template token received as an argument acts a sample according to which we create this special token.
 */
async function CreateInboxTokenUntilConfirmation(
  templateToken: GuestPrivacyToken
): Promise<void> {
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

  await SafeSaveDatasetInContainer(privacyPodUrl, newTokenDataset);
}

/**
 * Creates the delete button for the specific privacy token.
 * The button is deleted if the expiry date did not pass yet.
 * Sends the inbox along the request in which the GPA is expecting an answer and creates a GuestPrivacyToken just for the GPA with the inbox in it with the same datatargeturl as the data protection profile token.
 * The PMS, after sending the reply, doesn't delete the notification, but anonymizes the inbox URL.
 * When the GPA gets the answer about the deletion, deletes both privacy tokens.
 * @returns The delete button with the onClick functionality to submit the privacy token deletion request.
 */
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

        if (guestPrivacyToken.forReservationState === ReservationState.PAST) {
          const guestInboxUrl = GetInboxUrlFromReservationUrl(
            guestPrivacyToken.reservation
          );
          SubmitPrivacyTokenDeletionRequest(guestPrivacyToken, guestInboxUrl);
          CreateInboxTokenUntilConfirmation(guestPrivacyToken);
        } else {
          SubmitPrivacyTokenDeletionRequest(guestPrivacyToken);
        }
      }}
    >
      Request delete
    </Button>
  );
}

/**
 * The GPA wrapper around the privacy dashboard component described in {@link PrivacyDashboard}.
 * Defines the privacy token retrieval to fetch the guest privacy tokens from the guest's privacy container.
 * Groups the privacy tokens by the hotel WebId.
 * Defines the delete button component with the privacy token deletion request implementation (see {@link CreateDeleteButton}).
 * @returns A component wrapping the {@link PrivacyDashboard} component with GPA specific actions.
 */
function PrivacyDashboardPage(): JSX.Element {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }} textAlign="center">
        <Typography variant="h4">Privacy dashboard</Typography>
        <Box fontStyle="italic">
          <Typography variant="caption">
            Entries with the latest expiry date are highlighted
          </Typography>
        </Box>
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
