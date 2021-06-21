import { getThing, SolidDataset } from "@inrupt/solid-client";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { ParseReservation } from "../hooks/useReservations";
import { NotificationType } from "../types/NotificationsType";
import {
  AddNotificationThingToDataset,
  CreateReservationDataset,
} from "../util/datasetFactory";

export function DeserializeBookingRequest(
  dataset: SolidDataset
): ReservationAtHotel {
  const reservationThing = getThing(dataset, "#reservation");
  if (!reservationThing) {
    throw new Error("Reservation cannot be null");
  }

  //TODO fix ID nonsense
  const reservation = ParseReservation(reservationThing, "randomId");
  return reservation;
}

export function SerializeBookingRequest(
  reservation: ReservationAtHotel
): SolidDataset {
  const reservationDataset = CreateReservationDataset(reservation);
  const notificationDataset = AddNotificationThingToDataset(
    reservationDataset,
    NotificationType.BookingRequest
  );

  return notificationDataset;
}
