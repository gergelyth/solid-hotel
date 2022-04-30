import { PrivacyToken } from "./PrivacyToken";

export type GuestPrivacyToken = PrivacyToken & {
  //TODO maybe NamedNode
  hotelInboxForDeletion: string;
  hotel: string;
  //TODO probably NamedNode
  //TODO maybe we need this?
  //   guestInbox: string | undefined;
};
