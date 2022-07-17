import { VOID } from "@inrupt/vocab-common-rdf";
import SOLIDHOTEL from "../../solidhotel-vocab/SOLIDHOTEL.js";

/** A vocabulary map defining the RDF properties used for privacy tokens. */
export const privacyTokenToRdfMap: Record<string, string> = {
  type: SOLIDHOTEL.PrivacyToken,
  hotelInboxForDeletion: "https://schema.org/replyToUrl",
  datasetUrlTarget: SOLIDHOTEL.targetDataset,
  hotel: SOLIDHOTEL.forHotel,
  guestInbox: "https://schema.org/replyToUrl",
  reservation: SOLIDHOTEL.forReservation,
  fieldList: SOLIDHOTEL.targetFields,
  reason: "http://purl.org/goodrelations/v1#description",
  forReservationState: "https://schema.org/reservationStatus",
  expiry: "https://w3id.org/GConsent#hasExpiry",
  url: VOID.uriLookupEndpoint,
};
