import styles from "../../../common/styles/Home.module.css";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ReservationState } from "../../../common/types/ReservationState";
import { useUserReservations } from "../../hooks/useUserReservations";
import { NotEmptyItem } from "../../../common/util/helpers";

export type ReservationClickHandler = (
  event: React.MouseEvent<HTMLElement>,
  reservation: ReservationAtHotel
) => void;

function CreateReservationElement(
  reservation: ReservationAtHotel | null,
  onClickAction: ReservationClickHandler
): JSX.Element {
  if (!reservation) {
    return <li>empty</li>;
  }
  return (
    <li key={reservation.id}>
      <button
        className={`${styles.grid} ${styles.card} ${styles.simpleContainer}`}
        onClick={(event: React.MouseEvent<HTMLElement>) =>
          onClickAction(event, reservation)
        }
      >
        <h3>Owner: {reservation.ownerId}</h3>
        <div>Room: {reservation.roomId}</div>
        <div>State: {ReservationState[reservation.state]}</div>
        <div>Check-in date: {reservation.dateFrom.toDateString()}</div>
        <div>Check-out date: {reservation.dateTo.toDateString()}</div>
      </button>
    </li>
  );
}

function ReservationElements(
  reservationFilter: (reservation: ReservationAtHotel) => boolean,
  onClickAction: ReservationClickHandler
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
        <ul>
          {items.map((item) => CreateReservationElement(item, onClickAction))}
        </ul>
      ) : (
        <i>No reservations found</i>
      )}
    </div>
  );
}

function ReservationList({
  reservationFilter,
  onClickAction,
}: {
  reservationFilter: (reservation: ReservationAtHotel) => boolean;
  onClickAction: ReservationClickHandler;
}): JSX.Element {
  return ReservationElements(reservationFilter, onClickAction);
}

export default ReservationList;
