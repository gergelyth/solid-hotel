import {
  addStringNoLocale,
  createContainerAt,
  createSolidDataset,
  createThing,
  deleteSolidDataset,
  getSolidDataset,
  saveSolidDatasetInContainer,
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
  SetFieldInSolidProfile,
} from "../../common/util/solid_profile";
import { GetSession } from "../../common/util/solid";
import { SetReadAccessToEveryone } from "../../common/util/solid_access";

/**
 * Fetches the profile of the hotel and sets the field value to be the value passed to the function.
 * Saves the profile to the Pod.
 */
export async function SetHotelProfileField(
  field: string,
  value: string
): Promise<void> {
  const hotelProfile = await GetProfileOf(HotelWebId);
  SetFieldInSolidProfile(hotelProfile, field, value);
}

/**
 * Creates the Solid dataset from the room definition object passed to the function.
 * Saves it in the hotel Pod creating the room definition container if not already present.
 */
export async function CreateOrUpdateRoom(
  room: RoomDefinition,
  session: Session = GetSession()
): Promise<void> {
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

  await CheckOrCreateRoomContainer(session);

  await saveSolidDatasetInContainer(RoomDefinitionsUrl, roomDataset, {
    fetch: session.fetch,
  });
}

/**
 * Tries to fetch the room container from the hotel Pod - if the container doesn't exist yet, it creates it and sets the appropriate Read persmission for the Public.
 */
async function CheckOrCreateRoomContainer(session: Session): Promise<void> {
  try {
    await getSolidDataset(RoomDefinitionsUrl, {
      fetch: session.fetch,
    });
  } catch (e) {
    await createContainerAt(RoomDefinitionsUrl, { fetch: session.fetch });
    await SetReadAccessToEveryone(RoomDefinitionsUrl);
  }
}

/**
 * Constucts the room definition URL based on the object passed and deletes it from the hotel Pod.
 */
export async function DeleteRoom(
  room: RoomDefinition,
  session: Session = GetSession()
): Promise<void> {
  await deleteSolidDataset(RoomDefinitionsUrl + room.id, {
    fetch: session.fetch,
  });
}
