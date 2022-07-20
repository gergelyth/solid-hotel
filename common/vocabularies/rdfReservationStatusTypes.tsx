import SOLIDHOTEL from "../solidhotel-vocab/SOLIDHOTEL.js";
import { ReservationState } from "../types/ReservationState";
import { ReverseRecord } from "../util/helpers";

/** A vocabulary map defining the RDF properties used for the reservation type enum. */
export const ReservationStateRdfMap: Record<ReservationState, string> = {
  [ReservationState.REQUESTED]: "https://schema.org/ReservationPending",
  [ReservationState.CONFIRMED]: "https://schema.org/ReservationConfirmed",
  [ReservationState.CANCELLED]: "https://schema.org/ReservationCancelled",
  [ReservationState.ACTIVE]: SOLIDHOTEL.ReservationActive,
  [ReservationState.PAST]: SOLIDHOTEL.ReservationPast,
};

/** A vocabulary map defining a reverse mapping so we can look up RDF properties and map them to the reservation state type. */
export const ReverseReservationStateRdfMap = ReverseRecord(
  ReservationStateRdfMap
);
