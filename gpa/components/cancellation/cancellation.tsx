import { useState } from "react";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import CancelReservationPopup from "./popup";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";

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
      />
    </Container>
  );
}

export default CancelReservationButton;
