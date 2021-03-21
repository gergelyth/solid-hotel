import styles from "../../../common/styles/Home.module.css";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ReservationState } from "../../../common/types/ReservationState";
import { ReservationClickHandler } from "../../../common/types/ReservationClickHandler";

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

export default CreateReservationElement;
