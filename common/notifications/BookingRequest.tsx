import { getSourceUrl, getThing, SolidDataset } from "@inrupt/solid-client";
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
  const datasetUrl = getSourceUrl(dataset);
  if (!datasetUrl) {
    throw new Error("Dataset URL is null");
  }

  const reservationThing = getThing(dataset, datasetUrl + "#reservation");
  if (!reservationThing) {
    throw new Error("Reservation cannot be null");
  }

  const reservation = ParseReservation(reservationThing, datasetUrl);
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
