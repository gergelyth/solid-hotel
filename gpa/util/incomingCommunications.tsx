import {
  saveSolidDatasetInContainer,
  SolidDataset,
} from "@inrupt/solid-client";
import { GetSession, GetUserPrivacyPodUrl } from "../../common/util/solid";
import { NextRouter } from "next/router";
import { DeserializeReservationStateChange } from "../../common/notifications/ReservationStateChange";
import { DeserializeFailureReport } from "../../common/notifications/FailureReport";
import { DeserializePairingRequestWithInformation } from "../../common/notifications/PairingRequestWithInformation";
import { DeserializeGuestPrivacyNotification } from "../../common/notifications/PrivacyNotification";
import {
  ShowCustomSnackbar,
  ShowErrorSnackbar,
} from "../../common/components/snackbar";
import {
  AddReservation,
  SetReservationStateAndInbox,
} from "../../common/util/solid_reservations";
import { SaveProfileThingToPod } from "../../common/util/solid_profile";
import { CreateGuestPrivacyTokenDataset } from "../../common/util/datasetFactory";
import { DeserializeProfileModification } from "../../common/notifications/ProfileModification";
import { IncomingProfileChangeStrings } from "../../common/util/tracker/profileChangeStrings";
import SendChangeSnackbar from "../../common/util/tracker/trackerSendChange";
import { UpdateLocalProfileSnackbar } from "../../common/components/profile/update-local-profile";
import { DeserializePrivacyInformationDeletion } from "../../common/notifications/PrivacyInformationDeletion";
import PrivacyTokenRemover from "./privacyTokenRemover";
import { GetReservationUrlFromInboxUrl } from "../../common/util/urlParser";
import { RevalidateReservations } from "../../common/hooks/useReservations";
import { RevalidateGuestPrivacyTokens } from "../../common/hooks/usePrivacyTokens";

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
    //TODO we should set the page in VerifyingComponent in different workflows so they don't wait - but how
    SetReservationStateAndInbox(reservationId, newState, replyInbox).then(() =>
      RevalidateReservations()
    );
  };

  return { text, onClick, onReceive };
}

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
    AddReservation(reservation).then(() => RevalidateReservations());
  };

  return { text, onClick, onReceive };
}

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
    const session = GetSession();
    const privacyPodUrl = GetUserPrivacyPodUrl();
    if (!privacyPodUrl) {
      ShowErrorSnackbar("User not logged in");
      return;
    }

    privacyToken.reservation = GetReservationUrlFromInboxUrl(url);

    //we need this workaround, otherwise we would save the Thing with the inbox url (we also delete the notification Thing this way)
    const privacyTokenDataset = CreateGuestPrivacyTokenDataset(privacyToken);

    await saveSolidDatasetInContainer(privacyPodUrl, privacyTokenDataset, {
      fetch: session.fetch,
    });
    RevalidateGuestPrivacyTokens();
  };

  return { text, onClick, onReceive };
}

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
    const snackbarId = "privacyTokenRemover";
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
                key={key}
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
