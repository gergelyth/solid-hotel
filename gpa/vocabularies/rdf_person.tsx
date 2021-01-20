import { FOAF } from "@inrupt/vocab-common-rdf";

export const fieldToRdfMap: Record<string, string> = {
  // TODO: correct firstName from givenName in text
  firstName: FOAF.firstName,
  lastName: FOAF.familyName,
  email: FOAF.mbox,
};
