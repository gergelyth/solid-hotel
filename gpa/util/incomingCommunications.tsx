import { SolidDataset } from "@inrupt/solid-client";
import { GetSession, GetUserPrivacyPodUrl } from "../../common/util/solid";
import { NextRouter } from "next/router";
import { DeserializeReservationStateChange } from "../../common/notifications/reservationStateChange";
import { DeserializeFailureReport } from "../../common/notifications/failureReport";
import { DeserializePairingRequestWithInformation } from "../../common/notifications/pairingRequestWithInformation";
import { DeserializeGuestPrivacyNotification } from "../../common/notifications/privacyNotification";
import {
  ShowCustomSnackbar,
  ShowErrorSnackbar,
} from "../../common/components/snackbar";
import {
  AddReservation,
  SetReservationStateAndInbox,
} from "../../common/util/solidReservations";
import { SaveProfileThingToPod } from "../../common/util/solidProfile";
import { CreateGuestPrivacyTokenDataset } from "../../common/util/datasetFactory";
import { DeserializeProfileModification } from "../../common/notifications/profileModification";
import { IncomingProfileChangeStrings } from "../../common/util/tracker/profileChangeStrings";
import SendChangeSnackbar from "../../common/components/profilesync/tracker-send-change";
import { UpdateLocalProfileSnackbar } from "../../common/components/profile/update-local-profile";
import { DeserializePrivacyInformationDeletion } from "../../common/notifications/privacyInformationDeletion";
import { PrivacyTokenRemover } from "../components/util/privacy-token-remover";
import { GetReservationUrlFromInboxUrl } from "../../common/util/urlParser";
import { RevalidateReservations } from "../../common/hooks/useReservations";
import { RevalidateGuestPrivacyTokens } from "../../common/hooks/usePrivacyTokens";
import { SafeSaveDatasetInContainer } from "../../common/util/solidWrapper";

/**
 * Included in the {@link GPAParsers} list which defines the text, onClick and onReceive fields for the receipt of a reservation state change notification.
 * The onClick function takes the user to the reservation detail page in {@link ReservationDetail}.
 * The onReceive function sets the new reservation state and updates the reply inbox field in the guest's Solid Pod.
 * @returns The notification properties described above along with the text field, which informs the user of the successful operation.
 */
export function ReceiveReservationStateChange(
  router: NextRouter,
  url: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const { reservationId, newState, replyInbox } =
    DeserializeReservationStateChange(url, dataset);
  const text = `The state ${newState.toString()} was set for reservation ${reservationId}.
        Click to view reservation.`;
  const onClick = (): void => {
    router.push(`/reservations/${encodeURIComponent(reservationId)}`);
  };
  const onReceive = (): void => {
    SetReservationStateAndInbox(reservationId, newState, replyInbox).then(() =>
      RevalidateReservations()
    );
  };

  return { text, onClick, onReceive };
}

/**
 * Included in the {@link GPAParsers} list which defines the text, onClick and onReceive fields for the receipt of a failure report notification.
 * The onClick function takes the user to the reservation detail page in {@link ReservationDetail}.
 * The onReceive function does nothing.
 * @returns The notification properties described above along with the text field, which informs the user of the failure.
 */
export function ReceiveFailureReport(
  router: NextRouter,
  url: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const { reservationId, errorMessage, resultState } = DeserializeFailureReport(
    url,
    dataset
  );
  const text = `There was an error processing the reservation state change request: ${errorMessage}.
        The state is left at ${resultState.toString()}.
        Click to view reservation.`;
  const onClick = (): void => {
    router.push(`/reservations/${encodeURIComponent(reservationId)}`);
  };
  const onReceive = (): void => {
    //if we don't set the ReservationState of the reservation to something else before the request, there is no need to do anything here
    //if we do, we need to change that to resultState here
  };

  return { text, onClick, onReceive };
}

/**
 * Included in the {@link GPAParsers} list which defines the text, onClick and onReceive fields for the receipt of a pairing request notification with the payload sent by the hotel..
 * The onClick function provides the ability (as this is only optional) to populate the guest's profile with the fields presented during offline check-in.
 * The onReceive function saves the reservation details to the guest Pod.
 * @returns The notification properties described above along with the text field, which informs the user of the receipt of the data.
 */
