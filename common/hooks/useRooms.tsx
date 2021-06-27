import {
  getStringNoLocale,
  getThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { FetchItems } from "./util/listThenItemsFetcher";
import { RoomDefinition } from "../types/RoomDefinition";
import { roomFieldToRdfMap } from "../vocabularies/rdf_room";
import useSWR, { mutate } from "swr";
import { GetDataSet } from "../util/solid";
import { GetIdFromDatasetUrl } from "../util/urlParser";

const swrKey = "rooms";

function ConvertToRoomDefinition(
  dataset: SolidDataset,
  url: string
): RoomDefinition | null {
  const roomThing = getThing(dataset, url + "#room");
  if (!roomThing) {
    return null;
  }
  const room = {
    id: GetIdFromDatasetUrl(url),
    name:
      getStringNoLocale(roomThing, roomFieldToRdfMap.name) ?? "<No room name>",
    description:
      getStringNoLocale(roomThing, roomFieldToRdfMap.description) ?? undefined,
  };
  return room;
}

export function useRooms(roomDefinitionsUrl: string): {
  items: (RoomDefinition | null)[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isValidating: boolean;
} {
  return FetchItems<RoomDefinition>(
    swrKey,
    roomDefinitionsUrl,
    ConvertToRoomDefinition
  );
}

export function useSpecificRoom(roomUrl: string | undefined): {
  room: RoomDefinition | null | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const fetcher = (): Promise<RoomDefinition | null | undefined> => {
    if (!roomUrl) {
      return Promise.resolve(undefined);
    }
    return GetDataSet(roomUrl).then((roomDataset) =>
      ConvertToRoomDefinition(roomDataset, roomUrl)
    );
  };

  const { data, error } = useSWR(
    () => (roomUrl ? [swrKey, roomUrl] : null),
    fetcher
  );

  return {
    room: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function Revalidate(): void {
  mutate(swrKey);
}

export function TriggerRefetch(newRoomList: (RoomDefinition | null)[]): void {
  mutate(swrKey, newRoomList, false);
}
