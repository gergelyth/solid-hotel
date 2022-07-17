import { DCTERMS } from "@inrupt/vocab-common-rdf";
import SOLIDHOTEL from "../solidhotel-vocab/SOLIDHOTEL.js";

/** A vocabulary map defining the RDF properties used for common properties of notifications. */
export const notificationToRdfMap: Record<string, string> = {
  type: "http://www.w3.org/ns/solid/terms#Notification",
  isProcessed: SOLIDHOTEL.isProcessed,
  notificationType: SOLIDHOTEL.notificationType,
  createdAt: DCTERMS.created.value,
};
