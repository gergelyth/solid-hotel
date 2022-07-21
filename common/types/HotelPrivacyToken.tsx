import { PrivacyToken } from "./PrivacyToken";

/** A privacy token extension used on the side of the hotel to include some further information required for processing. */
export type HotelPrivacyToken = PrivacyToken & {
  datasetUrlTarget: string;
  //It can be undefined, because for data protection privacy tokens we won't need the inbox any longer
  guestInbox: string | undefined;
  reservation: string;
};
