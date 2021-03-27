import { ReservationAtHotel } from "./ReservationAtHotel";

export type ReservationClickHandler = (
  event: React.MouseEvent<HTMLElement>,
  reservation: ReservationAtHotel
) => void;
