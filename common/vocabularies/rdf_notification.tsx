import { DCTERMS } from "@inrupt/vocab-common-rdf";

/** A vocabulary map defining the RDF properties used for common properties of notifications. */
export const notificationToRdfMap: Record<string, string> = {
  type: "http://www.w3.org/ns/solid/terms#Notification",
  isProcessed: "something:processed",
  notificationType: "something:notificationType",
  createdAt: DCTERMS.created,
};
