import { useState } from "react";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import styles from "../../../common/styles/Home.module.css";
import CancelReservationPopup from "./popup";

function CancelReservationButton({
  reservation,
}: {
  reservation: ReservationAtHotel | undefined;
}): JSX.Element | null {
  const [isPopupShowing, setPopupVisibility] = useState(false);

  if (!reservation) {
    return null;
  }

  return (
    <div className={styles.simpleContainer}>
      <button onClick={() => setPopupVisibility(true)}>
        Cancel reservation
      </button>
      <CancelReservationPopup
        reservation={reservation}
        isPopupShowing={isPopupShowing}
        setPopupVisibility={setPopupVisibility}
      />
    </div>
  );
}

export default CancelReservationButton;
