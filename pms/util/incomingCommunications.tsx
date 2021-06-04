import { SolidDataset } from "@inrupt/solid-client";
import { SetReservationStateAndInbox } from "../../common/util/solid";
import { NextRouter } from "next/router";
import { DeserializeReservationStateChange } from "../../common/notifications/ReservationStateChange";
import { DeserializeBookingRequest } from "../../common/notifications/BookingRequest";
import { ReservationState } from "../../common/types/ReservationState";
import { AddReservationToHotelPod } from "../../common/util/solidhoteladmin";
import { ConfirmBookingRequest } from "./outgoingCommunications";

export function ReceiveReservationStateChange(
  router: NextRouter,
  url: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const {
    reservationId,
    newState,
    replyInbox,
  } = DeserializeReservationStateChange(url, dataset);
  const text = `The state ${newState.toString()} was set for reservation ${reservationId}.
        Click to view reservation.`;
  const onClick = (): void => {
    router.push(`/reservations/${encodeURIComponent(reservationId)}`);
  };
  const onReceive = (): void => {
    SetReservationStateAndInbox(reservationId, newState, replyInbox);
    //TODO process depending on the new state
  };

  return { text, onClick, onReceive };
}

export function ReceiveBookingRequest(
  router: NextRouter,
  url: string,
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
    //TODO probably the AddReservationToHotelPod should return the url for that and then we can define the inbox
    const inboxUrl = CreateInboxForReservation(reservation);
    ConfirmBookingRequest(inboxUrl);
  };

  return { text, onClick, onReceive };
}
