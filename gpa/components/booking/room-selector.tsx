import { useRooms } from "../../../common/hooks/useRooms";
import { RoomDefinitionsUrl } from "../../../common/consts/solidIdentifiers";
import { RoomDefinition } from "../../../common/types/RoomDefinition";

function EmptyDescription(): JSX.Element {
  return <i>No description</i>;
}

function CreateRoomElement(room: RoomDefinition | null): JSX.Element {
  if (!room) {
    return <li>empty</li>;
  }
  return (
    <li key={room.id}>
      <h3>Name: {room.name}</h3>
      <p>{room.description ?? EmptyDescription()}</p>
    </li>
  );
}

function RoomElements(): JSX.Element {
  const { items, isLoading, isError } = useRooms(RoomDefinitionsUrl);

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
      {isArrayNonEmpty ? (
        <ul>{items.map((item) => CreateRoomElement(item))}</ul>
      ) : (
        <i>No rooms found</i>
      )}
    </div>
  );
}

function RoomSelector(): JSX.Element {
  return (
    <div>
      <RoomElements />
    </div>
  );
}

export default RoomSelector;
