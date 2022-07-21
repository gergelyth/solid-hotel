import { useState } from "react";
import { RoomDefinition } from "../../../common/types/RoomDefinition";
import { Grid, Box, Typography, Button } from "@material-ui/core";
import HotelIcon from "@material-ui/icons/Hotel";
import DeleteIcon from "@material-ui/icons/Delete";
import { DeleteRoomPopup } from "./delete-room-popup";
import { EditRoomPopup } from "./edit-room-popup";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";

/**
 * Displays an element for a specific room containing the room definition information as well an Edit and Delete button.
 * The buttons trigger a popup enabling the corresponding actions.
 * @returns The element for a specific room definition - also logically contains the Edit and Delete popup dialogs.
 */
export function EditableRoomElement({
  room,
  updateRoomLocally,
  reservations,
}: {
  room: RoomDefinition;
  updateRoomLocally: (
    newRoomDefinition: RoomDefinition,
    isDelete: boolean
  ) => void;
  reservations: (ReservationAtHotel | null)[] | undefined;
}): JSX.Element {
  const [isEditPopupShowing, setEditPopupVisibility] = useState(false);
  const [isDeletePopupShowing, setDeletePopupVisibility] = useState(false);
  return (
    <Grid
      container
      item
      spacing={3}
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={2}>
        <Box fontSize={60}>
          <HotelIcon fontSize="inherit" />
        </Box>
      </Grid>
      <Grid container item xs={6}>
        <Grid container item direction="row" spacing={3}>
          <Grid item>
            <Box fontWeight="fontWeightBold">
              <Typography variant="body2">Room:</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Typography variant="body2">{room.name}</Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Box fontWeight="fontWeightBold">
            <Typography variant="body2">Description:</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Typography variant="body2">
            {room.description ?? "<Empty description>"}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={2}>
        <Button
          data-testid="edit-button"
          variant="contained"
          color="primary"
          onClick={() => setEditPopupVisibility(true)}
        >
          Edit
        </Button>
      </Grid>
      <Grid item xs={2}>
        <Button
          data-testid="delete-button"
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
        reservations={reservations}
        isPopupShowing={isDeletePopupShowing}
        setPopupVisibility={setDeletePopupVisibility}
      />
    </Grid>
  );
}
