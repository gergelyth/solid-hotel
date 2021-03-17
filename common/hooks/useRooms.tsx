import {
  getStringNoLocale,
  getThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { FetchItems } from "./util/listThenItemsFetcher";
import { RoomDefinition } from "../types/RoomDefinition";
import { roomFieldToRdfMap } from "../vocabularies/rdf_room";
import { mutate } from "swr";

const swrKey = "rooms";

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

export function useRooms(
  roomDefinitionsUrl: string
): {
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

export function TriggerRefetch(): void {
  mutate(swrKey);
}
