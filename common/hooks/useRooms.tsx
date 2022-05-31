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
import {
  AddLoadingIndicator,
  RemoveLoadingIndicator,
} from "../components/loading-indicators";

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
    id: GetIdFromDatasetUrl(url, 0),
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
  const fetchResult = FetchItems<RoomDefinition>(
    swrKey,
    roomDefinitionsUrl,
    ConvertToRoomDefinition
  );

  if (fetchResult.isValidating) {
    AddLoadingIndicator(swrKey);
  } else {
    RemoveLoadingIndicator(swrKey);
  }

  return fetchResult;
}

function CreateSpecificRoomSwrKey(
  roomUrl: string | undefined
): string[] | null {
  return roomUrl ? [swrKey, roomUrl] : null;
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

  const { data, error, isValidating } = useSWR(
    () => CreateSpecificRoomSwrKey(roomUrl),
    fetcher
  );

  const specificRoomSwrKey = CreateSpecificRoomSwrKey(roomUrl);
  if (specificRoomSwrKey) {
    const swrKeyString = specificRoomSwrKey.join();
    if (isValidating) {
      AddLoadingIndicator(swrKeyString);
    } else {
      RemoveLoadingIndicator(swrKeyString);
    }
  }

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
