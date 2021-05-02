// import { SCHEMA_INRUPT_EXT } from "@inrupt/vocab-common-rdf";

export const reservationFieldToRdfMap: Record<string, string> = {
  // rdfType: SCHEMA_INRUPT_EXT.LodgingReservation,
  rdfType: "schema:lodgingReservation",
  // TODO: find something for these
  owner: "schema:owner",
  hotel: "schema:reservationAt",
  room: "schema:reservationFor",
  // TODO: find something for these
  state: "schema:state",
  checkinTime: "schema:checkinTime",
  checkoutTime: "schema:checkoutTime",
};
