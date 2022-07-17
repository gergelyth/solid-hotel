/** A vocabulary map defining the RDF properties used for initial pairing request notifications. */
export const initialPairingRequestRdfMap: Record<string, string> = {
  type: "schema:reservationLink",
  guestInboxUrl: "https://schema.org/replyToUrl",
  token: "https://w3id.org/idsa/core/authorizationToken",
};
