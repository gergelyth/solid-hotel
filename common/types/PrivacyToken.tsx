import { ReservationState } from "./ReservationState";

export type PrivacyToken = {
  url: string | null;
  //TODO maybe NamedNode
  hotelInboxForDeletion: string;
  //it doesn't matter that we expose this URL to the outside, because it doesn't contain any sensitive information
  datasetUrlTarget: string | undefined;
  //TODO maybe NamedNode for WebId?
  hotel: string;
  //webId of the guest if they have a Solid Pod, URL pointing to a dataset in the hotel Pod if they don't
  guest: string;
  //TODO these probably not strings?
  fieldList: string[];
  reason: string;
  forReservationState: ReservationState;
  expiry: Date;
};
