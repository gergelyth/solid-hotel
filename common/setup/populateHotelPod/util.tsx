import { deleteSolidDataset } from "@inrupt/solid-client";
import {
  CancellationsUrl,
  ReservationsUrl,
  RoomDefinitionsUrl,
} from "../../consts/solidIdentifiers";
import { GetHotelSession } from "../../util/solidhoteladmin";

export async function DeleteAllHotelCancellations(): Promise<void> {
  // TODO: get Hotel session here
  const session = GetHotelSession();

  await deleteSolidDataset(CancellationsUrl, {
    fetch: session.fetch,
  });
}

export async function DeleteAllHotelReservations(): Promise<void> {
  // TODO: get Hotel session here
  const session = GetHotelSession();

  await deleteSolidDataset(ReservationsUrl, {
    fetch: session.fetch,
  });
}

export async function DeleteAllHotelRooms(): Promise<void> {
  // TODO: get Hotel session here
  const session = GetHotelSession();

  await deleteSolidDataset(RoomDefinitionsUrl, {
    fetch: session.fetch,
  });
}
