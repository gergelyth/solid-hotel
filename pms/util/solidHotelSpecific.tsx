import {
  addStringNoLocale,
  createSolidDataset,
  createThing,
  setThing,
} from "@inrupt/solid-client";
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
import { GetDataSet } from "../../common/util/solid";
import { SetReadAccessToEveryone } from "../../common/util/solid_access";
import {
  SafeCreateContainerAt,
  SafeDeleteDataset,
  SafeSaveDatasetInContainer,
} from "../../common/util/solid_wrapper";

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
export async function CreateOrUpdateRoom(room: RoomDefinition): Promise<void> {
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

  await CheckOrCreateRoomContainer();

  await SafeSaveDatasetInContainer(RoomDefinitionsUrl, roomDataset);
}

/**
 * Tries to fetch the room container from the hotel Pod - if the container doesn't exist yet, it creates it and sets the appropriate Read persmission for the Public.
 */
async function CheckOrCreateRoomContainer(): Promise<void> {
  try {
    await GetDataSet(RoomDefinitionsUrl);
  } catch (e) {
    await SafeCreateContainerAt(RoomDefinitionsUrl);
    await SetReadAccessToEveryone(RoomDefinitionsUrl);
  }
}

/**
 * Constucts the room definition URL based on the object passed and deletes it from the hotel Pod.
 */
export async function DeleteRoom(room: RoomDefinition): Promise<void> {
  await SafeDeleteDataset(RoomDefinitionsUrl + room.id);
}
