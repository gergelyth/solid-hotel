/**
 * @constant The Solid Pod of the hotel associated with the prototype applications.
 * @default
 */
export const HotelPod = "https://solidhotel.inrupt.net/";
/**
 * @constant The WebId of the hotel associated with the prototype applications.
 * @default
 */
export const HotelWebId = "https://solidhotel.inrupt.net/profile/card#me";

/** @constant The folder structure in the Solid Pods. */
const ReservationAddress = "reservations/";
const RoomDefinitionAddress = "rooms/";
const BookingInbox = "bookingrequests";
const HotelProfileAddress = "hotelprofiles/";
const DataProtectionProfileAddress = "dataprotection/";
const PrivacyTokens = "privacy/";
const PrivacyTokensInbox = "privacy/inbox/";

/** @constant The folder structure in the Solid Pods. */
export const ReservationsUrl = HotelPod + ReservationAddress;
export const RoomDefinitionsUrl = HotelPod + RoomDefinitionAddress;
export const BookingInboxUrl = HotelPod + BookingInbox;
export const HotelProfilesUrl = HotelPod + HotelProfileAddress;
export const DataProtectionProfilesUrl =
  HotelPod + DataProtectionProfileAddress;
export const PrivacyTokensUrl = HotelPod + PrivacyTokens;
export const PrivacyTokensInboxUrl = HotelPod + PrivacyTokensInbox;
