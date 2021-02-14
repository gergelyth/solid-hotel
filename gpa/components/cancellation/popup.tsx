import { Dispatch, SetStateAction } from "react";
import styles from "../../styles/Home.module.css";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { AddCancellationRequest } from "../../util/solid";

function ConfirmCancellation(
  reservationId: string,
  setPopupVisibility: Dispatch<SetStateAction<boolean>>
): void {
  AddCancellationRequest(reservationId);
  // TODO: Set cancelled in pod
  setPopupVisibility(false);
}

function CancelReservationPopup({
  reservation,
  isPopupShowing,
  setPopupVisibility,
}: {
  reservation: ReservationAtHotel;
  isPopupShowing: boolean;
  setPopupVisibility: Dispatch<SetStateAction<boolean>>;
}): JSX.Element | null {
  if (!isPopupShowing) {
    return null;
  }

  return (
    <div className={`${styles.simpleContainer} ${styles.popup}`}>
      <div className={`${styles.simpleContainer} ${styles.popup_inner}`}>
        <div>You intent to cancel the following reservation:</div>
        <div>{reservation.ownerId}</div>
        <div>{reservation.roomId}</div>
        <div>
          {reservation.dateFrom.toDateString()} -
          {reservation.dateTo.toDateString()}
        </div>
        <div>The reservation will be irrevocably lost.</div>
        <div>
          Please confirm that you are sure about executing this cancellation:
        </div>
        <i>Checkbox here</i>
        <div>I confirm the cancellation</div>
        <button onClick={() => setPopupVisibility(false)}>Back</button>
        <button
          onClick={() =>
            ConfirmCancellation(reservation.id, setPopupVisibility)
          }
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default CancelReservationPopup;
