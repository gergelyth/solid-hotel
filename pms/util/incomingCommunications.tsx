import { getSolidDataset, SolidDataset } from "@inrupt/solid-client";
import { NextRouter } from "next/router";
import { DeserializeReservationStateChange } from "../../common/notifications/ReservationStateChange";
import { DeserializeBookingRequest } from "../../common/notifications/BookingRequest";
import { DeserializeInitialPairingRequest } from "../../common/notifications/InitialPairingRequest";
import { DeserializePrivacyInformationDeletion } from "../../common/notifications/PrivacyInformationDeletion";
import { ReservationState } from "../../common/types/ReservationState";
import { DoOnStateChange } from "./actionOnNewReservationState";
import {
  ConfirmReservationStateRequest,
  SendPairingRequestWithInformation,
} from "./outgoingCommunications";
import { SetGlobalDialog } from "../../common/components/global-dialog";
import ApproveChangeDialog from "../../common/components/profile/approve-change-dialog";
import {
  GetCoreReservationFolderFromInboxUrl,
  GetReservationUrlFromInboxUrl,
} from "../../common/util/urlParser";
import { GetPairingToken } from "./pairingTokenHandler";
import {
  ShowErrorSnackbar,
  ShowSuccessSnackbar,
} from "../../common/components/snackbar";
import { AddReservation } from "../../common/util/solid_reservations";
import { ConvertToPrivacyToken } from "../../common/hooks/usePrivacyTokens";
import { GetSession } from "../../common/util/solid";
import { AnonymizeFieldsAndDeleteToken } from "../../common/util/privacyHelper";

export function ReceiveReservationStateChange(
  router: NextRouter,
  hotelInboxUrl: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const { reservationId, newState, replyInbox } =
    DeserializeReservationStateChange(hotelInboxUrl, dataset);
  //TODO check if onReceive gets no Error, and adjust this text accordingly
  const text = `The state ${newState.toString()} was set for reservation ${reservationId}.
        Click to view reservation.`;
  const onClick = (): void => {
    router.push(`/reservations/${encodeURIComponent(reservationId)}`);
  };
  const onReceive = (): void => {
    //TODO we'll probably need the full reservation here and we get the dataset in the previous command - so unify that
    DoOnStateChange(reservationId, newState, replyInbox, hotelInboxUrl);
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

  const text = `Reservation requested for ${reservation.owner} for dates ${reservation.dateFrom}-${reservation.dateTo}.
        Request was automatically confirmed.`;
  const onClick = (): void => {
    router.push("/reservations");
  };
  const onReceive = async (): Promise<void> => {
    reservation.state = ReservationState.CONFIRMED;
    const hotelInboxUrl = await AddReservation(reservation);
    ConfirmReservationStateRequest(
      ReservationState.CONFIRMED,
      reservation.inbox,
      hotelInboxUrl
    );
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
  const text = `A guest changed a field in their Solid Pod and is trying to propagate the change to the hotel's side.
  Click here to review.`;
  const onClick = (): void => {
    SetGlobalDialog(<ApproveChangeDialog dataset={dataset} />);
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

  const text = `Pairing request received for reservation ${reservationUrl}.`;
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
