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

export function GetClearAllButRoomsFunction(): () => void {
  return async () => {
    ShowInfoSnackbar("Deleting privacy folders...");
    await DeletePrivacyFolders();
    ShowSuccessSnackbar("All privacy folders deleted");
    ShowInfoSnackbar("Deleting hotel and data protection profiles...");
    await DeleteAllProfiles();
    ShowSuccessSnackbar("All hotel and data protection profiles deleted");
    ShowInfoSnackbar("Deleting hotel reservations...");
    await DeleteAllHotelReservations();
    ShowSuccessSnackbar("All hotel reservations deleted");
  };
}

export function GetClearAllRoomsFunction(): () => void {
  return async () => {
    ShowInfoSnackbar("Deleting hotel rooms...");
    await DeleteAllHotelRooms();
    ShowSuccessSnackbar("All hotel rooms deleted");
  };
}

export function GetCreateEmptySetupFunction(): () => void {
  return async () => {
    ShowInfoSnackbar("Creating only the folders...");
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
    ShowSuccessSnackbar("Folders created");
    ShowInfoSnackbar("Creating privacy folders...");
    await CreatePrivacyFolders(PrivacyTokensUrl, PrivacyTokensInboxUrl);
    ShowSuccessSnackbar("Privacy folders created");
  };
}

export function GetSetupHotelProfileFunction(): () => void {
  return async () => {
    ShowInfoSnackbar("Adding information to the hotel profile...");
    await SetupHotelProfile();
    ShowSuccessSnackbar("Hotel profile setup successful");
  };
}

export function GetAddRoomsFunction(): () => void {
  return async () => {
    ShowInfoSnackbar("Populating hotel Pod with rooms...");
    await PopulateHotelPodWithRooms();
    ShowSuccessSnackbar("Hotel Pod populated with rooms");
  };
}
