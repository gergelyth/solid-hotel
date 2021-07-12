import {
  saveSolidDatasetInContainer,
  SolidDataset,
} from "@inrupt/solid-client";
import { GetSession, GetUserPrivacyPodUrl } from "../../common/util/solid";
import { NextRouter } from "next/router";
import { DeserializeReservationStateChange } from "../../common/notifications/ReservationStateChange";
import { DeserializeFailureReport } from "../../common/notifications/FailureReport";
import { DeserializePairingRequestWithInformation } from "../../common/notifications/PairingRequestWithInformation";
import { DeserializePrivacyNotification } from "../../common/notifications/PrivacyNotification";
import { ShowErrorSnackbar } from "../../common/components/snackbar";
import {
  AddReservation,
  SetReservationStateAndInbox,
} from "../../common/util/solid_reservations";
import { SaveProfileThingToPod } from "../../common/util/solid_profile";

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
    SetReservationStateAndInbox(reservationId, newState, replyInbox);
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
    AddReservation(reservation, session);
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
  const privacyToken = DeserializePrivacyNotification(dataset);
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
    await saveSolidDatasetInContainer(privacyPodUrl, dataset, {
      fetch: session.fetch,
    });
  };

  return { text, onClick, onReceive };
}
