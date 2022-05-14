import {
  DeleteAllUserReservations,
  DeleteUserPrivacyFolders,
} from "../setup/populateUserPod/util";
import PopulateUserPodWithReservations from "../setup/populateUserPod/withReservations";
import { GetPodOfSession, GetSession } from "../util/solid";
import { ShowInfoSnackbar, ShowSuccessSnackbar } from "../components/snackbar";
import { CreatePrivacyFolders } from "../setup/shared";
import { createContainerAt } from "@inrupt/solid-client";
import { GetUserReservationsPodUrl } from "../util/solid_reservations";

export function GetGuestClearEverythingFunction(): () => void {
  return async () => {
    ShowInfoSnackbar("Deleting user privacy folders...");
    await DeleteUserPrivacyFolders();
    ShowSuccessSnackbar("All user privacy folders have been deleted");
    ShowInfoSnackbar("Deleting user reservations...");
    await DeleteAllUserReservations();
    ShowSuccessSnackbar("All user reservations have been deleted");
  };
}

export function GetGuestEmptySetupFunction(): () => void {
  return async () => {
    ShowInfoSnackbar("Creating only the folders...");
    const session = GetSession();
    await createContainerAt(GetUserReservationsPodUrl() ?? "", {
      fetch: session.fetch,
    });
    ShowSuccessSnackbar("Folders created");
    ShowInfoSnackbar("Creating privacy folders...");
    //TODO make this a variable
    await CreatePrivacyFolders(GetPodOfSession() + "/privacy");
    ShowSuccessSnackbar("Privacy folders created");
  };
}

export function GetGuestAddReservationsFunction(): () => void {
  return async () => {
    ShowInfoSnackbar("Populating user Pod with reservations...");
    //TODO hardcoded - should be the WebId of the currently logged in user when the hotel operations work with the secrets
    await PopulateUserPodWithReservations(
      "https://gergelyth.inrupt.net/profile/card#me"
    );
    ShowSuccessSnackbar("Reservations added to user pod");
  };
}
