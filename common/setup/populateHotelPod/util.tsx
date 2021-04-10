import {
  CancellationsUrl,
  ReservationsUrl,
  RoomDefinitionsUrl,
} from "../../consts/solidIdentifiers";
import { GetHotelSession } from "../../util/solidhoteladmin";
import { RecursiveDelete } from "../shared";

export async function DeleteAllHotelCancellations(): Promise<void> {
  // TODO: get Hotel session here
  RecursiveDelete(CancellationsUrl, GetHotelSession());
}

export async function DeleteAllHotelReservations(): Promise<void> {
  // TODO: get Hotel session here
  RecursiveDelete(ReservationsUrl, GetHotelSession());
}

export async function DeleteAllHotelRooms(): Promise<void> {
  // TODO: get Hotel session here
  RecursiveDelete(RoomDefinitionsUrl, GetHotelSession());
}
