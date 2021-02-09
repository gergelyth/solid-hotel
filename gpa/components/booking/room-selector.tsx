import useSWR from "swr";
import styles from "../../styles/Home.module.css";
import { RoomDefinition } from "../../types/RoomDefinition";
import {
  getContainedResourceUrlAll,
  getStringNoLocale,
  getThing,
  SolidDataset,
  UrlString,
} from "@inrupt/solid-client";
import { GetDataSet } from "../../util/solid";
import { roomDefinitionsUrl } from "../../util/solidhoteladmin";
import { roomFieldToRdfMap } from "../../vocabularies/rdf_room";

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

function ProcessRoom(url: UrlString): Promise<RoomDefinition | null> {
  return GetDataSet(url).then((dataset) => {
    return ConvertToRoomDefinition(dataset, url);
  });
}

function FetchRooms(): {
  rooms: (RoomDefinition | null)[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const fetcher = (
    _: string,
    url: string
  ): Promise<(RoomDefinition | null)[]> => {
    return GetDataSet(url).then((dataset) => {
      const urls = getContainedResourceUrlAll(dataset);
      const rooms = urls.map((roomUrl) => ProcessRoom(roomUrl));
      return Promise.all(rooms);
    });
  };

  // here we have to care that this key in useSWR has to be unique across the whole application (to handle caching)
  // so perhaps use more descriptive name, such as "solid-firstName" or whatever

  // if we specify key (first argument of useSWR) as an array, the ID for caching will be calculated for the combination of the elements
  // https://swr.vercel.app/docs/arguments

  const { data, error } = useSWR(["rooms", roomDefinitionsUrl], fetcher);
  return {
    rooms: data,
    isLoading: !error && !data,
    isError: error,
  };
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

function GetRooms(): JSX.Element {
  const { rooms, isLoading, isError } = FetchRooms();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !rooms) {
    return <div>Fetching the room list failed.</div>;
  }

  return (
    <div>
      <ul>{rooms.map((room) => CreateRoomElement(room))}</ul>
    </div>
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

      {GetRooms()}
    </div>
  );
}

export default RoomSelector;
