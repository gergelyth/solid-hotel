import { PrivacyToken } from "./PrivacyToken";

export type HotelPrivacyToken = PrivacyToken & {
  //TODO maybe NamedNode
  datasetUrlTarget: string;
  //webId of the guest if they have a Solid Pod, URL pointing to a dataset in the hotel Pod if they don't
  guest: string;
  //TODO probably NamedNode
  //it can be undefined, because for data protection privacy tokens we won't need the inbox any longer
  guestInbox: string | undefined;
  //TODO probably NamedNode url
  reservation: string;
};
