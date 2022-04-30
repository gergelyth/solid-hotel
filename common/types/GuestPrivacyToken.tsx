import { PrivacyToken } from "./PrivacyToken";

export type GuestPrivacyToken = PrivacyToken & {
  //TODO maybe NamedNode
  hotelInboxForDeletion: string;
  //TODO maybe NamedNode
  hotel: string;
  urlAtGuest: string | undefined;
};
