import { Dispatch, SetStateAction, useState } from "react";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import {
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogActions,
  Typography,
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
      <Grid
        container
        spacing={2}
        justify="center"
        alignItems="center"
        direction="column"
      >
        {/* TODO need grid items everywhere! */}
        <Typography>You intend to cancel the following reservation:</Typography>
        <Typography>{reservation.ownerId}</Typography>
        <Typography>{reservation.roomId}</Typography>
        <Typography>
          {reservation.dateFrom.toDateString()} -
          {reservation.dateTo.toDateString()}
        </Typography>
        <Typography>The reservation will be irrevocably lost.</Typography>
        <Typography>
          Please confirm that you are sure about executing this cancellation:
        </Typography>
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
      </Grid>
    </Dialog>
  );
}

export default CancelReservationPopup;
