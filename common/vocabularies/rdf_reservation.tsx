import { SCHEMA_INRUPT_EXT } from "@inrupt/vocab-common-rdf";

export const reservationFieldToRdfMap: Record<string, string> = {
  rdfType: SCHEMA_INRUPT_EXT.LodgingReservation,
  // TODO: find something for these
  owner: "schema:owner",
  room: "schema:reservationFor",
  // TODO: find something for these
  state: "schema:state",
  checkinTime: "schema:checkinTime",
  checkoutTime: "schema:checkoutTime",
};
