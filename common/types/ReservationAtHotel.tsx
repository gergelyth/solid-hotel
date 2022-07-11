import { ReservationState } from "./ReservationState";

/** The main reservation object containing required information for the lifecycle of a reservation. */
export type ReservationAtHotel = {
  id: string | null;
  //TODO maybe NamedNode
  inbox: string | null;
  //webId of the guest if they have a Solid Pod, URL pointing to a dataset in the hotel Pod if they don't
  owner: string;
  //TODO maybe NamedNode for WebId?
  hotel: string;
  room: string;
  state: ReservationState;
  dateFrom: Date;
  dateTo: Date;
};
