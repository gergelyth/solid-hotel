import SOLIDHOTEL from "../../solidhotel-vocab/SOLIDHOTEL.js";

/** A vocabulary map defining the RDF properties used for initial pairing request notifications. */
export const InitialPairingRequestRdfMap: Record<string, string> = {
  type: SOLIDHOTEL.ReservationLink,
  guestInboxUrl: "https://schema.org/replyToUrl",
  token: "https://w3id.org/idsa/core/authorizationToken",
};
