import { getThing, SolidDataset } from "@inrupt/solid-client";
import { ReservationState } from "../../common/types/ReservationState";
import { NextRouter } from "next/router";
import { ParseReservation } from "../../common/hooks/useReservations";
import { AddReservationToHotelPod } from "../../common/util/solidhoteladmin";
import { ConfirmBookingRequest } from "../util/guestCommunications";

export function ParseBookingRequest(
  router: NextRouter,
  url: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const reservationThing = getThing(dataset, "#reservation");
  if (!reservationThing) {
    throw new Error("Reservation cannot be null");
  }

  //TODO fix ID nonsense
  const reservation = ParseReservation(reservationThing, "randomId");

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
