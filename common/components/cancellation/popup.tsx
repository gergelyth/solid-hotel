import { Dispatch, SetStateAction, useState } from "react";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import {
  Button,
  Container,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

function CancelReservationPopup({
  reservation,
  isPopupShowing,
  setPopupVisibility,
  confirmCancellation,
}: {
  reservation: ReservationAtHotel;
  isPopupShowing: boolean;
  setPopupVisibility: Dispatch<SetStateAction<boolean>>;
  confirmCancellation: (reservationId: string) => void;
}): JSX.Element | null {
  const [isChecked, setChecked] = useState(false);

  return (
    <Dialog
      onClose={() => setPopupVisibility(false)}
      aria-labelledby="popup-title"
      open={isPopupShowing}
    >
      <DialogTitle id="popup-title">Cancel reservation</DialogTitle>
      <Container maxWidth="sm">
        <div>You intend to cancel the following reservation:</div>
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
        <FormControlLabel
          control={
            <Checkbox
              checked={isChecked}
              onChange={(e, newValue) => setChecked(newValue)}
              name="confirmation"
            />
          }
          label="I confirm the cancellation"
        />
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setPopupVisibility(false)}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={"button"}
            startIcon={<DeleteIcon />}
            disabled={!isChecked}
            onClick={() => {
              confirmCancellation(reservation.id);
              setPopupVisibility(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Container>
    </Dialog>
  );
}

export default CancelReservationPopup;
