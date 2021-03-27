import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { useReservations } from "../../hooks/useReservations";
import { NotEmptyItem } from "../../util/helpers";

function CreateReservationElement(
  reservation: ReservationAtHotel | null,
  reservationElement: (item: ReservationAtHotel) => JSX.Element
): JSX.Element {
  if (!reservation) {
    return <li>empty</li>;
  }
  return <li key={reservation.id}>{reservationElement(reservation)}</li>;
}

function ReservationElements(
  reservationsUrl: string | null,
  reservationFilter: (reservation: ReservationAtHotel) => boolean,
  reservationElement: (item: ReservationAtHotel) => JSX.Element
): JSX.Element {
  const { items, isLoading, isError } = useReservations(reservationsUrl);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !items) {
    return <div>Fetching the reservations failed.</div>;
  }

  const filteredReservations = items
    .filter(NotEmptyItem)
    .filter(reservationFilter);
  const isArrayNonEmpty = filteredReservations.length > 0;

  return (
    <div>
      {isArrayNonEmpty ? (
        <ul>
          {items.map((item) =>
            CreateReservationElement(item, reservationElement)
          )}
        </ul>
      ) : (
        <i>No reservations found</i>
      )}
    </div>
  );
}

function ReservationList({
  reservationsUrl,
  reservationFilter,
  reservationElement,
}: {
  reservationsUrl: string | null;
  reservationFilter: (reservation: ReservationAtHotel) => boolean;
  reservationElement: (item: ReservationAtHotel) => JSX.Element;
}): JSX.Element {
  return ReservationElements(
    reservationsUrl,
    reservationFilter,
    reservationElement
  );
}

export default ReservationList;
