import { Dispatch, SetStateAction, useState } from "react";
import { Revalidate } from "../../../common/hooks/useRooms";
import { RoomDefinition } from "../../../common/types/RoomDefinition";
import { CreateOrUpdateRoom } from "../../util/solidHotelSpecific";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Box,
  Grid,
} from "@material-ui/core";

/**
 * Returns a dialog which enables the user to edit the room definition.
 * If confirmed, it executes the edit and the change should be seen immediately as we update the local SWR cache with the new values.
 * If the dialog is closed, no action is carried out.
 * @returns A dialog with the option to edit the room definition or back out (or null if the dialog is not showing).
 */
function EditRoomPopup({
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
  const [currentRoomName, setRoomName] = useState(room.name ?? "");
  const [currentRoomDescription, setRoomDescription] = useState(
    room.description ?? ""
  );
  if (!isPopupShowing) {
    return null;
  }

  //TODO same form as edit field popup just with diferent content
  return (
    <Dialog
      onClose={() => setPopupVisibility(false)}
      aria-labelledby="popup-title"
      open={isPopupShowing}
    >
      <DialogTitle id="popup-title">Edit room</DialogTitle>
      <Box m={2} p={2}>
        <Grid
          container
          spacing={2}
          justify="center"
          alignItems="center"
          direction="column"
        >
          <Grid item>
            <TextField
              required
              id="nameInput"
              label="Name"
              variant="outlined"
              value={currentRoomName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRoomName(e.target.value)
              }
            />
          </Grid>
          <Grid item>
            <TextField
              id="descriptionInput"
              label="Description"
              variant="outlined"
              multiline
              value={currentRoomDescription}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRoomDescription(e.target.value)
              }
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
                onClick={() => {
                  const newRoom = {
                    id: null,
                    name: currentRoomName,
                    description:
                      currentRoomDescription === ""
                        ? undefined
                        : currentRoomDescription,
                  };
                  updateRoomLocally(newRoom, false);
                  CreateOrUpdateRoom(newRoom);
                  Revalidate();
                  setPopupVisibility(false);
                }}
              >
                Save
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}

export default EditRoomPopup;
