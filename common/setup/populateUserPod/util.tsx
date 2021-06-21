import { RecursiveDelete } from "../shared";
import { GetSession } from "../../util/solid";
import { GetUserReservationsPodUrl } from "../../util/GetUserReservationsPodUrl";

export async function DeleteAllUserReservations(): Promise<void> {
  const session = GetSession();
  const reservationsUrl = GetUserReservationsPodUrl(session);

  if (!reservationsUrl) {
    return;
  }

  RecursiveDelete(reservationsUrl, session);
}
