import {
  addBoolean,
  addDatetime,
  addInteger,
  addStringNoLocale,
  createSolidDataset,
  createThing,
  setThing,
} from "@inrupt/solid-client";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { reservationFieldToRdfMap } from "../vocabularies/rdf_reservation";
import { SolidDataset } from "@inrupt/solid-client";
import { notificationToRdfMap } from "../vocabularies/rdf_notification";
import { NotificationType } from "../types/NotificationsType";

export function CreateReservationDataset(
  reservation: ReservationAtHotel
): SolidDataset {
  let reservationDataset = createSolidDataset();

  let newReservation = createThing({ name: "reservation" });
  newReservation = addStringNoLocale(
    newReservation,
    reservationFieldToRdfMap.room,
    reservation.room
  );
  newReservation = reservation.inbox
    ? addStringNoLocale(
        newReservation,
        reservationFieldToRdfMap.inbox,
        reservation.inbox
      )
    : newReservation;
  newReservation = addStringNoLocale(
    newReservation,
    reservationFieldToRdfMap.hotel,
    reservation.hotel
  );
  newReservation = addStringNoLocale(
    newReservation,
    reservationFieldToRdfMap.owner,
    reservation.owner
  );
  newReservation = addInteger(
    newReservation,
    reservationFieldToRdfMap.state,
    reservation.state.valueOf()
  );
  newReservation = addDatetime(
    newReservation,
    reservationFieldToRdfMap.checkinTime,
    reservation.dateFrom
  );
  newReservation = addDatetime(
    newReservation,
    reservationFieldToRdfMap.checkoutTime,
    reservation.dateTo
  );

  reservationDataset = setThing(reservationDataset, newReservation);
  return reservationDataset;
}

export function AddNotificationThingToDataset(
  dataset: SolidDataset,
  notificationType: NotificationType
): SolidDataset {
  let notification = createThing({ name: "notification" });
  notification = addBoolean(
    notification,
    notificationToRdfMap.isProcessed,
    false
  );
  notification = addInteger(
    notification,
    notificationToRdfMap.notificationType,
    notificationType.valueOf()
  );

  return setThing(dataset, notification);
}
