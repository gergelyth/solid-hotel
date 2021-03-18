import { TriggerRefetch, useRooms } from "../../../common/hooks/useRooms";
import { RoomDefinitionsUrl } from "../../../common/consts/solidIdentifiers";
import { RoomDefinition } from "../../../common/types/RoomDefinition";
import EditableRoomElement from "./editable-room";
import { useState } from "react";
import styles from "../../../common/styles/Home.module.css";
import EditRoomPopup from "./edit-room-popup";

function CreateRoomElement(
  room: RoomDefinition | null,
  updateList: (newRoom: RoomDefinition, isDelete: boolean) => void
): JSX.Element {
  if (!room) {
    return <li>empty</li>;
  }
  return (
    <li key={room.id}>
      <EditableRoomElement room={room} updateRoomLocally={updateList} />
    </li>
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
    return <div>Loading...</div>;
  }
  if (isError || !items) {
    return <div>Fetching the rooms failed.</div>;
  }

  const isArrayNonEmpty =
    items.length > 0 && items.some((item) => item !== null);

  return (
    <div className={styles.simpleContainer}>
      {isArrayNonEmpty ? (
        <ul>{items.map((item) => CreateRoomElement(item, UpdateList))}</ul>
      ) : (
        <i>No rooms found</i>
      )}
      <button onClick={() => setCreatePopupVisibility(true)}>
        Create room
      </button>
      {/* TODO  create room gets created with UNDEFINED id*/}
      <EditRoomPopup
        room={{} as RoomDefinition}
        updateRoomLocally={UpdateList}
        isPopupShowing={isCreatePopupShowing}
        setPopupVisibility={setCreatePopupVisibility}
      />
    </div>
  );
}

function RoomList(): JSX.Element {
  return (
    <div>
      <RoomElements />
    </div>
  );
}

export default RoomList;
