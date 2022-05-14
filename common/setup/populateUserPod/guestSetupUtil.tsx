import { RecursiveDelete } from "../setupUtil";
import { GetPodOfSession, GetSession } from "../../util/solid";
import { GetUserReservationsPodUrl } from "../../util/solid_reservations";
import { ShowErrorSnackbar } from "../../components/snackbar";

export async function DeleteAllUserReservations(): Promise<void> {
  const session = GetSession();
  const reservationsUrl = GetUserReservationsPodUrl(session);

  if (!reservationsUrl) {
    ShowErrorSnackbar("Not logged in!");
    return;
  }

  await RecursiveDelete(reservationsUrl);
}

export async function DeleteUserPrivacyFolders(): Promise<void> {
  //TODO extract this into variable
  await RecursiveDelete(GetPodOfSession() + "/privacy");
}
