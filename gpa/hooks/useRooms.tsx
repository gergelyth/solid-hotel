import {
  getStringNoLocale,
  getThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { FetchItems } from "./util/listThenItemsFetcher";
import { RoomDefinition } from "../types/RoomDefinition";
import { roomDefinitionsUrl } from "../util/solidhoteladmin";
import { roomFieldToRdfMap } from "../vocabularies/rdf_room";

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

export function useRooms(): {
  items: (RoomDefinition | null)[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  return FetchItems<RoomDefinition>(
    "rooms",
    roomDefinitionsUrl,
    ConvertToRoomDefinition
  );
}
