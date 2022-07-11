import { ReservationAtHotel } from "./ReservationAtHotel";

/** The type signature of an event handler for when a component representing a reservation is clicked. */
export type ReservationClickHandler = (
  event: React.MouseEvent<HTMLElement>,
  reservation: ReservationAtHotel
) => void;
