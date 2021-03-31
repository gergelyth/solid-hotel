import {
  Typography,
  Dialog,
  DialogTitle,
  Container,
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
    <Dialog
      onClose={() => setPopupVisibility(false)}
      aria-labelledby="popup-title"
      open={isPopupShowing}
    >
      <DialogTitle id="popup-title">Delete field</DialogTitle>
      <Container maxWidth="sm">
        <Typography>Delete the following room?</Typography>
        <Typography>
          <strong>{room.name}</strong>
        </Typography>
        <Typography>
          <strong>
            Clicking delete will cancel all reservations made for this room!
          </strong>
        </Typography>
        {/* TODO get reservation count */}
        <Typography>
          There are currently {} reservations made for this room.
        </Typography>
        <Typography>
          Please confirm that you are sure about executing this deletion.
        </Typography>
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
          label="I confirm the deletion"
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
      </Container>
    </Dialog>
  );
}

export default DeleteRoomPopup;
