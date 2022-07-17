import { VOID } from "@inrupt/vocab-common-rdf";

/** A vocabulary map defining the RDF properties used for privacy tokens. */
export const privacyTokenToRdfMap: Record<string, string> = {
  type: "schema:privacyToken",
  hotelInboxForDeletion: "https://schema.org/replyToUrl",
  datasetUrlTarget: "schema:targetDataset",
  hotel: "schema:forHotel",
  guestInbox: "https://schema.org/replyToUrl",
  reservation: "schema:forReservation",
  fieldList: "schema:targetFields",
  reason: "http://purl.org/goodrelations/v1#description",
  forReservationState: "https://schema.org/reservationStatus",
  expiry: "https://w3id.org/GConsent#hasExpiry",
  url: VOID.uriLookupEndpoint,
};
