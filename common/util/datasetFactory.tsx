import {
  addBoolean,
  addDatetime,
  addInteger,
  addStringNoLocale,
  createSolidDataset,
  createThing,
  setThing,
  Thing,
} from "@inrupt/solid-client";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { reservationFieldToRdfMap } from "../vocabularies/rdf_reservation";
import { SolidDataset } from "@inrupt/solid-client";
import { notificationToRdfMap } from "../vocabularies/rdf_notification";
import { NotificationType } from "../types/NotificationsType";
import { PrivacyToken } from "../types/PrivacyToken";
import { privacyTokenToRdfMap } from "../vocabularies/notification_payloads/rdf_privacy";
import { HotelPrivacyToken } from "../types/HotelPrivacyToken";
import { GuestPrivacyToken } from "../types/GuestPrivacyToken";

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
  notification = addDatetime(
    notification,
    notificationToRdfMap.createdAt,
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
    privacyTokenToRdfMap.datasetUrlTarget,
    privacyToken.datasetUrlTarget
  );
  if (privacyToken.guestInbox) {
    newPrivacyToken = addStringNoLocale(
      newPrivacyToken,
      privacyTokenToRdfMap.guestInbox,
      privacyToken.guestInbox
    );
  }
  newPrivacyToken = addStringNoLocale(
    newPrivacyToken,
    privacyTokenToRdfMap.reservation,
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
    privacyTokenToRdfMap.hotelInboxForDeletion,
    privacyToken.hotelInboxForDeletion
  );
  newPrivacyToken = addStringNoLocale(
    newPrivacyToken,
    privacyTokenToRdfMap.hotel,
    privacyToken.hotel
  );
  if (privacyToken.reservation) {
    newPrivacyToken = addStringNoLocale(
      newPrivacyToken,
      privacyTokenToRdfMap.reservation,
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
  newPrivacyToken = addInteger(
    newPrivacyToken,
    privacyTokenToRdfMap.forReservationState,
    privacyToken.forReservationState.valueOf()
  );
  newPrivacyToken = addDatetime(
    newPrivacyToken,
    privacyTokenToRdfMap.expiry,
    privacyToken.expiry
  );

  if (privacyToken.urlAtHotel) {
    newPrivacyToken = addStringNoLocale(
      newPrivacyToken,
      privacyTokenToRdfMap.url,
      privacyToken.urlAtHotel
    );
  }

  return newPrivacyToken;
}
