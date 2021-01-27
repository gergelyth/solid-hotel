import { SCHEMA_INRUPT_EXT } from "@inrupt/vocab-common-rdf";

export const fieldToRdfMap: Record<string, string> = {
  rdfType: SCHEMA_INRUPT_EXT.LodgingReservation,
  checkinTime: SCHEMA_INRUPT_EXT.checkinTime,
  checkoutTime: SCHEMA_INRUPT_EXT.checkoutTime,
  reservationFor: SCHEMA_INRUPT_EXT.reservationFor,
};
