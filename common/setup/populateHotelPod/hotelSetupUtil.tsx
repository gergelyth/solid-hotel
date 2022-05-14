import { createContainerAt } from "@inrupt/solid-client";
import { GetSession } from "../../util/solid";
import { SetSubmitterAccessToEveryone } from "../../util/solid_access";
import {
  BookingInboxUrl,
  DataProtectionProfilesUrl,
  HotelProfilesUrl,
  PrivacyTokensUrl,
  ReservationsUrl,
  RoomDefinitionsUrl,
} from "../../consts/solidIdentifiers";
import { RecursiveDelete } from "../setupUtil";
import { hotelFieldToRdfMap } from "../../vocabularies/rdf_hotel";
import { SetHotelProfileField } from "../../../pms/util/solidHotelSpecific";
import {
  HotelAddress,
  HotelLocation,
  HotelName,
} from "../../consts/hotelConsts";
import { RoomDefinition } from "../../types/RoomDefinition";
import { CreateOrUpdateRoom } from "../../../pms/util/solidHotelSpecific";

function CreateRooms(): RoomDefinition[] {
  const rooms: RoomDefinition[] = [
    {
      id: null,
      name: "5A",
      description: "Queen-sized bed, ocean-view.",
    },
    {
      id: null,
      name: "78Q",
      description:
        "Twin bed, equipped with a flat screen TV with international TV channels.",
    },
    {
      id: null,
      name: "209U",
      description:
        "King-sized bed, spacious wardrobe. Own bathrooms with a bathtub.",
    },
    {
      id: null,
      name: "9R",
      description:
        "Equipped with a shower, balcony overlooking the gardens. Room is air-conditioned.",
    },
    {
      id: null,
      name: "23A",
    },
  ];

  return rooms;
}

export async function DeleteAllHotelReservations(): Promise<void> {
  await Promise.all([
    RecursiveDelete(ReservationsUrl),
    RecursiveDelete(BookingInboxUrl),
  ]);
}

export async function DeleteAllHotelRooms(): Promise<void> {
  await RecursiveDelete(RoomDefinitionsUrl);
}

export async function DeleteAllProfiles(): Promise<void> {
  await Promise.all([
    RecursiveDelete(HotelProfilesUrl),
    RecursiveDelete(DataProtectionProfilesUrl),
  ]);
}

export async function DeletePrivacyFolders(): Promise<void> {
  await RecursiveDelete(PrivacyTokensUrl);
}

export async function CreateBookingInbox(): Promise<void> {
  const session = GetSession();
  await createContainerAt(BookingInboxUrl, { fetch: session.fetch });
  await SetSubmitterAccessToEveryone(BookingInboxUrl);
}

export async function SetupHotelProfile(): Promise<void> {
  await Promise.all([
    SetHotelProfileField(hotelFieldToRdfMap.name, HotelName),
    //TODO this should be an RDF name (potentially namednode)
    SetHotelProfileField(hotelFieldToRdfMap.location, HotelLocation),
    SetHotelProfileField(hotelFieldToRdfMap.address, HotelAddress),
  ]);
}

export async function PopulateHotelPodWithRooms(): Promise<void> {
  const rooms = CreateRooms();
  await Promise.all(rooms.map((room) => CreateOrUpdateRoom(room)));
}
