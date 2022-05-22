import { TriggerRefetch, useRooms } from "../../../common/hooks/useRooms";
import { RoomDefinitionsUrl } from "../../../common/consts/solidIdentifiers";
import { RoomDefinition } from "../../../common/types/RoomDefinition";
import EditableRoomElement from "./editable-room";
import { useState } from "react";
import EditRoomPopup from "./edit-room-popup";
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core";
import ErrorComponent from "../../../common/components/error-component";

function CreateRoomElement(
  room: RoomDefinition | null,
  updateList: (newRoom: RoomDefinition, isDelete: boolean) => void
): JSX.Element {
  if (!room?.id) {
    return <Typography>Room element empty</Typography>;
  }
  return (
    <EditableRoomElement
      room={room}
      key={room.id}
      updateRoomLocally={updateList}
    />
  );
}

function RoomElements(): JSX.Element {
  const [isCreatePopupShowing, setCreatePopupVisibility] = useState(false);

  const { items, isLoading, isError } = useRooms(RoomDefinitionsUrl);

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
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        {isArrayNonEmpty ? (
          <Grid
            container
            spacing={2}
            justify="center"
            alignItems="center"
            direction="column"
          >
            {items.map((item) => CreateRoomElement(item, UpdateList))}
          </Grid>
        ) : (
          <Typography>No rooms found.</Typography>
        )}
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCreatePopupVisibility(true)}
        >
          Create room
        </Button>
      </Grid>

      {/* TODO  create room gets created with UNDEFINED id*/}
      <EditRoomPopup
        room={{} as RoomDefinition}
        updateRoomLocally={UpdateList}
        isPopupShowing={isCreatePopupShowing}
        setPopupVisibility={setCreatePopupVisibility}
      />
    </Grid>
  );
}

function RoomList(): JSX.Element {
  return <RoomElements />;
}

export default RoomList;
