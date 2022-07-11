import { getSourceUrl, getThing, SolidDataset } from "@inrupt/solid-client";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { ParseReservation } from "../hooks/useReservations";
import { NotificationType } from "../types/NotificationsType";
import {
  AddNotificationThingToDataset,
  CreateReservationDataset,
} from "../util/datasetFactory";

/**
 * Parses the notification dataset into a booking request.
 * @returns The reservation properties submitted by the guest.
 */
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

/**
 * Serializes the reservation and creates a BookingRequest notification dataset with it.
 * @returns The booking request notification dataset.
 */
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
