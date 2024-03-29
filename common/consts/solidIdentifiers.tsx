/**
 * @constant The Solid Pod of the hotel associated with the prototype applications - loaded from the ENV file.
 * @default
 */
export const HotelPod =
  process.env.NEXT_PUBLIC_HOTELPOD ?? "https://testsolidhotel.inrupt.net/";

/** @constant The folder structure in the Solid Pods. */
const ReservationAddress = "reservations/";
const RoomDefinitionAddress = "rooms/";
const BookingInbox = "bookingrequests";
const HotelProfileAddress = "hotelprofiles/";
const DataProtectionProfileAddress = "dataprotection/";
const PrivacyTokens = "privacy/";
const PrivacyTokensInbox = "privacy/inbox/";

/**
 * @constant The WebId of the hotel associated with the prototype applications.
 * @default
 */
export const HotelWebId = HotelPod + "profile/card#me";

/** @constant The folder structure in the Solid Pods. This is used once by the GPA during booking, as that's the only operation tied to the specific hotel. */
export const ReservationsUrl = HotelPod + ReservationAddress;
export const RoomDefinitionsUrl = HotelPod + RoomDefinitionAddress;
export const BookingInboxUrl = HotelPod + BookingInbox;
export const HotelProfilesUrl = HotelPod + HotelProfileAddress;
export const DataProtectionProfilesUrl =
  HotelPod + DataProtectionProfileAddress;
export const PrivacyTokensUrl = HotelPod + PrivacyTokens;
export const PrivacyTokensInboxUrl = HotelPod + PrivacyTokensInbox;
