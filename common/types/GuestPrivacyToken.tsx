import { PrivacyToken } from "./PrivacyToken";

/** A privacy token extension used on the side of the guest to include some further information about the hotel. */
export type GuestPrivacyToken = PrivacyToken & {
  hotelInboxForDeletion: string;
  hotel: string;
  urlAtGuest: string | undefined;
  reservation: string | undefined;
};
