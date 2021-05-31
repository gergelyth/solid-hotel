import { Dispatch, SetStateAction, useState } from "react";
import { Revalidate } from "../../../common/hooks/useRooms";
import { RoomDefinition } from "../../../common/types/RoomDefinition";
import { CreateOrUpdateRoom } from "../../../common/util/solidhoteladmin";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
} from "@material-ui/core";

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

      <TextField
        id="descriptionInput"
        label="Description"
        variant="outlined"
        value={currentRoomDescription}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setRoomDescription(e.target.value)
        }
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
          onClick={() => {
            const newRoom = {
              id: room.id,
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
    </Dialog>
  );
}

export default EditRoomPopup;
