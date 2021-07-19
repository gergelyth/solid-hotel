import {
  addBoolean,
  addDatetime,
  addInteger,
  addStringNoLocale,
  createSolidDataset,
  createThing,
  getThing,
  setStringNoLocale,
  setThing,
} from "@inrupt/solid-client";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { reservationFieldToRdfMap } from "../vocabularies/rdf_reservation";
import { SolidDataset } from "@inrupt/solid-client";
import { notificationToRdfMap } from "../vocabularies/rdf_notification";
import { NotificationType } from "../types/NotificationsType";
import { PrivacyToken } from "../types/PrivacyToken";
import { privacyTokenToRdfMap } from "../vocabularies/notification_payloads/rdf_privacy";

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

export function CreatePrivacyTokenDataset(
  privacyToken: PrivacyToken
): SolidDataset {
  let privacyTokenDataset = createSolidDataset();

  let newPrivacyToken = createThing({ name: "privacy" });
  newPrivacyToken = addStringNoLocale(
    newPrivacyToken,
    privacyTokenToRdfMap.hotel,
    privacyToken.hotel
  );
  newPrivacyToken = addStringNoLocale(
    newPrivacyToken,
    privacyTokenToRdfMap.guest,
    privacyToken.guest
  );
  privacyToken.fieldList.forEach((field) => {
    newPrivacyToken = addStringNoLocale(
      newPrivacyToken,
      privacyTokenToRdfMap.fieldList,
      field
    );
  });
  newPrivacyToken = addStringNoLocale(
    newPrivacyToken,
    privacyTokenToRdfMap.reason,
    privacyToken.reason
  );
  newPrivacyToken = addDatetime(
    newPrivacyToken,
    privacyTokenToRdfMap.expiry,
    privacyToken.expiry
  );

  privacyTokenDataset = setThing(privacyTokenDataset, newPrivacyToken);
  return privacyTokenDataset;
}

export function SetUrlInPrivacyTokenDataset(
  dataset: SolidDataset,
  tokenUrl: string
): SolidDataset {
  let newPrivacyToken = getThing(dataset, tokenUrl + "#privacy");
  if (!newPrivacyToken) {
    throw new Error("Privacy thing is null in dataset");
  }
  newPrivacyToken = setStringNoLocale(
    newPrivacyToken,
    privacyTokenToRdfMap.url,
    tokenUrl
  );
  return setThing(dataset, newPrivacyToken);
}
