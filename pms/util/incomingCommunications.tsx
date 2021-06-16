import { SolidDataset } from "@inrupt/solid-client";
import { NextRouter } from "next/router";
import { DeserializeReservationStateChange } from "../../common/notifications/ReservationStateChange";
import { DeserializeBookingRequest } from "../../common/notifications/BookingRequest";
import { DeserializeInitialPairingRequest } from "../../common/notifications/InitialPairingRequest";
import { ReservationState } from "../../common/types/ReservationState";
import { AddReservationToHotelPod } from "../../common/util/solidhoteladmin";
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
    //TODO fix this
    router.push(`/users/${encodeURIComponent(reservation.owner)}`);
  };
  const onReceive = (): void => {
    reservation.state = ReservationState.CONFIRMED;
    AddReservationToHotelPod(reservation);
    //TODO we have AddReservation returning the inbox url in solid.tsx
    const hotelInboxUrl = CreateInboxForReservation(reservation);
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
    //TODO we can get the notification URL from the calling method here (just have to rewrite for all parsers)
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
