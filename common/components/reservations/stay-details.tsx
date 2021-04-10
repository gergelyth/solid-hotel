import { format, eachDayOfInterval } from "date-fns";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";

export function GetNightCount(reservation: ReservationAtHotel): string {
  const intervalDays = eachDayOfInterval({
    start: reservation.dateFrom,
    end: reservation.dateTo,
  });
  const nightCount = intervalDays.length - 1;
  return `${nightCount} nights`;
}

export function GetStayInterval(reservation: ReservationAtHotel): string {
  return `${format(reservation.dateFrom, "MMMM do, yyyy")} - ${format(
    reservation.dateTo,
    "MMMM do, yyyy"
  )}`;
}
