/** A vocabulary map defining the RDF properties used for reservation change notifications. */
export const reservationStateChangeToRdfMap: Record<string, string> = {
  newState: "https://schema.org/reservationStatus",
  replyInbox: "https://schema.org/replyToUrl",
};
