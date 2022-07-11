import {
  DeleteAllUserReservations,
  DeleteUserPrivacyFolders,
} from "./guestSetupUtil";
import { GetPodOfSession, GetSession } from "../../util/solid";
import {
  ShowInfoSnackbar,
  ShowSuccessSnackbar,
} from "../../components/snackbar";
import { CreatePrivacyFolders } from "../setupUtil";
import { createContainerAt } from "@inrupt/solid-client";
import { GetUserReservationsPodUrl } from "../../util/solid_reservations";

/**
 * Removes all application specific items and containers in the guest Pod.
 * Helper function - required by guest Solid Pod setup.
 */
export function GetGuestClearEverythingFunction(): () => void {
  return async () => {
    let closeInfoSnackbar = ShowInfoSnackbar(
      "Deleting user privacy folders...",
      true
    );
    await DeleteUserPrivacyFolders();
    ShowSuccessSnackbar(
      "All user privacy folders have been deleted",
      closeInfoSnackbar
    );
    closeInfoSnackbar = ShowInfoSnackbar("Deleting user reservations...", true);
    await DeleteAllUserReservations();
    ShowSuccessSnackbar(
      "All user reservations have been deleted",
      closeInfoSnackbar
    );
    ShowSuccessSnackbar("Clear everything function finished!");
  };
}

/**
 * Creates all containers required for the guest Pod, but no further items in them.
 * Helper function - required by guest Solid Pod setup.
 */
export function GetGuestEmptySetupFunction(): () => void {
  return async () => {
    let closeInfoSnackbar = ShowInfoSnackbar(
      "Creating only the folders...",
      true
    );
    const session = GetSession();
    await createContainerAt(GetUserReservationsPodUrl() ?? "", {
      fetch: session.fetch,
    });
    ShowSuccessSnackbar("Folders created", closeInfoSnackbar);
    closeInfoSnackbar = ShowInfoSnackbar("Creating privacy folders...", true);
    //TODO make this a variable
    await CreatePrivacyFolders(GetPodOfSession() + "/privacy");
    ShowSuccessSnackbar("Privacy folders created", closeInfoSnackbar);
    ShowSuccessSnackbar("Empty setup function finished!");
  };
}
