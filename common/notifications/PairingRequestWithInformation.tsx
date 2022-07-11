import {
  createSolidDataset,
  getSourceUrl,
  getThing,
  setThing,
  SolidDataset,
  Thing,
} from "@inrupt/solid-client";
import { AddNotificationThingToDataset } from "../util/datasetFactory";
import { NotificationType } from "../types/NotificationsType";
import { ParseReservation } from "../hooks/useReservations";
import { ReservationAtHotel } from "../types/ReservationAtHotel";

/**
 * Parses the notification dataset into a pairing request reply object with the information sent by the hotel to the guest's new Solid Pod.
 * @returns The reservation properties and the fields sent over by the hotel after the offline check-in.
 */
export function DeserializePairingRequestWithInformation(
  dataset: SolidDataset
): {
  reservation: ReservationAtHotel;
  profileThing: Thing;
} {
  const datasetUrl = getSourceUrl(dataset);
  if (!datasetUrl) {
    throw new Error("Dataset URL is null");
  }

  const reservationThing = getThing(dataset, datasetUrl + "#reservation");
  if (!reservationThing) {
    throw new Error("Reservation cannot be null");
  }

  const reservation = ParseReservation(reservationThing, datasetUrl);

  const hotelProfileThing = getThing(dataset, datasetUrl + "#hotelProfile");
  if (!hotelProfileThing) {
    throw new Error("Hotel profile null in pairing request");
  }

  return { reservation: reservation, profileThing: hotelProfileThing };
}

/**
 * Serializes the reservation and hotel profile things and creates an information notification dataset with it to complete the pairing operation.
 * @returns The pairing request with information notification dataset.
 */
export function SerializePairingRequestWithInformation(
  reservationThing: Thing,
  profileThing: Thing
): SolidDataset {
  let pairingRequestDataset = createSolidDataset();

  pairingRequestDataset = setThing(pairingRequestDataset, reservationThing);
  pairingRequestDataset = setThing(pairingRequestDataset, profileThing);

  const notificationDataset = AddNotificationThingToDataset(
    pairingRequestDataset,
    NotificationType.PairingRequestWithInformation
  );

  return notificationDataset;
}
