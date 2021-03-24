import { Dispatch, SetStateAction, useState } from "react";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ReservationState } from "../../../common/types/ReservationState";
import {
  AddCancellationRequest,
  SetReservationState,
} from "../../../common/util/solid";
import { CancellationsUrl } from "../../../common/consts/solidIdentifiers";
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

function ConfirmCancellation(
  reservationId: string,
  setPopupVisibility: Dispatch<SetStateAction<boolean>>
): void {
  AddCancellationRequest(reservationId, CancellationsUrl);
  SetReservationState(reservationId, ReservationState.CANCELLED);
  // TODO: cancel on the hotel side (which will be done in PMS)
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
            onClick={() =>
              ConfirmCancellation(reservation.id, setPopupVisibility)
            }
          >
            Cancel
          </Button>
        </DialogActions>
      </Container>
    </Dialog>
  );
}

export default CancelReservationPopup;
