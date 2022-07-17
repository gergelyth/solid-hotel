import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";
import SOLIDHOTEL from "../solidhotel-vocab/SOLIDHOTEL.js";

// TODO: fields have to be the same as in ../../apiData.json
/** A vocabulary map defining the RDF properties used for the personal information fields of the guest. */
export const personFieldToRdfMap: Record<string, string> = {
  // TODO: correct firstName from givenName in text
  type: FOAF.Person,
  firstName: FOAF.firstName,
  lastName: FOAF.lastName,
  nationality: "https://schema.org/nationality",
  idDocumentType: SOLIDHOTEL.idDocumentType,
  idDocumentNumber: SOLIDHOTEL.idDocumentNumber,
  idDocumentExpiry: "https://w3id.org/GConsent#hasExpiry",
  email: VCARD.email,
  phone: FOAF.phone,
};
