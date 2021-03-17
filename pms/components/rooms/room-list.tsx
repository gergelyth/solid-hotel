import { useRooms } from "../../../common/hooks/useRooms";
import { RoomDefinitionsUrl } from "../../../common/consts/solidIdentifiers";
import { RoomDefinition } from "../../../common/types/RoomDefinition";
import EditableRoomElement from "./editable-room";
import { Dispatch, SetStateAction, useState } from "react";

function CreateRoomElement(
  room: RoomDefinition | null,
  setLatestModifiedRoom: Dispatch<SetStateAction<boolean>>
): JSX.Element {
  if (!room) {
    return <li>empty</li>;
  }
  return (
    <li key={room.id}>
      <EditableRoomElement
        room={room}
        setRoom={(newRoom: RoomDefinition) => setLatestModifiedRoom(true)}
      />
    </li>
  );
}

function RoomElements(): JSX.Element {
  const { items, isLoading, isError, isValidating } = useRooms(
    RoomDefinitionsUrl
  );
  const [refetchInProgress, setRefetchInProgress] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !items) {
    return <div>Fetching the rooms failed.</div>;
  }

  const isArrayNonEmpty =
    items.length > 0 && items.some((item) => item !== null);

  return (
    <div>
      <div>{refetchInProgress || isValidating ? "Updating..." : ""}</div>
      {isArrayNonEmpty ? (
        <ul>
          {items.map((item) => CreateRoomElement(item, setRefetchInProgress))}
        </ul>
      ) : (
        <i>No rooms found</i>
      )}
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
