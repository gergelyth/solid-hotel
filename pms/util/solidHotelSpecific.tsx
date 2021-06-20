import {
  addStringNoLocale,
  createSolidDataset,
  createThing,
  deleteSolidDataset,
  saveSolidDatasetAt,
  setThing,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { RoomDefinition } from "../../common/types/RoomDefinition";
import { roomFieldToRdfMap } from "../../common/vocabularies/rdf_room";
import {
  HotelWebId,
  RoomDefinitionsUrl,
} from "../../common/consts/solidIdentifiers";
import {
  GetProfileOf,
  GetSession,
  SetFieldInSolidProfile,
} from "../../common/util/solid";

export async function SetHotelProfileField(
  field: string,
  value: string,
  session: Session = GetSession()
): Promise<void> {
  const hotelProfile = await GetProfileOf(HotelWebId, session);

  SetFieldInSolidProfile(hotelProfile, field, value, session);
}

export async function CreateOrUpdateRoom(
  room: RoomDefinition,
  session: Session = GetSession()
): Promise<void> {
  // TODO: make rooms folder public programatically
  let roomDataset = createSolidDataset();

  let newRoom = createThing({ name: "room" });
  newRoom = addStringNoLocale(newRoom, roomFieldToRdfMap.name, room.name);
  if (room.description) {
    newRoom = addStringNoLocale(
      newRoom,
      roomFieldToRdfMap.description,
      room.description
    );
  }

  roomDataset = setThing(roomDataset, newRoom);

  await saveSolidDatasetAt(RoomDefinitionsUrl + room.id, roomDataset, {
    fetch: session.fetch,
  });
}

export async function DeleteRoom(
  room: RoomDefinition,
  session: Session = GetSession()
): Promise<void> {
  await deleteSolidDataset(RoomDefinitionsUrl + room.id, {
    fetch: session.fetch,
  });
}
