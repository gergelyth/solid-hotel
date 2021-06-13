import {
  createSolidDataset,
  getThing,
  setThing,
  SolidDataset,
  Thing,
} from "@inrupt/solid-client";
import { AddNotificationThingToDataset } from "../util/solidCommon";
import { NotificationType } from "../types/NotificationsType";
import { ParseReservation } from "../hooks/useReservations";
import { ReservationAtHotel } from "../types/ReservationAtHotel";

export function DeserializePairingRequestWithInformation(
  dataset: SolidDataset
): {
  reservation: ReservationAtHotel;
  profileThing: Thing;
} {
  const reservationThing = getThing(dataset, "#reservation");
  if (!reservationThing) {
    throw new Error("Reservation cannot be null");
  }

  //TODO fix ID nonsense
  const reservation = ParseReservation(reservationThing, "randomId");

  const hotelProfileThing = getThing(dataset, "#hotelProfile");
  if (!hotelProfileThing) {
    throw new Error("Hotel profile null in pairing request");
  }

  return { reservation: reservation, profileThing: hotelProfileThing };
}

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
