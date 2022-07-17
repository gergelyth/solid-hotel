import SOLIDHOTEL from "../solidhotel-vocab/SOLIDHOTEL.js";

/** A vocabulary map defining the RDF properties used for pairing token operations. */
export const pairingTokenToRdfMap: Record<string, string> = {
  type: SOLIDHOTEL.ReservationLink,
  pairingToken: "https://w3id.org/idsa/core/authorizationToken",
};
