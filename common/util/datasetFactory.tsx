import {
  addBoolean,
  addDatetime,
  addInteger,
  addStringNoLocale,
  addUrl,
  createSolidDataset,
  createThing,
  setThing,
  Thing,
} from "@inrupt/solid-client";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { ReservationFieldToRdfMap } from "../vocabularies/rdfReservation";
import { SolidDataset } from "@inrupt/solid-client";
import { NotificationToRdfMap } from "../vocabularies/rdfNotification";
import { NotificationType } from "../types/NotificationsType";
import { PrivacyToken } from "../types/PrivacyToken";
import { PrivacyTokenToRdfMap } from "../vocabularies/notificationpayloads/rdfPrivacy";
import { HotelPrivacyToken } from "../types/HotelPrivacyToken";
import { GuestPrivacyToken } from "../types/GuestPrivacyToken";
import { ReservationStateRdfMap } from "../vocabularies/rdfReservationStatusTypes";
import { NotificationTypeRdfMap } from "../vocabularies/notificationpayloads/rdfNotificationTypes";
import { UtilRdfMap } from "../vocabularies/rdfUtil";

/**
 * Creates the corresponding Solid dataset for the reservation passed as an argument.
 * RDF properties are taken from {@link reservationFieldToRdfMap}.
 * @returns The Solid dataset containing the reservation information.
 */
export function CreateReservationDataset(
  reservation: ReservationAtHotel
): SolidDataset {
  let reservationDataset = createSolidDataset();

  let newReservation = createThing({ name: "reservation" });
  newReservation = addUrl(
    newReservation,
    UtilRdfMap.type,
    ReservationFieldToRdfMap.type
  );
  newReservation = addStringNoLocale(
    newReservation,
    ReservationFieldToRdfMap.room,
    reservation.room
  );
  newReservation = reservation.inbox
    ? addStringNoLocale(
        newReservation,
        ReservationFieldToRdfMap.inbox,
        reservation.inbox
      )
    : newReservation;
  newReservation = addStringNoLocale(
    newReservation,
    ReservationFieldToRdfMap.hotel,
    reservation.hotel
  );
  newReservation = addStringNoLocale(
    newReservation,
    ReservationFieldToRdfMap.owner,
    reservation.owner
  );
  newReservation = addUrl(
    newReservation,
    ReservationFieldToRdfMap.state,
    ReservationStateRdfMap[reservation.state]
  );
  newReservation = addDatetime(
    newReservation,
    ReservationFieldToRdfMap.checkinTime,
    reservation.dateFrom
  );
  newReservation = addDatetime(
    newReservation,
    ReservationFieldToRdfMap.checkoutTime,
    reservation.dateTo
  );

  reservationDataset = setThing(reservationDataset, newReservation);
  return reservationDataset;
}

/**
 * Attaches a notification Thing to the Solid dataset passed as an argument with the appropriate type.
 * RDF properties are taken from {@link notificationToRdfMap}.
 * @returns The passed Solid dataset enriched with a notification Thing.
 */
export function AddNotificationThingToDataset(
  dataset: SolidDataset,
  notificationType: NotificationType
): SolidDataset {
  let notification = createThing({ name: "notification" });
  notification = addUrl(
    notification,
    UtilRdfMap.type,
    NotificationToRdfMap.type
  );
  notification = addBoolean(
    notification,
    NotificationToRdfMap.isProcessed,
    false
  );
  notification = addUrl(
    notification,
    NotificationToRdfMap.notificationType,
    NotificationTypeRdfMap[notificationType]
  );
  notification = addDatetime(
    notification,
    NotificationToRdfMap.createdAt,
    new Date()
  );

  return setThing(dataset, notification);
}

/**
 * Creates the corresponding Solid dataset for the hotel privacy token passed as an argument.
 * RDF properties are taken from {@link privacyTokenToRdfMap}.
 * @returns The Solid dataset containing the hotel privacy token information.
 */
export function CreateHotelPrivacyTokenDataset(
  privacyToken: HotelPrivacyToken
): SolidDataset {
  let newPrivacyToken = CreateCorePrivacyTokenDataset(privacyToken);
  newPrivacyToken = addStringNoLocale(
    newPrivacyToken,
    PrivacyTokenToRdfMap.datasetUrlTarget,
    privacyToken.datasetUrlTarget
  );
  if (privacyToken.guestInbox) {
    newPrivacyToken = addStringNoLocale(
      newPrivacyToken,
      PrivacyTokenToRdfMap.guestInbox,
      privacyToken.guestInbox
    );
  }
  newPrivacyToken = addStringNoLocale(
    newPrivacyToken,
    PrivacyTokenToRdfMap.reservation,
    privacyToken.reservation
  );

  let privacyTokenDataset = createSolidDataset();
  privacyTokenDataset = setThing(privacyTokenDataset, newPrivacyToken);
  return privacyTokenDataset;
}

/**
 * Creates the corresponding Solid dataset for the guest privacy token passed as an argument.
 * RDF properties are taken from {@link privacyTokenToRdfMap}.
 * @returns The Solid dataset containing the guest privacy token information.
 */
export function CreateGuestPrivacyTokenDataset(
  privacyToken: GuestPrivacyToken
): SolidDataset {
  let newPrivacyToken = CreateCorePrivacyTokenDataset(privacyToken);
  newPrivacyToken = addStringNoLocale(
    newPrivacyToken,
    PrivacyTokenToRdfMap.hotelInboxForDeletion,
    privacyToken.hotelInboxForDeletion
  );
  newPrivacyToken = addStringNoLocale(
    newPrivacyToken,
    PrivacyTokenToRdfMap.hotel,
    privacyToken.hotel
  );
  if (privacyToken.reservation) {
    newPrivacyToken = addStringNoLocale(
      newPrivacyToken,
      PrivacyTokenToRdfMap.reservation,
      privacyToken.reservation
    );
  }

  let privacyTokenDataset = createSolidDataset();
  privacyTokenDataset = setThing(privacyTokenDataset, newPrivacyToken);
  return privacyTokenDataset;
}

/**
 * Creates the corresponding Solid Thing definition for the privacy token passed as an argument.
 * RDF properties are taken from {@link privacyTokenToRdfMap}.
 * @returns The Solid Thing containing the common privacy token properties.
 */
function CreateCorePrivacyTokenDataset(privacyToken: PrivacyToken): Thing {
  let newPrivacyToken = createThing({ name: "privacy" });
  newPrivacyToken = addUrl(
    newPrivacyToken,
    UtilRdfMap.type,
    PrivacyTokenToRdfMap.type
  );
  privacyToken.fieldList.forEach((field) => {
    newPrivacyToken = addStringNoLocale(
      newPrivacyToken,
      PrivacyTokenToRdfMap.fieldList,
      field
    );
  });
  newPrivacyToken = addStringNoLocale(
    newPrivacyToken,
    PrivacyTokenToRdfMap.reason,
    privacyToken.reason
  );
  newPrivacyToken = addInteger(
    newPrivacyToken,
    PrivacyTokenToRdfMap.forReservationState,
    privacyToken.forReservationState.valueOf()
  );
  newPrivacyToken = addDatetime(
    newPrivacyToken,
    PrivacyTokenToRdfMap.expiry,
    privacyToken.expiry
  );

  if (privacyToken.urlAtHotel) {
    newPrivacyToken = addStringNoLocale(
      newPrivacyToken,
      PrivacyTokenToRdfMap.url,
      privacyToken.urlAtHotel
    );
  }

  return newPrivacyToken;
}
