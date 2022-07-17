/** A vocabulary map defining the RDF properties used for reservation change notifications. */
export const reservationStateChangeToRdfMap: Record<string, string> = {
  //TODO all should be descendants of solid Notification
  type: "schema:reservationStateChange",
  newState: "https://schema.org/reservationStatus",
  replyInbox: "https://schema.org/replyToUrl",
};
