import { ReservationState } from "./ReservationState";

/** The privacy token definition which includes common information required for both on the side of the guest and the hotel. */
export type PrivacyToken = {
  urlAtHotel: string | null;
  fieldList: string[];
  reason: string;
  forReservationState: ReservationState;
  expiry: Date;
};
