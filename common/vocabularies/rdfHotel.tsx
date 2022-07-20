import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";

/** A vocabulary map defining the RDF properties used for the properties of the hotel. */
export const HotelFieldToRdfMap: Record<string, string> = {
  //We don't need a type here since there are added to the profile of the hotel only and no dataset is created
  name: FOAF.name.value,
  location: VCARD.country_name.value,
  address: VCARD.street_address.value,
};
