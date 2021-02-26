import { FOAF } from "@inrupt/vocab-common-rdf";

// TODO: fields have to be the same as in ../../apiData.json
export const personFieldToRdfMap: Record<string, string> = {
  // TODO: correct firstName from givenName in text
  "First name": FOAF.firstName,
  "Last name": FOAF.familyName,
  Nationality: "schema:nationality",
  "ID document type": "schema:idDocumentType",
  "ID document number": "schema:idDocumentNumber",
  "ID document expiry": "schema:idDocumentExpiry",
  Email: "schema:email",
  "Phone number": "schema:phone_number",
};
