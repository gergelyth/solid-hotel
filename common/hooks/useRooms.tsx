import { getStringNoLocale, SolidDataset } from "@inrupt/solid-client";
import { FetchItems } from "./util/listThenItemsFetcher";
import { RoomDefinition } from "../types/RoomDefinition";
import { roomFieldToRdfMap } from "../vocabularies/rdf_room";
import useSWR, { mutate } from "swr";
import { GetDataSet, GetThing } from "../util/solid";
import { GetIdFromDatasetUrl } from "../util/urlParser";
import {
  AddLoadingIndicator,
  RemoveLoadingIndicator,
} from "../components/loading-indicators";

const swrKey = "rooms";

/**
 * Parses the room definition from the Solid dataset.
 * @returns The parsed room definition or null (if there's an issue with the dataset).
 */
function ConvertToRoomDefinition(
  dataset: SolidDataset,
  url: string
): RoomDefinition | null {
  const roomThing = GetThing(dataset, "room");
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

/**
 * Fetches the rooms contained in the container whose URL is passed to the function.
 * SWR settings are taken from {@link GlobalSwrConfig}
 * @returns The reservations and further flags representing the state of the fetch (isLoading, isError, isValidating).
 */
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

/**
 * Creates the SWR key distinguishing between possible cases to make sure one case's cache is not used for another case's retrieval.
 * @returns The SWR key fit for the specific case.
 */
function CreateSpecificRoomSwrKey(
  roomUrl: string | undefined
): string[] | null {
  return roomUrl ? [swrKey, roomUrl] : null;
}

/**
 * Fetches and parses the room whose URL address is passed to the function.
 * SWR settings are taken from {@link GlobalSwrConfig}
 * @returns The reservations and further flags representing the state of the fetch (isLoading, isError, isValidating).
 */
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

/**
 * Triggers a refetch of the rooms.
 */
export function Revalidate(): void {
  mutate(swrKey);
}

/**
 * Puts the supplied values into the SWR cache quickly to make the change feel immediate.
 */
export function TriggerRefetch(newRoomList: (RoomDefinition | null)[]): void {
  mutate(swrKey, newRoomList, false);
}
