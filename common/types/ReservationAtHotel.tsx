import { ReservationState } from "./ReservationState";

/** The main reservation object containing required information for the lifecycle of a reservation. */
export type ReservationAtHotel = {
  id: string | null;
  inbox: string | null;
  //WebId of the guest if they have a Solid Pod, URL pointing to a dataset in the hotel Pod if they don't
  owner: string;
  hotel: string;
  room: string;
  state: ReservationState;
  dateFrom: Date;
  dateTo: Date;
};
