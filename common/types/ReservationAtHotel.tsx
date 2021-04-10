import { ReservationState } from "./ReservationState";

export type ReservationAtHotel = {
  id: string;
  //TODO ownerId should be webId most likely - this is the internal ID I guess
  ownerId: number;
  //TODO maybe NamedNode for WebId?
  hotel: string;
  //TODO roomId should be room webId
  roomId: number;
  state: ReservationState;
  dateFrom: Date;
  dateTo: Date;
};
