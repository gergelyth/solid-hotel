import { SolidDataset } from "@inrupt/solid-client";
import { NextRouter } from "next/router";
import { DeserializeReservationStateChange } from "../../common/notifications/ReservationStateChange";
import { DeserializeBookingRequest } from "../../common/notifications/BookingRequest";
import { ReservationState } from "../../common/types/ReservationState";
import { AddReservationToHotelPod } from "../../common/util/solidhoteladmin";
import { DoOnStateChange } from "./actionOnNewReservationState";
import { ConfirmReservationStateRequest } from "./outgoingCommunications";
import { CreateInboxForReservation } from "../../common/util/solid";

export function ReceiveReservationStateChange(
  router: NextRouter,
  hotelInboxUrl: string,
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
  } = DeserializeReservationStateChange(hotelInboxUrl, dataset);
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
    //TODO probably the AddReservationToHotelPod should return the url for that and then we can define the inbox
    const hotelInboxUrl = CreateInboxForReservation(reservation);
    ConfirmReservationStateRequest(
      ReservationState.CONFIRMED,
      reservation.inbox,
      hotelInboxUrl
    );
  };

  return { text, onClick, onReceive };
}
