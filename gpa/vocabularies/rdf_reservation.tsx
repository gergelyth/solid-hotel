import { SCHEMA_INRUPT_EXT } from "@inrupt/vocab-common-rdf";

export const fieldToRdfMap: Record<string, string> = {
  rdfType: SCHEMA_INRUPT_EXT.LodgingReservation,
  // TODO: find something for these
  owner: "schema:owner",
  room: SCHEMA_INRUPT_EXT.reservationFor,
  // TODO: find something for these
  state: "schema:state",
  checkinTime: SCHEMA_INRUPT_EXT.checkinTime,
  checkoutTime: SCHEMA_INRUPT_EXT.checkoutTime,
};
