import {
  createContainerAt,
  setStringNoLocale,
  setThing,
  setUrl,
} from "@inrupt/solid-client";
import { GetSession } from "../../util/solid";
import { SetSubmitterAccessToEveryone } from "../../util/solidAccess";
import {
  BookingInboxUrl,
  DataProtectionProfilesUrl,
  HotelProfilesUrl,
  HotelWebId,
  PrivacyTokensUrl,
  ReservationsUrl,
  RoomDefinitionsUrl,
} from "../../consts/solidIdentifiers";
import { RecursiveDelete } from "../setupUtil";
import { HotelFieldToRdfMap } from "../../vocabularies/rdfHotel";
import {
  HotelAddress,
  HotelLocation,
  HotelName,
} from "../../consts/hotelConsts";
import { RoomDefinition } from "../../types/RoomDefinition";
import { CreateOrUpdateRoom } from "../../../pms/util/solidHotelSpecific";
import { GetProfileOf } from "../../util/solidProfile";
import { ShowError } from "../../util/helpers";
import { SafeSaveDatasetAt } from "../../util/solidWrapper";

/**
 * Creates some example room definitions meant as test data with which to populate the hotel Pod.
 * Helper function - required by hotel Solid Pod setup.
 */
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

/**
 * Removes all reservations and reservation inboxes and their container contained in the hotel Pod.
 * Helper function - required by hotel Solid Pod setup.
 */
export async function DeleteAllHotelReservations(): Promise<void> {
  await Promise.all([
    RecursiveDelete(ReservationsUrl),
    RecursiveDelete(BookingInboxUrl),
  ]);
}

/**
 * Removes all rooms and their container contained in the hotel Pod.
 * Helper function - required by hotel Solid Pod setup.
 */
export async function DeleteAllHotelRooms(): Promise<void> {
  await RecursiveDelete(RoomDefinitionsUrl);
}

/**
 * Removes all (hotel and data protection) profiles and their containers contained in the hotel Pod.
 * Helper function - required by hotel Solid Pod setup.
 */
export async function DeleteAllProfiles(): Promise<void> {
  await Promise.all([
    RecursiveDelete(HotelProfilesUrl),
    RecursiveDelete(DataProtectionProfilesUrl),
  ]);
}

/**
 * Removes all privacy tokens and their container contained in the hotel Pod.
 * Helper function - required by hotel Solid Pod setup.
 */
export async function DeletePrivacyFolders(): Promise<void> {
  await RecursiveDelete(PrivacyTokensUrl);
}

/**
 * Creates the booking inbox container which the hotel will monitor for reservations requests from the guest.
 * Helper function - required by hotel Solid Pod setup.
 */
export async function CreateBookingInbox(): Promise<void> {
  const session = GetSession();
  await createContainerAt(BookingInboxUrl, { fetch: session.fetch });
  await SetSubmitterAccessToEveryone(BookingInboxUrl);
}

/**
 * Sets the hotel properties (name, location, address) in the hotel Pod profile.
 * Helper function - required by hotel Solid Pod setup.
 */
export async function SetupHotelProfile(): Promise<void> {
  const hotelProfile = await GetProfileOf(HotelWebId);
  if (!hotelProfile || !hotelProfile.profile || !hotelProfile.dataSet) {
    ShowError("Hotel profile not found", true);
    return;
  }

  let updatedProfile = hotelProfile.profile;
  updatedProfile = setStringNoLocale(
    updatedProfile,
    HotelFieldToRdfMap.name,
    HotelName
  );
  updatedProfile = setUrl(
    updatedProfile,
    HotelFieldToRdfMap.location,
    HotelLocation
  );
  updatedProfile = setStringNoLocale(
    updatedProfile,
    HotelFieldToRdfMap.address,
    HotelAddress
  );
  const updatedDataSet = setThing(hotelProfile.dataSet, updatedProfile);

  await SafeSaveDatasetAt(hotelProfile.profileAddress, updatedDataSet);
}

/**
 * Populates the hotel Pod with sample room definitions.
 * Helper function - required by hotel Solid Pod setup.
 */
export async function PopulateHotelPodWithRooms(): Promise<void> {
  const rooms = CreateRooms();
  await Promise.all(rooms.map((room) => CreateOrUpdateRoom(room)));
}
