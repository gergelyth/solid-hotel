// import { SCHEMA_INRUPT_EXT } from "@inrupt/vocab-common-rdf";

/** A vocabulary map defining the RDF properties used for reservations. */
export const reservationFieldToRdfMap: Record<string, string> = {
  // rdfType: SCHEMA_INRUPT_EXT.LodgingReservation,
  rdfType: "schema:lodgingReservation",
  id: "schema:reservationId",
  inbox: "ldp:inbox",
  // TODO: find something for these
  owner: "schema:owner",
  hotel: "schema:reservationAt",
  room: "schema:reservationFor",
  // TODO: find something for these
  state: "schema:state",
  checkinTime: "schema:checkinTime",
  checkoutTime: "schema:checkoutTime",
};
