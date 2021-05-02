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

function CancelReservationPopup({
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
          justify="center"
          alignItems="center"
          direction="column"
        >
          {/* TODO need grid items everywhere! */}
          <Grid item>
            <Typography>
              You intend to cancel the following reservation:
            </Typography>
          </Grid>
          <Grid item>
            <Paper elevation={6}>
              <Grid
                container
                justify="center"
                alignItems="center"
                direction="column"
              >
                <Box padding={3}>
                  <Typography>
                    <Box textAlign="center">
                      {GetHotelInformation(reservation.hotel)}
                    </Box>
                  </Typography>
                  <Box textAlign="center">
                    <Typography>{GetStayInterval(reservation)}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Typography>
              <Box fontWeight="fontWeightBold" fontStyle="underlined">
                The reservation will be irrevocably lost.
              </Box>
            </Typography>
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

export default CancelReservationPopup;
