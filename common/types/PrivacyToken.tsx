import { ReservationState } from "./ReservationState";

export type PrivacyToken = {
  urlAtHotel: string | null;
  //TODO these probably not strings?
  fieldList: string[];
  reason: string;
  forReservationState: ReservationState;
  expiry: Date;
};
