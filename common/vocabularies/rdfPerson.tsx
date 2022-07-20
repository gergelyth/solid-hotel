import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";
import SOLIDHOTEL from "../solidhotel-vocab/SOLIDHOTEL.js";

// TODO: fields have to be the same as in ../../apiData.json
/** A vocabulary map defining the RDF properties used for the personal information fields of the guest. */
export const PersonFieldToRdfMap: Record<string, string> = {
  type: FOAF.Person.value,
  firstName: FOAF.firstName.value,
  lastName: FOAF.lastName.value,
  nationality: "https://schema.org/nationality",
  idDocumentType: SOLIDHOTEL.idDocumentType,
  idDocumentNumber: SOLIDHOTEL.idDocumentNumber,
  idDocumentExpiry: "https://w3id.org/GConsent#hasExpiry",
  email: VCARD.email.value,
  phone: FOAF.phone.value,
};
