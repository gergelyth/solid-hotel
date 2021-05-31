import { useState } from "react";
import { RoomDefinition } from "../../../common/types/RoomDefinition";
import { Grid, Box, Typography, Button } from "@material-ui/core";
import HotelIcon from "@material-ui/icons/Hotel";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteRoomPopup from "./delete-room-popup";
import EditRoomPopup from "./edit-room-popup";

//TODO same logic as EditableField
function EditableRoomElement({
  room,
  key,
  updateRoomLocally,
}: {
  room: RoomDefinition;
  key: string;
  updateRoomLocally: (
    newRoomDefinition: RoomDefinition,
    isDelete: boolean
  ) => void;
}): JSX.Element {
  const [isEditPopupShowing, setEditPopupVisibility] = useState(false);
  const [isDeletePopupShowing, setDeletePopupVisibility] = useState(false);
  return (
    <Grid
      container
      item
      key={key}
      spacing={2}
      justify="center"
      alignItems="center"
    >
      <Grid item xs={1}>
        <Box fontSize={40}>
          <HotelIcon fontSize="inherit" />
        </Box>
      </Grid>
      <Grid item xs={7}>
        <Grid container direction="row" spacing={1}>
          <Grid item>
            <Typography variant="body2">
              <Box fontWeight="fontWeightBold">Room:</Box>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">{room.name}</Typography>
          </Grid>
        </Grid>
        <Typography variant="body2">
          <Box fontWeight="fontWeightBold">Description:</Box>
          {room.description ?? "<Empty description>"}
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setEditPopupVisibility(true)}
        >
          Edit
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DeleteIcon />}
          onClick={() => setDeletePopupVisibility(true)}
        >
          Delete
        </Button>
      </Grid>
      <EditRoomPopup
        room={room}
        updateRoomLocally={updateRoomLocally}
        isPopupShowing={isEditPopupShowing}
        setPopupVisibility={setEditPopupVisibility}
      />
      <DeleteRoomPopup
        room={room}
        updateRoomLocally={updateRoomLocally}
        isPopupShowing={isDeletePopupShowing}
        setPopupVisibility={setDeletePopupVisibility}
      />
    </Grid>
  );
}

export default EditableRoomElement;
