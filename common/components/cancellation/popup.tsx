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
  Box,
  Paper,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { GetHotelInformation } from "../reservations/hotel-details";
import { GetStayInterval } from "../reservations/stay-details";

/**
 * Returns a dialog which compells the user to confirm their decision to cancel the reservation.
 * If confirmed, executes the cancellation operation.
 * If the dialog is closed, no action is carried out.
 * @returns A dialog with some information about the reservation and the option to cancel the reservation or back out.
 */
export function CancelReservationPopup({
  reservation,
  isPopupShowing,
  setPopupVisibility,
  confirmCancellation,
}: {
  reservation: ReservationAtHotel;
  isPopupShowing: boolean;
  setPopupVisibility: Dispatch<SetStateAction<boolean>>;
  confirmCancellation: (reservation: ReservationAtHotel) => void;
}): JSX.Element | null {
  const [isChecked, setChecked] = useState(false);

  return (
    <Dialog onClose={() => setPopupVisibility(false)} open={isPopupShowing}>
      <DialogTitle id="popup-title">Cancel reservation</DialogTitle>
      <Box m={2} p={2}>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Grid item>
            <Typography>
              You intend to cancel the following reservation:
            </Typography>
          </Grid>
          <Grid item>
            <Paper elevation={6}>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="column"
              >
                <Grid item>
                  <Box padding={3} textAlign="center">
                    <Typography>
                      {GetHotelInformation(reservation.hotel)}
                    </Typography>
                    <Typography>{GetStayInterval(reservation)}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Box fontWeight="fontWeightBold" fontStyle="underlined">
              <Typography>The reservation will be irrevocably lost.</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Typography>
              Please confirm that you are sure about executing this
              cancellation:
            </Typography>
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  data-testid="cancel-reservation-checkbox"
                  checked={isChecked}
                  onChange={(e, newValue) => setChecked(newValue)}
                  name="confirmation"
                />
              }
              label="I confirm the cancellation"
            />
          </Grid>
          <Grid item>
            <DialogActions>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setPopupVisibility(false)}
              >
                Back
              </Button>
              <Button
                data-testid="cancel-reservation-button"
                variant="contained"
                color="primary"
                className={"button"}
                startIcon={<DeleteIcon />}
                disabled={!isChecked}
                onClick={() => {
                  confirmCancellation(reservation);
                  setPopupVisibility(false);
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}
