import { useState } from "react";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import CancelReservationPopup from "./popup";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";

function CancelReservationButton({
  reservation,
  confirmCancellation,
}: {
  reservation: ReservationAtHotel | undefined;
  confirmCancellation: (reservationId: string) => void;
}): JSX.Element | null {
  const [isPopupShowing, setPopupVisibility] = useState(false);

  //TODO delete this and disable the button isntead
  if (!reservation) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Button
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

export default CancelReservationButton;
