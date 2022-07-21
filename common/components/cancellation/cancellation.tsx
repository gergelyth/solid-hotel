import { useState } from "react";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { CancelReservationPopup } from "./popup";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { ReservationState } from "../../types/ReservationState";

/**
 * Contains a button and a confirmation popup for cancelling a reservation. The button displays the popup.
 * @returns A component entailing the cancel button and the corresponding popup.
 */
export function CancelReservationButton({
  reservation,
  confirmCancellation,
}: {
  reservation: ReservationAtHotel | undefined;
  confirmCancellation: (reservation: ReservationAtHotel) => void;
}): JSX.Element | null {
  const [isPopupShowing, setPopupVisibility] = useState(false);

  if (!reservation || reservation.state !== ReservationState.CONFIRMED) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Button
        data-testid="show-cancel-popup-button"
        variant="contained"
        color="secondary"
        onClick={() => setPopupVisibility(true)}
      >
        Cancel reservation
      </Button>
      <CancelReservationPopup
        reservation={reservation}
        isPopupShowing={isPopupShowing}
        setPopupVisibility={setPopupVisibility}
        confirmCancellation={confirmCancellation}
      />
    </Container>
  );
}
