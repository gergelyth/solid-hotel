export type PrivacyToken = {
  url: string;
  //TODO maybe NamedNode for WebId?
  hotel: string;
  //webId of the guest if they have a Solid Pod, URL pointing to a dataset in the hotel Pod if they don't
  guest: string;
  //TODO these probably not strings?
  fieldList: string[];
  reason: string;
  expiry: Date;
};
