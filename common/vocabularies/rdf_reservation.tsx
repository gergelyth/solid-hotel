/** A vocabulary map defining the RDF properties used for reservations. */
export const reservationFieldToRdfMap: Record<string, string> = {
  rdfType: "https://schema.org/LodgingReservation",
  id: "https://schema.org/reservationId",
  inbox: "https://schema.org/replyToUrl",
  owner: "http://purl.org/vocab/frbr/core#owner",
  hotel: "http://purl.org/acco/ns#partOf",
  room: "https://schema.org/reservationFor",
  state: "https://schema.org/reservationStatus",
  checkinTime: "https://schema.org/checkinTime",
  checkoutTime: "https://schema.org/checkoutTime",
};
