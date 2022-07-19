import SOLIDHOTEL from "../solidhotel-vocab/SOLIDHOTEL.js";
import { ReservationState } from "../types/ReservationState.jsx";

/** A vocabulary map defining the RDF properties used for the reservation type enum. */
export const reservationStateRdfMap: Record<ReservationState, string> = {
  [ReservationState.REQUESTED]: "https://schema.org/ReservationPending",
  [ReservationState.CONFIRMED]: "https://schema.org/ReservationConfirmed",
  [ReservationState.CANCELLED]: "https://schema.org/ReservationCancelled",
  [ReservationState.ACTIVE]: SOLIDHOTEL.ReservationActive,
  [ReservationState.PAST]: SOLIDHOTEL.ReservationPast,
};
