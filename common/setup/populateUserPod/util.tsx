import { RecursiveDelete } from "../shared";
import { GetSession, GetUserReservationsPodUrl } from "../../util/solid";

export async function DeleteAllUserReservations(): Promise<void> {
  const session = GetSession();
  const reservationsUrl = GetUserReservationsPodUrl(session);

  if (!reservationsUrl) {
    return;
  }

  RecursiveDelete(reservationsUrl, session);
}
