/** A type containing some basic information about the hotel (name, location, address). */
export type HotelDetails = {
  webId: string;
  name: string;
  //TODO this should be NamedNode? because we will use the RDf names for countries
  location: string;
  address: string;
};
