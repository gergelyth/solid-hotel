import { format, eachDayOfInterval } from "date-fns";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";

/**
 * @returns A string describing how many nights the reservation entails.
 */
export function GetNightCount(reservation: ReservationAtHotel): string {
  const intervalDays = eachDayOfInterval({
    start: reservation.dateFrom,
    end: reservation.dateTo,
  });
  const nightCount = intervalDays.length - 1;
  return `${nightCount} nights`;
}

/**
 * @returns A pretty string describing the interval from the check-in date to the check-out date.
 */
export function GetStayInterval(reservation: ReservationAtHotel): string {
  return `${format(reservation.dateFrom, "MMMM do, yyyy")} - ${format(
    reservation.dateTo,
    "MMMM do, yyyy"
  )}`;
}
