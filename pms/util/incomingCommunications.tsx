import { getSolidDataset, SolidDataset } from "@inrupt/solid-client";
import { NextRouter } from "next/router";
import { DeserializeReservationStateChange } from "../../common/notifications/ReservationStateChange";
import { DeserializeBookingRequest } from "../../common/notifications/BookingRequest";
import { DeserializeInitialPairingRequest } from "../../common/notifications/InitialPairingRequest";
import { DeserializePrivacyInformationDeletion } from "../../common/notifications/PrivacyInformationDeletion";
import { DeserializeProfileModification } from "../../common/notifications/ProfileModification";
import { ReservationState } from "../../common/types/ReservationState";
import { DoOnStateChange } from "./actionOnNewReservationState";
import {
  ConfirmReservationStateRequest,
  SendPairingRequestWithInformation,
  SendPrivacyToken,
} from "./outgoingCommunications";
import {
  GetCoreReservationFolderFromInboxUrl,
  GetReservationIdFromInboxUrl,
  GetReservationUrlFromInboxUrl,
} from "../../common/util/urlParser";
import { GetPairingToken } from "../../common/util/pairingTokenHandler";
import {
  ShowCustomSnackbar,
  ShowErrorSnackbar,
  ShowSuccessSnackbar,
} from "../../common/components/snackbar";
import {
  AddReservation,
  GetOwnerFromReservation,
} from "../../common/util/solid_reservations";
import { ConvertToPrivacyToken } from "../../common/hooks/usePrivacyTokens";
import { GetSession } from "../../common/util/solid";
import {
  AnonymizeFieldsAndDeleteToken,
  CreateReservationPrivacyToken,
} from "./privacyHelper";
import SendChangeSnackbar from "../../common/util/tracker/trackerSendChange";
import { IncomingProfileChangeStrings } from "../../common/util/tracker/profileChangeStrings";
import UpdateLocalProfileSnackbar from "../../common/components/profile/update-local-profile";

export function ReceiveReservationStateChange(
  router: NextRouter,
  notificationUrl: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const { reservationId, newState, replyInbox } =
    DeserializeReservationStateChange(notificationUrl, dataset);
  //TODO check if onReceive gets no Error, and adjust this text accordingly
  const text = `The state [${newState.toString()}] was set for reservation [${reservationId}].\nClick to view reservation.`;
  const onClick = (): void => {
    router.push(`/reservations/${encodeURIComponent(reservationId)}`);
  };
  const onReceive = (): void => {
    //TODO we'll probably need the full reservation here and we get the dataset in the previous command - so unify that
    DoOnStateChange(reservationId, newState, replyInbox);
  };

  return { text, onClick, onReceive };
}

export function ReceiveBookingRequest(
  router: NextRouter,
  bookingRequestUrl: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const reservation = DeserializeBookingRequest(dataset);

  const text = `Reservation requested for [${
    reservation.owner
  }] for dates [${reservation.dateFrom.toDateString()}]-[${reservation.dateTo.toDateString()}].\nRequest was automatically confirmed.`;
  const onClick = (): void => {
    router.push("/reservations");
  };
  const onReceive = async (): Promise<void> => {
    if (!reservation.inbox) {
      ShowErrorSnackbar("Inbox is null in received reservation request");
      return;
    }

    reservation.state = ReservationState.CONFIRMED;
    const hotelInboxUrl = await AddReservation(reservation);
    ConfirmReservationStateRequest(
      ReservationState.CONFIRMED,
      reservation.inbox,
      hotelInboxUrl
    );

    const privacyToken = await CreateReservationPrivacyToken(
      GetReservationUrlFromInboxUrl(hotelInboxUrl),
      reservation
    );
    SendPrivacyToken(reservation.inbox, privacyToken);
  };

  return { text, onClick, onReceive };
}

export function ReceiveProfileModification(
  router: NextRouter,
  hotelInboxUrl: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const text = `A guest changed a field in their Solid Pod and is trying to propagate the change to the hotel's side.\nClick here to review.`;
  const onClick = async (): Promise<void> => {
    const reservationId = GetReservationIdFromInboxUrl(hotelInboxUrl);
    const reservationOwner = await GetOwnerFromReservation(reservationId);
    if (!reservationOwner) {
      throw new Error(
        `Reservation ${reservationId} doesn't have an owner in ReceiveProfileModification`
      );
    }

    const fieldChanges = DeserializeProfileModification(dataset);

    ShowCustomSnackbar((key) => (
      <SendChangeSnackbar
        key={key}
        profileUrl={reservationOwner}
        rdfFields={Object.keys(fieldChanges)}
        requiresApproval={true}
        profileChangeStrings={IncomingProfileChangeStrings()}
        approveButtonFunction={(fieldOptions) =>
          ShowCustomSnackbar((key) => (
            <UpdateLocalProfileSnackbar
              key={key}
              profileUrl={reservationOwner}
              fieldOptions={fieldOptions}
            />
          ))
        }
        newValues={fieldChanges}
      />
    ));
  };
  const onReceive = (): void => undefined;

  return { text, onClick, onReceive };
}

export function ReceiveInitialPairingRequest(
  router: NextRouter,
  hotelInboxUrl: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  //TODO what happens if something goes wrong at the user's side and we delete the parsing token - we won't ever be able to repeat
  const { guestInboxUrl, token: receivedToken } =
    DeserializeInitialPairingRequest(dataset);
  const coreReservationFolder =
    GetCoreReservationFolderFromInboxUrl(hotelInboxUrl);

  const reservationUrl = GetReservationUrlFromInboxUrl(hotelInboxUrl);

  const text = `Pairing request received for reservation [${reservationUrl}].`;
  const onClick = (): void => undefined;
  const onReceive = async (): Promise<void> => {
    const expectedPairingToken = await GetPairingToken(coreReservationFolder);
    if (!expectedPairingToken) {
      ShowErrorSnackbar(
        `Pairing token not found in the hotel pod for reservation [${reservationUrl}]`
      );
      return;
    }

    if (receivedToken != expectedPairingToken) {
      ShowErrorSnackbar(
        `Request pairing token [${receivedToken}] not matching the expected token [${expectedPairingToken}]`
      );
      return;
    }

    ShowSuccessSnackbar(
      `Pairing request for [${reservationUrl}] successful. Sending information to guest.`
    );
    SendPairingRequestWithInformation(
      reservationUrl,
      hotelInboxUrl,
      guestInboxUrl
    );
  };

  return { text, onClick, onReceive };
}

export function ReceivePrivacyTokenDeletionRequest(
  router: NextRouter,
  hotelInboxUrl: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const tokenUrl = DeserializePrivacyInformationDeletion(dataset);

  const text = `Privacy token at [${tokenUrl}] was requested to be deleted.`;
  const onClick = (): void => undefined;
  const onReceive = async (): Promise<void> => {
    const session = GetSession();

    //TODO this especially needs to be a safe Solid call in case we get a bad URL
    const tokenDataset = await getSolidDataset(tokenUrl, {
      fetch: session.fetch,
    });

    const privacyToken = ConvertToPrivacyToken(tokenDataset, tokenUrl);
    if (!privacyToken) {
      throw new Error(`Parsing of privacy token ${tokenUrl} failed`);
    }

    if (privacyToken.expiry >= new Date()) {
      ShowErrorSnackbar(
        "Privacy token have not expired yet. Deletion request denied."
      );
      return;
    }

    AnonymizeFieldsAndDeleteToken(privacyToken);
  };

  return { text, onClick, onReceive };
}