export function ReceivePairingRequestWithInformation(
  router: NextRouter,
  url: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const { reservation, profileThing } =
    DeserializePairingRequestWithInformation(dataset);

  const text = `Pairing request successful. Reservation saved to the Pod. Click here to populate your profile with the personal information present at the hotel.`;
  const onClick = (): void => {
    SaveProfileThingToPod(profileThing);
    //TODO delete notification
    router.push("/");
  };

  const onReceive = (): void => {
    const session = GetSession();
    const webId = session?.info.webId;
    if (!webId) {
      ShowErrorSnackbar(
        "User not signed in. Parsing of the pairing request failed."
      );
      return;
    }
    reservation.owner = webId;
    //TODO remove the dummy reservation?
    AddReservation(reservation).then(() => RevalidateReservations());
  };

  return { text, onClick, onReceive };
}

/**
 * Included in the {@link GPAParsers} list which defines the text, onClick and onReceive fields for the receipt of a privacy token notification.
 * The onClick function takes the user to the privacy dashboard in {@link PrivacyDashboardPage}
 * The onReceive function creates the guest privacy token and saves it in the privacy token container found in the guest Pod.
 * @returns The notification properties described above along with the text field, which informs the user of the receipt of the privacy token.
 */
export function ReceivePrivacyToken(
  router: NextRouter,
  url: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const privacyToken = DeserializeGuestPrivacyNotification(dataset);
  const text = `Privacy token received from ${privacyToken.hotel}`;
  const onClick = (): void => {
    router.push("/privacy");
  };
  const onReceive = async (): Promise<void> => {
    const privacyPodUrl = GetUserPrivacyPodUrl();
    if (!privacyPodUrl) {
      ShowErrorSnackbar("User not logged in");
      return;
    }

    privacyToken.reservation = GetReservationUrlFromInboxUrl(url);

    //we need this workaround, otherwise we would save the Thing with the inbox url (we also delete the notification Thing this way)
    const privacyTokenDataset = CreateGuestPrivacyTokenDataset(privacyToken);

    await SafeSaveDatasetInContainer(privacyPodUrl, privacyTokenDataset);
    RevalidateGuestPrivacyTokens();
  };

  return { text, onClick, onReceive };
}

/**
 * Included in the {@link GPAParsers} list which defines the text, onClick and onReceive fields for the receipt of a privacy token deletion notice notification.
 * The onClick function does nothing.
 * The onReceive function displays a progress snackbar which deletes the corresponding privacy token on the side of the guest.
 * @returns The notification properties described above along with the text field, which informs the user of the successful operation.
 */
export function ReceivePrivacyTokenDeletionNotice(
  router: NextRouter,
  reservationInboxUrl: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const tokenDeletion = DeserializePrivacyInformationDeletion(dataset);

  const text = `Privacy token at [${tokenDeletion.tokenUrl}] was deleted at the hotel.\nDeleting the corresponding token.`;
  const onClick = (): void => undefined;
  const onReceive = async (): Promise<void> => {
    const snackbarId = "privacy-token-remover";
    ShowCustomSnackbar(
      () => (
        <PrivacyTokenRemover
          snackbarId={snackbarId}
          hotelUrl={tokenDeletion.tokenUrl}
        />
      ),
      snackbarId
    );
  };
  return { text, onClick, onReceive };
}

/**
 * Included in the {@link GPAParsers} list which defines the text, onClick and onReceive fields for the receipt of a profile modification notification.
 * The onClick function displays a snackbar which lets the guess choose which field updates to propagate to their Solid Pod.
 * The onReceive function does nothing.
 * @returns The notification properties described above along with the text field, which informs the user that a notification was received.
 */
export function ReceiveProfileModification(
  router: NextRouter,
  reservationInboxUrl: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const text = `A hotel changed a field in their local copy of your profile.\nClick here to review.`;
  const onClick = async (): Promise<void> => {
    const webId = GetSession().info.webId;
    if (!webId) {
      throw new Error("WebId null - this should never happen");
    }

    const fieldChanges = DeserializeProfileModification(dataset);

    const snackbarId = "receiveProfileModification";

    ShowCustomSnackbar(
      () => (
        <SendChangeSnackbar
          snackbarId={snackbarId}
          profileUrl={webId}
          rdfFields={Object.keys(fieldChanges)}
          requiresApproval={true}
          profileChangeStrings={IncomingProfileChangeStrings()}
          approveButtonFunction={(fieldOptions) =>
            ShowCustomSnackbar((key) => (
              <UpdateLocalProfileSnackbar
                snackbarKey={key}
                profileUrl={webId}
                fieldOptions={fieldOptions}
              />
            ))
          }
          newValues={fieldChanges}
        />
      ),
      snackbarId
    );
  };
  const onReceive = (): void => undefined;

  return { text, onClick, onReceive };
}
