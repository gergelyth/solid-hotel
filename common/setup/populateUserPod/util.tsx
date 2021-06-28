import { RecursiveDelete } from "../shared";
import { GetSession } from "../../util/solid";
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
