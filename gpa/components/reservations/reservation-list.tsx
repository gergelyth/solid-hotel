import styles from "../../styles/Home.module.css";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { ReservationState } from "../../types/ReservationState";
import { useUserReservations } from "../../hooks/useUserReservations";
import Link from "next/link";
import { NotEmptyItem } from "../../util/helpers";

function CreateReservationElement(
  reservation: ReservationAtHotel | null
): JSX.Element {
  if (!reservation) {
    return <li>empty</li>;
  }
  return (
    <li key={reservation.id}>
      <Link href={`/reservations/${encodeURIComponent(reservation.id)}`}>
        <div
          className={`${styles.grid} ${styles.card} ${styles.simpleContainer}`}
        >
          <h3>Owner: {reservation.ownerId}</h3>
          <div>Room: {reservation.roomId}</div>
          <div>State: {ReservationState[reservation.state]}</div>
          <div>Check-in date: {reservation.dateFrom.toDateString()}</div>
          <div>Check-out date: {reservation.dateTo.toDateString()}</div>
        </div>
      </Link>
    </li>
  );
}

function ReservationElements(
  reservationFilter: (reservation: ReservationAtHotel) => boolean
): JSX.Element {
  const { items, isLoading, isError } = useUserReservations();

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
        <ul>{items.map((item) => CreateReservationElement(item))}</ul>
      ) : (
        <i>No reservations found</i>
      )}
    </div>
  );
}

function ReservationList({
  reservationFilter,
}: {
  reservationFilter: (reservation: ReservationAtHotel) => boolean;
}): JSX.Element {
  return ReservationElements(reservationFilter);
}

export default ReservationList;
