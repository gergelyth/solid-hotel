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

export function GetRoomUrls(): {
  roomUrls: UrlString[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const fetcher = (_: string, url: string): Promise<UrlString[]> => {
    return GetDataSet(url).then((dataset) =>
      getContainedResourceUrlAll(dataset)
    );
  };

  // here we have to care that this key in useSWR has to be unique across the whole application (to handle caching)
  // so perhaps use more descriptive name, such as "solid-firstName" or whatever

  // if we specify key (first argument of useSWR) as an array, the ID for caching will be calculated for the combination of the elements
  // https://swr.vercel.app/docs/arguments
  const { data, error } = useSWR(["room_list", roomDefinitionsUrl], fetcher);

  return {
    roomUrls: data,
    isLoading: !error && !data,
    isError: error,
  };
}

function ConvertToRoomDefinition(
  dataset: SolidDataset,
  roomId: string
): RoomDefinition | null {
  const roomThing = getThing(dataset, "room");
  if (!roomThing) {
    return null;
  }
  // TODO: modify No Id and No Name
  return {
    id: roomId,
    name: getStringNoLocale(roomThing, roomFieldToRdfMap.name) ?? "No name",
    description:
      getStringNoLocale(roomThing, roomFieldToRdfMap.description) ?? undefined,
  };
}

function FetchRoom(url: UrlString): JSX.Element {
  const fetcher = (
    roomId: string,
    url: string
  ): Promise<RoomDefinition | null> => {
    return GetDataSet(url).then((dataset) =>
      ConvertToRoomDefinition(dataset, roomId)
    );
  };

  // here we have to care that this key in useSWR has to be unique across the whole application (to handle caching)
  // so perhaps use more descriptive name, such as "solid-firstName" or whatever

  // if we specify key (first argument of useSWR) as an array, the ID for caching will be calculated for the combination of the elements
  // https://swr.vercel.app/docs/arguments
  const roomId = url.split("/").pop();
  if (!roomId) {
    return <li>Room no ID!</li>;
  }

  const { data, error } = useSWR([roomId, url], fetcher);
  const isLoading = !error && !data;

  if (isLoading) {
    return <li>Loading...</li>;
  }
  if (error || !data) {
    return <li>Fetching room {roomId} failed.</li>;
  }
  return (
    <li key={data.id}>
      <h3>Name: {data.name}</h3>
      <p>{data.description ?? EmptyDescription()}</p>
    </li>
  );
}

function GetRooms(): JSX.Element {
  const { roomUrls, isLoading, isError } = GetRoomUrls();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !roomUrls) {
    return <div>Fetching the room list failed.</div>;
  }

  return (
    <div>
      <ul>{roomUrls.map((roomUrl) => FetchRoom(roomUrl))}</ul>
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
