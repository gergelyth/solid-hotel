import { RecursiveDelete } from "../setupUtil";
import { GetPodOfSession } from "../../util/solid";
import { GetUserReservationsPodUrl } from "../../util/solidReservations";
import { ShowErrorSnackbar } from "../../components/snackbar";

/**
 * Removes all reservations and reservation inboxes and their containers in the guest Pod.
 * Helper function - required by guest Solid Pod setup.
 */
export async function DeleteAllUserReservations(): Promise<void> {
  const reservationsUrl = GetUserReservationsPodUrl();

  if (!reservationsUrl) {
    ShowErrorSnackbar("Not logged in!");
    return;
  }

  await RecursiveDelete(reservationsUrl);
}

/**
 * Removes all privacy tokens and their container in the guest Pod.
 * Helper function - required by guest Solid Pod setup.
 */
export async function DeleteUserPrivacyFolders(): Promise<void> {
  //TODO extract this into variable
  await RecursiveDelete(GetPodOfSession() + "/privacy");
}
