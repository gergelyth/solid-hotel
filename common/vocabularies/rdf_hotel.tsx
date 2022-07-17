import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";

/** A vocabulary map defining the RDF properties used for the properties of the hotel. */
export const hotelFieldToRdfMap: Record<string, string> = {
  name: FOAF.name,
  location: VCARD.country_name,
  address: VCARD.street_address,
};
