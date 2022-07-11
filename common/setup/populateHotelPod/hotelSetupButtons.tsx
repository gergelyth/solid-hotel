import {
  ShowInfoSnackbar,
  ShowSuccessSnackbar,
} from "../../components/snackbar";
import {
  DeleteAllHotelReservations,
  DeleteAllHotelRooms,
  DeleteAllProfiles,
  DeletePrivacyFolders,
} from "./hotelSetupUtil";
import {
  DataProtectionProfilesUrl,
  HotelProfilesUrl,
  PrivacyTokensInboxUrl,
  PrivacyTokensUrl,
  RoomDefinitionsUrl,
} from "../../consts/solidIdentifiers";
import {
  PopulateHotelPodWithRooms,
  CreateBookingInbox,
  SetupHotelProfile,
} from "./hotelSetupUtil";
import { GetSession } from "../../util/solid";
import { CreatePrivacyFolders } from "../setupUtil";
import { createContainerAt } from "@inrupt/solid-client";
import { GetUserReservationsPodUrl } from "../../util/solid_reservations";
import { SetReadAccessToEveryone } from "../../util/solid_access";

/**
 * Removes all application specific items and containers except the rooms.
 * Helper function - required by hotel Solid Pod setup.
 */
export function GetClearAllButRoomsFunction(): () => void {
  return async () => {
    let closeInfoSnackbar = ShowInfoSnackbar(
      "Deleting privacy folders...",
      true
    );
    await DeletePrivacyFolders();
    ShowSuccessSnackbar("All privacy folders deleted", closeInfoSnackbar);
    closeInfoSnackbar = ShowInfoSnackbar(
      "Deleting hotel and data protection profiles...",
      true
    );
    await DeleteAllProfiles();
    ShowSuccessSnackbar(
      "All hotel and data protection profiles deleted",
      closeInfoSnackbar
    );
    closeInfoSnackbar = ShowInfoSnackbar(
      "Deleting hotel reservations...",
      true
    );
    await DeleteAllHotelReservations();
    ShowSuccessSnackbar("All hotel reservations deleted", closeInfoSnackbar);
    ShowSuccessSnackbar("Clear all but rooms function finished!");
  };
}

/**
 * Removes all room definitions and the container which includes them.
 * Helper function - required by hotel Solid Pod setup.
 */
export function GetClearAllRoomsFunction(): () => void {
  return async () => {
    const closeInfoSnackbar = ShowInfoSnackbar("Deleting hotel rooms...", true);
    await DeleteAllHotelRooms();
    ShowSuccessSnackbar("All hotel rooms deleted", closeInfoSnackbar);
  };
}

/**
 * Creates the application specific containers, but no further items in them.
 * Helper function - required by hotel Solid Pod setup.
 */
export function GetCreateEmptySetupFunction(): () => void {
  return async () => {
    let closeInfoSnackbar = ShowInfoSnackbar(
      "Creating only the folders...",
      true
    );
    const session = GetSession();
    await Promise.all([
      CreateBookingInbox(),
      createContainerAt(HotelProfilesUrl, {
        fetch: session.fetch,
      }),
      createContainerAt(DataProtectionProfilesUrl, {
        fetch: session.fetch,
      }),
      createContainerAt(RoomDefinitionsUrl, {
        fetch: session.fetch,
      }),
      createContainerAt(GetUserReservationsPodUrl() ?? "", {
        fetch: session.fetch,
      }),
    ]);
    await SetReadAccessToEveryone(RoomDefinitionsUrl);
    ShowSuccessSnackbar("Folders created", closeInfoSnackbar);

    closeInfoSnackbar = ShowInfoSnackbar("Creating privacy folders...", true);
    await CreatePrivacyFolders(PrivacyTokensUrl, PrivacyTokensInboxUrl);
    ShowSuccessSnackbar("Privacy folders created", closeInfoSnackbar);

    ShowSuccessSnackbar("Empty setup function finished!");
  };
}

/**
 * Saves the hotel properties into the hotel profile (name, location, address).
 * Helper function - required by hotel Solid Pod setup.
 */
export function GetSetupHotelProfileFunction(): () => void {
  return async () => {
    const closeInfoSnackbar = ShowInfoSnackbar(
      "Adding information to the hotel profile...",
      true
    );
    await SetupHotelProfile();
    ShowSuccessSnackbar("Hotel profile setup successful", closeInfoSnackbar);
  };
}

/**
 * Creates the room definitions container in the hotel Pod and populates them with room definitions.
 * Helper function - required by hotel Solid Pod setup.
 */
export function GetAddRoomsFunction(): () => void {
  return async () => {
    const closeInfoSnackbar = ShowInfoSnackbar(
      "Populating hotel Pod with rooms...",
      true
    );
    await PopulateHotelPodWithRooms();
    ShowSuccessSnackbar("Hotel Pod populated with rooms", closeInfoSnackbar);
  };
}
