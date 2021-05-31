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
import { DeleteRoom } from "../../../common/util/solidhoteladmin";

function DeleteRoomPopup({
  room,
  updateRoomLocally,
  isPopupShowing,
  setPopupVisibility,
}: {
  room: RoomDefinition;
  updateRoomLocally: (
    newRoomDefinition: RoomDefinition,
    isDelete: boolean
  ) => void;
  isPopupShowing: boolean;
  setPopupVisibility: Dispatch<SetStateAction<boolean>>;
}): JSX.Element | null {
  const [isChecked, setChecked] = useState(false);

  if (!isPopupShowing) {
    return null;
  }

  //TODO the same logic as delete field popup just with different text
  return (
    <Dialog onClose={() => setPopupVisibility(false)} open={isPopupShowing}>
      <DialogTitle id="popup-title">Delete room</DialogTitle>
      <Box m={2} p={2}>
        <Grid
          container
          spacing={2}
          justify="center"
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
                justify="center"
                alignItems="center"
                direction="column"
              >
                <Box padding={3}>
                  <Typography>
                    <Box textAlign="center">{room.name}</Box>
                  </Typography>
                  <Typography>
                    <Box textAlign="center">
                      {room.description ?? "<Empty description>"}
                    </Box>
                  </Typography>
                </Box>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Typography>
              <Box fontWeight="fontWeightBold" fontStyle="underlined">
                Clicking delete will cancel all reservations made for this room!
              </Box>
            </Typography>
          </Grid>
          <Grid item>
            {
              //TODO get reservation count
            }
            <Typography>
              There are currently {} reservations made for this room.
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
                variant="contained"
                color="primary"
                className={"button"}
                disabled={!isChecked}
                startIcon={<DeleteIcon />}
                onClick={() => {
                  // TODO: deleted room doesnt disappear immediately locally!
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

export default DeleteRoomPopup;
