import { FOAF } from "@inrupt/vocab-common-rdf";

// TODO: fields have to be the same as in ../../apiData.json
export const personFieldToRdfMap: Record<string, string> = {
  // TODO: correct firstName from givenName in text
  firstName: "foaf:firstName",
  lastName: "foaf:familyName",
  nationality: "schema:nationality",
  idDocumentType: "schema:idDocumentType",
  idDocumentNumber: "schema:idDocumentNumber",
  idDocumentExpiry: "schema:idDocumentExpiry",
  email: "schema:email",
  phone: "schema:phone_number",
};
