import { ReservationState } from "./ReservationState";

export type ReservationRequest = {
  reservationId: string;
  ownerInboxUrl: string | null;
  requestedState: ReservationState;
};
