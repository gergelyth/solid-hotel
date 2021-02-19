import { FOAF } from "@inrupt/vocab-common-rdf";

export const personFieldToRdfMap: Record<string, string> = {
  // TODO: correct firstName from givenName in text
  firstName: FOAF.firstName,
  lastName: FOAF.familyName,
  nationality: "schema:nationality",
  idDocumentType: "schema:idDocumentType",
  idDocumentNumber: "schema:idDocumentNumber",
  idDocumentExpiry: "schema:idDocumentExpiry",
  email: "schema:email",
  phoneNumber: "schema:phone_number",
};
