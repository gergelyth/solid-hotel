import {
  Typography,
  Dialog,
  DialogTitle,
  Box,
  Grid,
  Paper,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { Dispatch, SetStateAction, useState } from "react";
import { Revalidate } from "../../../common/hooks/useRooms";
import DeleteIcon from "@material-ui/icons/Delete";
import { RoomDefinition } from "../../../common/types/RoomDefinition";
import { DeleteRoom } from "../../util/solidHotelSpecific";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { GetRoomUrlFromRoomId } from "../../../common/util/urlParser";
import { ShowErrorSnackbar } from "../../../common/components/snackbar";
import { ReservationState } from "../../../common/types/ReservationState";
import { ConfirmCancellation } from "../reservations/reservation-element";
import { NotEmptyItem } from "../../../common/util/helpers";

function CancelReservations(reservationsToCancel: ReservationAtHotel[]): void {
  for (const reservationToCancel of reservationsToCancel) {
    ConfirmCancellation(reservationToCancel);
  }
}

/**
 * Returns a dialog which enables the user to confirm their decision to delete the selected room definition.
 * If confirmed, it executes the deletion and cancels all reservations made for this room.
 * If the dialog is closed, no action is carried out.
 * @returns A dialog with the option to delete the room definition (and cancel all reservations) or back out (or null if the dialog is not showing).
 */
export function DeleteRoomPopup({
  room,
  updateRoomLocally,
  reservations,
  isPopupShowing,
  setPopupVisibility,
}: {
  room: RoomDefinition;
  updateRoomLocally: (
    newRoomDefinition: RoomDefinition,
    isDelete: boolean
  ) => void;
  reservations: (ReservationAtHotel | null)[] | undefined;
  isPopupShowing: boolean;
  setPopupVisibility: Dispatch<SetStateAction<boolean>>;
}): JSX.Element | null {
  const [isChecked, setChecked] = useState(false);

  if (!isPopupShowing) {
    return null;
  }

  let roomConfirmedReservations: ReservationAtHotel[] = [];
  if (!room.id) {
    ShowErrorSnackbar(
      "Room ID is null/undefined for delete room popup. The cancellation of reservations can't be executed"
    );
  } else if (reservations) {
    const roomUrl = GetRoomUrlFromRoomId(room.id);
    roomConfirmedReservations = reservations
      .filter(NotEmptyItem)
      .filter(
        (res) =>
          res.state === ReservationState.CONFIRMED && res.room === roomUrl
      );
  }

  return (
    <Dialog onClose={() => setPopupVisibility(false)} open={isPopupShowing}>
      <DialogTitle id="popup-title">Delete room</DialogTitle>
      <Box m={2} p={2}>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Grid item>
            <Typography>Delete the following room?</Typography>
          </Grid>
          <Grid item>
            <Paper elevation={6}>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="column"
              >
                <Box padding={3} textAlign="center">
                  <Typography>{room.name}</Typography>
                  <Typography>
                    {room.description ?? "<Empty description>"}
                  </Typography>
                </Box>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Box fontWeight="fontWeightBold" fontStyle="underlined">
              <Typography>
                Clicking delete will cancel all reservations made for this room!
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Typography>
              There are currently {roomConfirmedReservations.length}{" "}
              reservations made for this room.
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              Please confirm that you are sure about executing this deletion.
            </Typography>
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  data-testid="delete-room-checkbox"
                  checked={isChecked}
                  onChange={(e, newValue) => setChecked(newValue)}
                  name="confirmation"
                />
              }
              label="I confirm the deletion"
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
                data-testid="delete-room-popup-button"
                variant="contained"
                color="primary"
                className={"button"}
                disabled={!isChecked}
                startIcon={<DeleteIcon />}
                onClick={() => {
                  CancelReservations(roomConfirmedReservations);
                  updateRoomLocally(room, true);
                  DeleteRoom(room);
                  Revalidate();
                  setPopupVisibility(false);
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}
