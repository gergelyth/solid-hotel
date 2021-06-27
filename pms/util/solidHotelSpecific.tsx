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
import { ShowWarningSnackbar } from "../../common/components/snackbar";

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

async function CheckOrCreateRoomContainer(session: Session): Promise<void> {
  try {
    await getSolidDataset(RoomDefinitionsUrl, {
      fetch: session.fetch,
    });
  } catch (e) {
    ShowWarningSnackbar(
      `Room container at [${RoomDefinitionsUrl}] doesn't exist. Creating...`
    );
    await createContainerAt(RoomDefinitionsUrl, { fetch: session.fetch });
    await SetReadAccessToEveryone(RoomDefinitionsUrl, session);
  }
}

export async function DeleteRoom(
  room: RoomDefinition,
  session: Session = GetSession()
): Promise<void> {
  await deleteSolidDataset(RoomDefinitionsUrl + room.id, {
    fetch: session.fetch,
  });
}
