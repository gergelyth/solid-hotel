import { ReservationState } from "./ReservationState";

export type ReservationAtHotel = {
  id: string;
  ownerId: number;
  roomId: number;
  state: ReservationState;
  dateFrom: Date;
  dateTo: Date;
};
