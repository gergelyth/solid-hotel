import { TriggerRefetch, useRooms } from "../../../common/hooks/useRooms";
import {
  ReservationsUrl,
  RoomDefinitionsUrl,
} from "../../../common/consts/solidIdentifiers";
import { RoomDefinition } from "../../../common/types/RoomDefinition";
import { EditableRoomElement } from "./editable-room";
import { useState } from "react";
import { EditRoomPopup } from "./edit-room-popup";
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core";
import { ErrorComponent } from "../../../common/components/error-component";
import { useReservations } from "../../../common/hooks/useReservations";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";

/**
 * Defines the function how to create an {@link EditableRoomElement} for a specific room definition.
 * @returns The room element to show in the room list.
 */
function CreateRoomElement(
  room: RoomDefinition | null,
  updateList: (newRoom: RoomDefinition, isDelete: boolean) => void,
  reservations: (ReservationAtHotel | null)[] | undefined
): JSX.Element {
  if (!room?.id) {
    return <Typography>Room element empty</Typography>;
  }
  return (
    <EditableRoomElement
      room={room}
      key={room.id}
      updateRoomLocally={updateList}
      reservations={reservations}
    />
  );
}

/**
 * Fetches the room definition currently defined in the hotel Solid Pod via {@link useRooms}.
 * Displays these definition in a list creating a {@link EditableRoomElement} for each of them.
 * Also includes a Create room button for creating new room definitions.
 * Defines the actions to perform when a room is created/edited/deleted.
 * @returns A component containing all room definitions (or a text component informing the user that no such items exist) and a Create Room button. Also logically contains the edit room popup dialog.
 */
export function RoomList(): JSX.Element {
  const [isCreatePopupShowing, setCreatePopupVisibility] = useState(false);

  const { items, isLoading, isError } = useRooms(RoomDefinitionsUrl);
  const { items: reservations } = useReservations(ReservationsUrl);

  function UpsertRoom(newRoom: RoomDefinition): void {
    const existingRoom = items?.find((room) => room?.id === newRoom.id);
    if (existingRoom) {
      existingRoom.name = newRoom.name;
      existingRoom.description = newRoom.description;
    } else {
      items?.push(newRoom);
    }
  }

  function UpdateList(newRoom: RoomDefinition, isDelete: boolean): void {
    if (!items) {
      return;
    }

    if (isDelete) {
      items.forEach((item, index) => {
        if (item?.id === newRoom.id) items.splice(index, 1);
      });
    } else {
      UpsertRoom(newRoom);
    }

    TriggerRefetch(items);
  }

  if (isLoading) {
    return <CircularProgress />;
  }
  if (isError || !items) {
    return <ErrorComponent />;
  }

  const isArrayNonEmpty =
    items.length > 0 && items.some((item) => item !== null);

  return (
    <Grid
      container
      spacing={5}
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        {isArrayNonEmpty ? (
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            direction="column"
          >
            {items.map((item) =>
              CreateRoomElement(item, UpdateList, reservations)
            )}
          </Grid>
        ) : (
          <Typography>No rooms found.</Typography>
        )}
      </Grid>

      <Grid item>
        <Button
          data-testid="create-room-button"
          variant="contained"
          color="primary"
          onClick={() => setCreatePopupVisibility(true)}
        >
          Create room
        </Button>
      </Grid>

      <EditRoomPopup
        room={{} as RoomDefinition}
        updateRoomLocally={UpdateList}
        isPopupShowing={isCreatePopupShowing}
        setPopupVisibility={setCreatePopupVisibility}
      />
    </Grid>
  );
}
