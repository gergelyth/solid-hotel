import { deleteSolidDataset } from "@inrupt/solid-client";
import { GetSession, GetUserReservationsPodUrl } from "../../util/solid";

export async function DeleteAllUserReservations(): Promise<void> {
  const session = GetSession();
  const reservationsUrl = GetUserReservationsPodUrl(session);

  if (!reservationsUrl) {
    return;
  }

  await deleteSolidDataset(reservationsUrl, {
    fetch: session.fetch,
  });
}
