import styles from "../../styles/Home.module.css";
import { RoomDefinition } from "../../types/RoomDefinition";
import {
  getStringNoLocale,
  getThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { roomDefinitionsUrl } from "../../util/solidhoteladmin";
import { roomFieldToRdfMap } from "../../vocabularies/rdf_room";
import { GetItems } from "../common/fetchListThenItemsFromPod";

function ConvertToRoomDefinition(
  dataset: SolidDataset,
  url: string
): RoomDefinition | null {
  const roomId = url.split("/").pop();
  if (!roomId) {
    return null;
  }
  const roomThing = getThing(dataset, url + "#room");
  if (!roomThing) {
    return null;
  }
  // TODO: modify No Id and No Name
  const room = {
    id: roomId,
    name: getStringNoLocale(roomThing, roomFieldToRdfMap.name) ?? "No name",
    description:
      getStringNoLocale(roomThing, roomFieldToRdfMap.description) ?? undefined,
  };
  return room;
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

function EmptyDescription(): JSX.Element {
  return <i>No description</i>;
}

function RoomSelector(): JSX.Element {
  return (
    <div>
      <h1 className={styles.title}>Please select a room</h1>
      {/* <h2>Reservation count: {reservations.length}</h2> */}

      {GetItems<RoomDefinition>(
        "rooms",
        roomDefinitionsUrl,
        CreateRoomElement,
        ConvertToRoomDefinition
      )}
    </div>
  );
}

export default RoomSelector;
