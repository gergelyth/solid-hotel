import { PrivacyToken } from "./PrivacyToken";

/** A privacy token extension used on the side of the guest to include some further information about the hotel. */
export type GuestPrivacyToken = PrivacyToken & {
  //TODO maybe NamedNode
  hotelInboxForDeletion: string;
  //TODO maybe NamedNode
  hotel: string;
  urlAtGuest: string | undefined;
  //TODO probably NamedNode url
  reservation: string | undefined;
};
