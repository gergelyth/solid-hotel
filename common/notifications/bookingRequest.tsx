import { getSourceUrl, removeThing, SolidDataset } from "@inrupt/solid-client";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { ParseReservation } from "../hooks/useReservations";
import { NotificationType } from "../types/NotificationsType";
import {
  AddNotificationThingToDataset,
  CreateReservationDataset,
} from "../util/datasetFactory";
import { GetThing } from "../util/solid";
import { SafeSaveDatasetAt } from "../util/solidWrapper";

/**
 * Parses the notification dataset into a booking request and deletes the sensitive information if required.
 * @returns The reservation properties submitted by the guest.
 */
export function DeserializeBookingRequest(
  dataset: SolidDataset,
  deleteSensitiveThing: boolean
): ReservationAtHotel {
  const datasetUrl = getSourceUrl(dataset);
  if (!datasetUrl) {
    throw new Error("Dataset URL is null");
  }

  const reservationThing = GetThing(dataset, "reservation");
  if (!reservationThing) {
    throw new Error("Reservation cannot be null");
  }

  const reservation = ParseReservation(reservationThing, datasetUrl);

  if (deleteSensitiveThing) {
    const updatedDataset = removeThing(dataset, reservationThing);
    SafeSaveDatasetAt(datasetUrl, updatedDataset);
  }

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
