import { ReservationState } from "./ReservationState";

export type ReservationAtHotel = {
  id: string;
  ownerId: string;
  roomId: string;
  state: ReservationState;
  dateFrom: string;
  dateTo: string;
};
